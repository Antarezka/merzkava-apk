extends Node
class_name SupabaseAuthService

const BuildConfig = preload("res://scripts/core/build_config.gd")
const SESSION_KEY := "merzkava.auth.session.v1"
const EXPIRY_SKEW_SECONDS := 90

var native_plugin: Object
var session: Dictionary = {}
var status_message := "Belum masuk ke Supabase."
var busy := false
var last_error := ""

func set_native_plugin(plugin: Object) -> void:
	native_plugin = plugin

func is_configured() -> bool:
	return not str(BuildConfig.SUPABASE_URL).is_empty() and not str(BuildConfig.SUPABASE_ANON_KEY).is_empty()

func is_signed_in() -> bool:
	return not session.is_empty() and not str(session.get("access_token", "")).is_empty()

func get_user_email() -> String:
	var user: Dictionary = session.get("user", {})
	return str(user.get("email", ""))

func get_status() -> Dictionary:
	if not is_configured():
		return {"configured": false, "signed_in": false, "message": "Supabase belum dikonfigurasi pada build ini."}
	return {
		"configured": true,
		"signed_in": is_signed_in(),
		"email": get_user_email(),
		"message": status_message
	}

func _secure_get(key: String) -> String:
	if native_plugin == null or not native_plugin.has_method("secureGet"):
		return ""
	return str(native_plugin.call("secureGet", key))

func _secure_set(key: String, value: String) -> bool:
	if native_plugin == null or not native_plugin.has_method("secureSet"):
		return false
	return str(native_plugin.call("secureSet", key, value)) == "OK"

func _secure_remove(key: String) -> bool:
	if native_plugin == null or not native_plugin.has_method("secureRemove"):
		return false
	return str(native_plugin.call("secureRemove", key)) == "OK"

func _normalize_session(payload: Dictionary) -> Dictionary:
	var access := str(payload.get("access_token", ""))
	var refresh := str(payload.get("refresh_token", ""))
	var user_value: Variant = payload.get("user", {})
	if access.is_empty() or refresh.is_empty() or not (user_value is Dictionary):
		return {}
	var user: Dictionary = user_value
	var expires_in := int(payload.get("expires_in", 3600))
	return {
		"access_token": access,
		"refresh_token": refresh,
		"expires_at": int(Time.get_unix_time_from_system()) + max(1, expires_in),
		"token_type": str(payload.get("token_type", "bearer")),
		"user": {
			"id": str(user.get("id", "")),
			"email": str(user.get("email", ""))
		}
	}

func _send_post(url: String, headers: PackedStringArray, body: Dictionary, timeout: float = 12.0) -> Dictionary:
	var request := HTTPRequest.new()
	request.timeout = timeout
	add_child(request)
	var error := request.request(url, headers, HTTPClient.METHOD_POST, JSON.stringify(body))
	if error != OK:
		request.queue_free()
		return {"ok": false, "message": "Request Supabase gagal dimulai: " + error_string(error)}
	var response: Array = await request.request_completed
	request.queue_free()
	var result_code := int(response[0])
	var response_code := int(response[1])
	var raw: PackedByteArray = response[3]
	if result_code != HTTPRequest.RESULT_SUCCESS:
		return {"ok": false, "message": "Koneksi layanan gagal (" + str(result_code) + ")."}
	var parsed: Variant = JSON.parse_string(raw.get_string_from_utf8())
	if not (parsed is Dictionary):
		return {"ok": false, "message": "Layanan mengembalikan respons yang tidak valid."}
	var payload: Dictionary = parsed
	if response_code < 200 or response_code >= 300:
		var message := str(payload.get("msg", payload.get("message", payload.get("error_description", payload.get("error", "Supabase authentication failed.")))))
		return {"ok": false, "message": message, "status": response_code, "payload": payload}
	return {"ok": true, "payload": payload, "status": response_code}

func _persist_session(value: Dictionary) -> bool:
	if value.is_empty():
		session.clear()
		if native_plugin != null:
			if not _secure_remove(SESSION_KEY):
				var remaining := _secure_get(SESSION_KEY)
				if not remaining.is_empty():
					return false
		return true
	if native_plugin == null:
		# Preview can use an in-memory session only; never store cloud tokens in user://.
		session = value.duplicate(true)
		return true
	if not _secure_set(SESSION_KEY, JSON.stringify(value)):
		return false
	session = value.duplicate(true)
	return true

func restore_session() -> Dictionary:
	if not is_configured():
		status_message = "Supabase belum dikonfigurasi."
		return {"ok": false, "message": status_message}
	if native_plugin == null:
		status_message = "Preview tidak memulihkan token cloud."
		return {"ok": false, "message": status_message}
	var raw := _secure_get(SESSION_KEY)
	if raw.is_empty():
		session.clear()
		status_message = "Belum masuk ke Supabase."
		return {"ok": true, "signed_in": false}
	if raw.begins_with("ERROR:"):
		session.clear()
		status_message = "Token cloud tidak dapat dibaca dari Android Keystore."
		return {"ok": false, "message": status_message}
	var parsed: Variant = JSON.parse_string(raw)
	if not (parsed is Dictionary):
		_persist_session({})
		status_message = "Sesi cloud tersimpan tidak valid dan telah dikunci."
		return {"ok": false, "message": status_message}
	session = parsed
	if int(session.get("expires_at", 0)) <= int(Time.get_unix_time_from_system()) + EXPIRY_SKEW_SECONDS:
		var refreshed: Dictionary = await refresh_session()
		if not bool(refreshed.get("ok", false)):
			_persist_session({})
			status_message = "Sesi cloud berakhir. Silakan masuk kembali."
			return refreshed
	status_message = "Sesi Supabase dipulihkan."
	return {"ok": true, "signed_in": true, "email": get_user_email()}

func _auth_request(path: String, body: Dictionary) -> Dictionary:
	if not is_configured():
		return {"ok": false, "message": "Supabase belum dikonfigurasi. Build perlu SUPABASE_ANON_KEY."}
	var headers := PackedStringArray([
		"Content-Type: application/json",
		"apikey: " + str(BuildConfig.SUPABASE_ANON_KEY),
		"Cache-Control: no-store"
	])
	var response: Dictionary = await _send_post(
		str(BuildConfig.SUPABASE_URL).trim_suffix("/") + "/auth/v1/" + path,
		headers,
		body
	)
	if not bool(response.get("ok", false)):
		last_error = str(response.get("message", "Supabase authentication failed."))
		return response
	var normalized := _normalize_session(response.payload)
	if normalized.is_empty():
		return {"ok": false, "message": "Supabase mengembalikan sesi yang tidak lengkap."}
	if not await _persist_session(normalized):
		session.clear()
		return {"ok": false, "message": "Token sesi gagal disimpan ke Android Keystore."}
	status_message = "Terhubung sebagai " + get_user_email()
	last_error = ""
	return {"ok": true, "session": normalized, "message": status_message}

func sign_in(email: String, password: String) -> Dictionary:
	if busy:
		return {"ok": false, "message": "Permintaan Supabase sebelumnya masih berjalan."}
	var clean_email := email.strip_edges()
	if clean_email.is_empty() or password.is_empty():
		return {"ok": false, "message": "Email dan password wajib diisi."}
	busy = true
	var result: Dictionary = await _auth_request("token?grant_type=password", {
		"email": clean_email,
		"password": password
	})
	busy = false
	return result

func refresh_session() -> Dictionary:
	if not is_configured() or str(session.get("refresh_token", "")).is_empty():
		return {"ok": false, "message": "Refresh token Supabase tidak tersedia."}
	return await _auth_request("token?grant_type=refresh_token", {
		"refresh_token": str(session.get("refresh_token", ""))
	})

func get_valid_access_token() -> Dictionary:
	if not is_signed_in():
		var restored: Dictionary = await restore_session()
		if not bool(restored.get("ok", false)) or not is_signed_in():
			return {"ok": false, "message": "Login Supabase diperlukan untuk memakai AI Game Master."}
	if int(session.get("expires_at", 0)) <= int(Time.get_unix_time_from_system()) + EXPIRY_SKEW_SECONDS:
		var refreshed: Dictionary = await refresh_session()
		if not bool(refreshed.get("ok", false)):
			return {"ok": false, "message": "Sesi Supabase berakhir. Silakan masuk kembali."}
	return {"ok": true, "token": str(session.get("access_token", ""))}

func sign_out() -> Dictionary:
	if busy:
		return {"ok": false, "message": "Permintaan Supabase sebelumnya masih berjalan."}
	busy = true
	var token := str(session.get("access_token", ""))
	if not token.is_empty() and is_configured():
		var headers := PackedStringArray([
			"Authorization: Bearer " + token,
			"apikey: " + str(BuildConfig.SUPABASE_ANON_KEY)
		])
		await _send_post(str(BuildConfig.SUPABASE_URL).trim_suffix("/") + "/auth/v1/logout", headers, {}, 8.0)
	var cleared := await _persist_session({})
	busy = false
	if not cleared:
		status_message = "Token cloud tidak berhasil dihapus dari Keystore."
		return {"ok": false, "message": status_message}
	status_message = "Keluar dari Supabase."
	return {"ok": true, "message": status_message}
