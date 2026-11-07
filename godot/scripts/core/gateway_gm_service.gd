extends Node
class_name GatewayGMService

const BuildConfig = preload("res://scripts/core/build_config.gd")

var auth_service: Node
var busy := false
var status_message := "Gateway belum dihubungi."

func set_auth_service(service: Node) -> void:
	auth_service = service

func is_configured() -> bool:
	return not str(BuildConfig.GM_GATEWAY_URL).is_empty()

func generate(prompt: String, snapshot: String, version: String) -> Dictionary:
	if busy:
		return {"ok": false, "message": "Permintaan GM sebelumnya masih berjalan."}
	if not is_configured():
		status_message = "AI Gateway belum dikonfigurasi pada build ini."
		return {"ok": false, "message": status_message}
	if snapshot.length() != 40 or version.is_empty():
		status_message = "Snapshot canon dan versi GM belum terverifikasi."
		return {"ok": false, "message": status_message}
	if prompt.strip_edges().is_empty():
		return {"ok": false, "message": "Prompt GM kosong."}
	if auth_service == null:
		return {"ok": false, "message": "Supabase Auth belum tersedia."}
	var auth: Dictionary = await auth_service.get_valid_access_token()
	if not bool(auth.get("ok", false)):
		status_message = str(auth.get("message", "Login Supabase diperlukan."))
		return {"ok": false, "message": status_message}
	busy = true
	var http := HTTPRequest.new()
	http.timeout = 60.0
	add_child(http)
	var headers := PackedStringArray([
		"Authorization: Bearer " + str(auth.get("token", "")),
		"Content-Type: application/json",
		"Cache-Control: no-store"
	])
	var body := JSON.stringify({"prompt": prompt, "snapshot": snapshot, "version": version})
	var error := http.request(str(BuildConfig.GM_GATEWAY_URL).trim_suffix("/") + "/v1/gm", headers, HTTPClient.METHOD_POST, body)
	if error != OK:
		http.queue_free()
		busy = false
		status_message = "Request Gateway gagal dimulai: " + error_string(error)
		return {"ok": false, "message": status_message}
	var result: Array = await http.request_completed
	http.queue_free()
	busy = false
	var result_code := int(result[0])
	var response_code := int(result[1])
	var raw: PackedByteArray = result[3]
	if result_code != HTTPRequest.RESULT_SUCCESS:
		status_message = "Koneksi AI Gateway gagal (" + str(result_code) + ")."
		return {"ok": false, "message": status_message}
	var parsed: Variant = JSON.parse_string(raw.get_string_from_utf8())
	if not (parsed is Dictionary):
		status_message = "AI Gateway mengembalikan respons yang tidak valid."
		return {"ok": false, "message": status_message}
	var payload: Dictionary = parsed
	if response_code < 200 or response_code >= 300:
		status_message = str(payload.get("error", "AI Gateway request failed."))
		return {"ok": false, "message": status_message}
	if str(payload.get("snapshot", "")) != snapshot or str(payload.get("version", "")) != version:
		status_message = "AI Gateway mengembalikan snapshot atau versi yang berbeda."
		return {"ok": false, "message": status_message}
	if not (payload.get("response") is String):
		status_message = "AI Gateway tidak mengembalikan teks GM."
		return {"ok": false, "message": status_message}
	status_message = "Respons GM diterima dan perlu melewati validator proposal."
	return {"ok": true, "response": str(payload.response), "snapshot": snapshot, "version": version}
