extends Node
class_name AccountService

const STATE_PATH := "user://merzkava-local-state.json"
const STATE_TEMP_PATH := "user://merzkava-local-state.tmp"
const PBKDF2_ROUNDS := 600000
const ATLAS_PBKDF2_ROUNDS := 310000

# Existing legacy client verifier values. These are public local verifiers,
# not server-grade authorization or a replacement for server-side controls.
const DEV_ID_SALT := "zki1bXl9Kc9FkzTBCvsoSQ=="
const DEV_ID_VERIFIER := "rWliJ21UojOkc2FX4QQXudntYW7NuuKB9kizB4Ih0sA="
const DEV_PASSWORD_SALT := "0Wnvcfd3cGISdPZSyJfQZQ=="
const DEV_PASSWORD_VERIFIER := "rYGmwsLKK3El0UXvA3vyj+pe7d7uj0xJchixuRgr/IU="

var _crypto := Crypto.new()
var _state: Dictionary = {}
var active_role := ""
var active_player_name := ""

func _ready() -> void:
	_load_state()

func _default_state() -> Dictionary:
	return {
		"version": 1,
		"preferences": {"theme": "dark", "sound": true, "language": "id", "navigation_collapsed": false},
		"world_atlas": {"remembered_player": "", "accounts": {}},
		"local_game": {
			"player_name": "",
			"position": {"x": 0, "y": 0},
			"inventory": [],
			"wallet": {"xc": 0, "xs": 0, "xg": 0, "zj": 0, "az": 0},
			"journal": []
		}
	}

func _load_state() -> void:
	_state = _default_state()
	if not FileAccess.file_exists(STATE_PATH):
		return
	var file := FileAccess.open(STATE_PATH, FileAccess.READ)
	if file == null:
		return
	var parsed: Variant = JSON.parse_string(file.get_as_text())
	file.close()
	if parsed is Dictionary and int(parsed.get("version", 0)) == 1:
		_state = _merge_defaults(_default_state(), parsed)

func _merge_defaults(defaults: Dictionary, incoming: Dictionary) -> Dictionary:
	var result := defaults.duplicate(true)
	for key in incoming.keys():
		if result.has(key) and result[key] is Dictionary and incoming[key] is Dictionary:
			result[key] = _merge_defaults(result[key], incoming[key])
		else:
			result[key] = incoming[key]
	return result

func save_state() -> bool:
	var file := FileAccess.open(STATE_TEMP_PATH, FileAccess.WRITE)
	if file == null:
		push_error("Cannot create local save temporary file: %s" % error_string(FileAccess.get_open_error()))
		return false
	file.store_string(JSON.stringify(_state))
	file.flush()
	file.close()
	var source := ProjectSettings.globalize_path(STATE_TEMP_PATH)
	var destination := ProjectSettings.globalize_path(STATE_PATH)
	var backup := ProjectSettings.globalize_path("user://merzkava-local-state.bak")
	if FileAccess.file_exists(STATE_PATH):
		DirAccess.copy_absolute(destination, backup)
	var err := DirAccess.rename_absolute(source, destination)
	if err != OK:
		push_error("Could not commit local save: %s" % error_string(err))
		return false
	return true

func get_preferences() -> Dictionary:
	return (_state.get("preferences", {}) as Dictionary).duplicate(true)

func set_preference(key: String, value: Variant) -> void:
	var preferences: Dictionary = _state["preferences"]
	preferences[key] = value
	save_state()

func get_local_game() -> Dictionary:
	return (_state.get("local_game", {}) as Dictionary).duplicate(true)

func set_local_game(value: Dictionary) -> void:
	_state["local_game"] = value.duplicate(true)
	save_state()

func sign_in_player(name: String) -> void:
	active_role = "player"
	active_player_name = name
	_state["local_game"]["player_name"] = name
	save_state()

func sign_in_developer() -> void:
	active_role = "developer"
	active_player_name = ""

func sign_out() -> void:
	active_role = ""
	active_player_name = ""

func is_developer() -> bool:
	return active_role == "developer"

func is_player() -> bool:
	return active_role == "player"

func authenticate_developer(identifier: String, password: String) -> Dictionary:
	var clean_identifier := identifier.strip_edges().to_lower()
	if clean_identifier.is_empty() or password.is_empty():
		return {"ok": false, "message": "ID dan kata sandi wajib diisi."}
	var id_hash: PackedByteArray = await _pbkdf2(clean_identifier.to_utf8_buffer(), Marshalls.base64_to_raw(DEV_ID_SALT), PBKDF2_ROUNDS)
	var password_hash: PackedByteArray = await _pbkdf2(password.to_utf8_buffer(), Marshalls.base64_to_raw(DEV_PASSWORD_SALT), PBKDF2_ROUNDS)
	var id_ok := _crypto.constant_time_compare(Marshalls.base64_to_raw(DEV_ID_VERIFIER), id_hash)
	var password_ok := _crypto.constant_time_compare(Marshalls.base64_to_raw(DEV_PASSWORD_VERIFIER), password_hash)
	if not (id_ok and password_ok):
		return {"ok": false, "message": "Akses ditolak. Periksa Developer ID dan kata sandi."}
	return {"ok": true, "message": "Developer terverifikasi di perangkat ini."}

func _pbkdf2(password: PackedByteArray, salt: PackedByteArray, rounds: int) -> PackedByteArray:
	# PBKDF2-HMAC-SHA256, one 32-byte output block. Yield periodically so the
	# access panel remains responsive on low-end Android hardware.
	var block := salt.duplicate()
	block.append_array(PackedByteArray([0, 0, 0, 1]))
	var u: PackedByteArray = _crypto.hmac_digest(HashingContext.HASH_SHA256, password, block)
	var output := u.duplicate()
	for iteration in range(1, rounds):
		u = _crypto.hmac_digest(HashingContext.HASH_SHA256, password, u)
		for index in range(output.size()):
			output[index] = int(output[index]) ^ int(u[index])
		if iteration % 4096 == 0:
			await get_tree().process_frame
	return output

func atlas_password_policy_error(password: String) -> String:
	if password.length() < 8:
		return "Gunakan minimal 8 karakter."
	if password.length() > 128:
		return "Gunakan maksimal 128 karakter."
	var has_upper := false
	var has_lower := false
	var has_digit := false
	var has_symbol := false
	for character in password:
		var code := character.unicode_at(0)
		has_upper = has_upper or (code >= 65 and code <= 90)
		has_lower = has_lower or (code >= 97 and code <= 122)
		has_digit = has_digit or (code >= 48 and code <= 57)
		has_symbol = has_symbol or (code > 32 and not (code >= 48 and code <= 57) and not (code >= 65 and code <= 90) and not (code >= 97 and code <= 122))
	if not (has_upper and has_lower and has_digit and has_symbol):
		return "Perlu huruf besar, huruf kecil, angka, dan simbol."
	return ""

func has_atlas_password(player_name: String) -> bool:
	var accounts: Dictionary = _state["world_atlas"]["accounts"]
	return accounts.has(_account_key(player_name))

func set_atlas_password(player_name: String, password: String) -> Dictionary:
	var policy_error := atlas_password_policy_error(password)
	if not policy_error.is_empty():
		return {"ok": false, "message": policy_error}
	var salt := _crypto.generate_random_bytes(16)
	var verifier: PackedByteArray = await _pbkdf2(password.to_utf8_buffer(), salt, ATLAS_PBKDF2_ROUNDS)
	var accounts: Dictionary = _state["world_atlas"]["accounts"]
	accounts[_account_key(player_name)] = {
		"version": 1,
		"iterations": ATLAS_PBKDF2_ROUNDS,
		"salt": Marshalls.raw_to_base64(salt),
		"hash": Marshalls.raw_to_base64(verifier),
		"updated_at": Time.get_datetime_string_from_system(true)
	}
	save_state()
	return {"ok": true, "message": "Password World Atlas tersimpan di penyimpanan lokal."}

func verify_atlas_password(player_name: String, password: String) -> bool:
	var accounts: Dictionary = _state["world_atlas"]["accounts"]
	var record: Dictionary = accounts.get(_account_key(player_name), {})
	if int(record.get("version", 0)) != 1 or int(record.get("iterations", 0)) != ATLAS_PBKDF2_ROUNDS:
		return false
	var salt := Marshalls.base64_to_raw(str(record.get("salt", "")))
	var expected := Marshalls.base64_to_raw(str(record.get("hash", "")))
	if salt.size() != 16 or expected.size() != 32:
		return false
	var actual: PackedByteArray = await _pbkdf2(password.to_utf8_buffer(), salt, ATLAS_PBKDF2_ROUNDS)
	return _crypto.constant_time_compare(expected, actual)

func remember_atlas_player(player_name: String, remember: bool) -> void:
	_state["world_atlas"]["remembered_player"] = player_name if remember else ""
	save_state()

func get_remembered_atlas_player() -> String:
	return str(_state["world_atlas"].get("remembered_player", ""))

func create_atlas_reset_request(player_name: String) -> String:
	var random_id := Marshalls.raw_to_base64(_crypto.generate_random_bytes(16)).replace("+", "-").replace("/", "_").trim_suffix("=")
	var challenge := Marshalls.raw_to_base64(_crypto.generate_random_bytes(32)).replace("+", "-").replace("/", "_").trim_suffix("=")
	var player_key := player_name.strip_edges().to_lower().sha256_text()
	return "\n".join([
		"MERZKAVA_ATLAS_MASTER_RESET_REQUEST_V1",
		"Request-ID: " + random_id,
		"Player-Name: " + player_name,
		"Player-Key: " + player_key,
		"Challenge: " + challenge,
		"Action: Prepare a one-time account-bound confirmation grant for a future app update.",
		"Scope: This request is for the selected World Atlas player only."
	])

func _account_key(player_name: String) -> String:
	return player_name.strip_edges().to_lower().sha256_text()
