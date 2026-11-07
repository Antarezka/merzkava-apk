extends Node
class_name CanonService

const REPOSITORY := "Antarezka/merzkava-universe"
const PINNED_SNAPSHOT := "58693e13ead18dc44528f8f0259ca89cfb7faff9"
const API := "https://api.github.com/repos/" + REPOSITORY

var active_sha := ""
var nightly_version := ""
var source_status := "NOT CHECKED"
var source_message := "Universe snapshot belum diverifikasi."
var cached_index := ""
var cached_authority := ""

func _request_text(url: String, accept: String = "text/plain") -> Dictionary:
	var http := HTTPRequest.new()
	http.timeout = 7.0
	add_child(http)
	var headers := PackedStringArray(["Accept: " + accept, "Cache-Control: no-cache"])
	var error := http.request(url, headers)
	if error != OK:
		http.queue_free()
		return {"ok": false, "message": "Request tidak dapat dimulai: " + error_string(error)}
	var response: Array = await http.request_completed
	http.queue_free()
	var result_code := int(response[0])
	var response_code := int(response[1])
	var body: PackedByteArray = response[3]
	if result_code != HTTPRequest.RESULT_SUCCESS:
		return {"ok": false, "message": "Koneksi Universe gagal (" + str(result_code) + ")."}
	if response_code < 200 or response_code >= 300:
		return {"ok": false, "message": "Universe mengembalikan HTTP " + str(response_code) + "."}
	return {"ok": true, "text": body.get_string_from_utf8()}

func verify_snapshot() -> Dictionary:
	source_status = "VERIFYING"
	source_message = "Memverifikasi commit Universe yang dipin..."
	var commit_result: Dictionary = await _request_text(API + "/commits/" + PINNED_SNAPSHOT, "application/vnd.github+json")
	if not commit_result.ok:
		source_status = "OFFLINE"
		source_message = str(commit_result.message)
		return commit_result
	var commit_payload: Variant = JSON.parse_string(str(commit_result.text))
	if not (commit_payload is Dictionary):
		source_status = "INVALID"
		source_message = "Respons commit Universe tidak valid."
		return {"ok": false, "message": source_message}
	var full_sha := str(commit_payload.get("sha", "")).to_lower()
	if full_sha.length() != 40 or not full_sha.begins_with(PINNED_SNAPSHOT):
		source_status = "INVALID"
		source_message = "Hash commit tidak cocok dengan snapshot yang dipin."
		return {"ok": false, "message": source_message}
	var index_result: Dictionary = await _request_text("https://raw.githubusercontent.com/" + REPOSITORY + "/" + full_sha + "/INDEX.md")
	if not index_result.ok or str(index_result.text).strip_edges().is_empty():
		source_status = "INVALID"
		source_message = "INDEX.md pada snapshot aktif tidak tersedia."
		return {"ok": false, "message": source_message}
	var authority_result: Dictionary = await _request_text("https://raw.githubusercontent.com/" + REPOSITORY + "/" + full_sha + "/templates/AUTHORITY_ORDER.md")
	if not authority_result.ok or str(authority_result.text).strip_edges().is_empty():
		source_status = "INVALID"
		source_message = "AUTHORITY_ORDER.md pada snapshot aktif tidak tersedia."
		return {"ok": false, "message": source_message}
	var version_result: Dictionary = await _request_text("https://raw.githubusercontent.com/" + REPOSITORY + "/" + full_sha + "/NIGHTLY_VERSION.md")
	if not version_result.ok:
		source_status = "INVALID"
		source_message = "NIGHTLY_VERSION.md pada snapshot aktif tidak tersedia."
		return {"ok": false, "message": source_message}
	var version_regex := RegEx.new()
	version_regex.compile("Current Nightly version:.*(v[0-9]+\\.[0-9]+\\.[0-9]+)")
	var version_match := version_regex.search(str(version_result.text))
	if version_match == null:
		source_status = "INVALID"
		source_message = "Versi Nightly tidak ditemukan pada snapshot aktif."
		return {"ok": false, "message": source_message}
	active_sha = full_sha
	nightly_version = version_match.get_string(1)
	cached_index = str(index_result.text)
	cached_authority = str(authority_result.text)
	source_status = "VERIFIED"
	source_message = "Universe terverifikasi · " + active_sha.substr(0, 7) + " · " + nightly_version
	return {"ok": true, "sha": active_sha, "version": nightly_version, "message": source_message}

func verify_player_name(player_name: String) -> Dictionary:
	var exact_name := player_name.strip_edges()
	if exact_name.is_empty():
		return {"ok": false, "message": "Masukkan nama karakter."}
	var snapshot: Dictionary = await verify_snapshot()
	if not snapshot.ok:
		return {"ok": false, "message": str(snapshot.message)}
	var check_url := "https://raw.githubusercontent.com/" + REPOSITORY + "/" + active_sha + "/players.md?connection_check=" + str(Time.get_ticks_msec())
	var registry_result: Dictionary = await _request_text(check_url)
	if not registry_result.ok:
		source_status = "OFFLINE"
		source_message = "Registry pemain tidak dapat diperiksa saat ini."
		return {"ok": false, "message": source_message}
	for raw_line in str(registry_result.text).split("\n"):
		var line := raw_line.strip_edges()
		if not line.begins_with("|"):
			continue
		var columns := line.split("|")
		if columns.size() < 4:
			continue
		var registered_name := str(columns[1]).strip_edges()
		var profile_link := str(columns[2]).strip_edges()
		if registered_name == exact_name and profile_link.contains("players/") and profile_link.ends_with(".md)"):
			return {"ok": true, "name": exact_name, "sha": active_sha, "message": "Player terverifikasi dari players.md · " + active_sha.substr(0, 7)}
	return {"ok": false, "message": "Nama tidak ditemukan persis di players.md pada snapshot Universe terverifikasi."}

func get_cached_source_status() -> Dictionary:
	return {"status": source_status, "sha": active_sha, "version": nightly_version, "message": source_message}
