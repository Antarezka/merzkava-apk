extends Node
class_name AccountService

const STATE_PATH := "user://merzkava-local-state.json"
const STATE_TEMP_PATH := "user://merzkava-local-state.tmp"
const STATE_BACKUP_PATH := "user://merzkava-local-state.bak"
const PBKDF2_ROUNDS := 600000
const ATLAS_PBKDF2_ROUNDS := 310000

const DEV_ID_SALT := "zki1bXl9Kc9FkzTBCvsoSQ=="
const DEV_ID_VERIFIER := "rWliJ21UojOkc2FX4QQXudntYW7NuuKB9kizB4Ih0sA="
const DEV_PASSWORD_SALT := "0Wnvcfd3cGISdPZSyJfQZQ=="
const DEV_PASSWORD_VERIFIER := "rYGmwsLKK3El0UXvA3vyj+pe7d7uj0xJchixuRgr/IU="

const DEV_SESSION_KEY := "merzkava.developer-session.v1"
const DEV_CREDENTIALS_KEY := "merzkava.developer-credentials.v1"
const ATLAS_REMEMBERED_PLAYER_KEY := "merzkava.world-atlas.remembered-player.v1"
const ATLAS_REMEMBERED_PASSWORD_PREFIX := "merzkava.world-atlas.remembered-password.v1:"

var _crypto := Crypto.new()
var _state: Dictionary = {}
var native_plugin: Object
var active_role := ""
var active_player_name := ""
var remembered_developer_credentials: Dictionary = {}

func _ready() -> void:
	_load_state()

func set_native_plugin(plugin: Object) -> void:
	native_plugin = plugin

func restore_device_access() -> Dictionary:
	remembered_developer_credentials.clear()
	if native_plugin == null:
		return {"ok": false, "message": "Android Keystore belum tersedia."}
	var marker := _secure_get(DEV_SESSION_KEY)
	if marker == "authorized":
		active_role = "developer"
		active_player_name = ""
	var credentials_raw := _secure_get(DEV_CREDENTIALS_KEY)
	if not credentials_raw.is_empty() and not credentials_raw.begins_with("ERROR:"):
		var parsed: Variant = JSON.parse_string(credentials_raw)
		if parsed is Dictionary and int(parsed.get("version", 0)) == 1:
			var identifier := str(parsed.get("identifier", ""))
			var password := str(parsed.get("password", ""))
			if not identifier.is_empty() and not password.is_empty():
				remembered_developer_credentials = {"identifier": identifier, "password": password}
	return {"ok": true, "role": active_role, "remembered_developer": not remembered_developer_credentials.is_empty()}

func _secure_get(key: String) -> String:
	if native_plugin == null or not native_plugin.has_method("secureGet"):
		return ""
	var result: Variant = native_plugin.call("secureGet", key)
	return str(result) if result != null else ""

func _secure_set(key: String, value: String) -> bool:
	if native_plugin == null or not native_plugin.has_method("secureSet"):
		return false
	return str(native_plugin.call("secureSet", key, value)) == "OK"

func _secure_remove(key: String) -> bool:
	if native_plugin == null or not native_plugin.has_method("secureRemove"):
		return false
	return str(native_plugin.call("secureRemove", key)) == "OK"

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
		push_error("Cannot open local save: " + error_string(FileAccess.get_open_error()))
		return
	var parsed: Variant = JSON.parse_string(file.get_as_text())
	file.close()
	if parsed is Dictionary and int(parsed.get("version", 0)) == 1:
		_state = _merge_defaults(_default_state(), parsed)
	else:
		push_error("Local save has an unsupported schema. It was not overwritten.")

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
		push_error("Cannot create local save temporary file: " + error_string(FileAccess.get_open_error()))
		return false
	file.store_string(JSON.stringify(_state))
	file.flush()
	file.close()
	var source := ProjectSettings.globalize_path(STATE_TEMP_PATH)
	var destination := ProjectSettings.globalize_path(STATE_PATH)
	var backup := ProjectSettings.globalize_path(STATE_BACKUP_PATH)
	if FileAccess.file_exists(STATE_PATH):
		var backup_error := DirAccess.copy_absolute(destination, backup)
		if backup_error != OK:
			push_error("Cannot back up local save: " + error_string(backup_error))
			return false
		var remove_error := DirAccess.remove_absolute(destination)
		if remove_error != OK:
			push_error("Cannot replace local save: " + error_string(remove_error))
			return false
	var rename_error := DirAccess.rename_absolute(source, destination)
	if rename_error != OK:
		if FileAccess.file_exists(STATE_BACKUP_PATH):
			DirAccess.copy_absolute(backup, destination)
		push_error("Cannot commit local save; previous data was restored when available: " + error_string(rename_error))
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

func sign_out() -> Dictionary:
	active_role = ""
	active_player_name = ""
	if native_plugin == null:
		return {"ok": true, "message": "Sesi lokal dikunci untuk sesi ini."}
	if _secure_remove(DEV_SESSION_KEY):
		return {"ok": true, "message": "Sesi Developer dikunci."}
	if _secure_set(DEV_SESSION_KEY, "locked"):
		return {"ok": true, "message": "Sesi Developer dikunci dengan marker locked."}
	return {"ok": false, "message": "Android Keystore gagal mengunci sesi Developer."}

func is_developer() -> bool:
	return active_role == "developer"

func is_player() -> bool:
	return active_role == "player"

func authenticate_developer(identifier: String, password: String, remember_me: bool = false) -> Dictionary:
	var clean_identifier := identifier.strip_edges().to_lower()
	if clean_identifier.is_empty() or password.is_empty():
		return {"ok": false, "message": "ID dan kata sandi wajib diisi."}
	var id_hash: PackedByteArray = await _pbkdf2(clean_identifier.to_utf8_buffer(), Marshalls.base64_to_raw(DEV_ID_SALT), PBKDF2_ROUNDS)
	var password_hash: PackedByteArray = await _pbkdf2(password.to_utf8_buffer(), Marshalls.base64_to_raw(DEV_PASSWORD_SALT), PBKDF2_ROUNDS)
	var id_ok := _crypto.constant_time_compare(Marshalls.base64_to_raw(DEV_ID_VERIFIER), id_hash)
	var password_ok := _crypto.constant_time_compare(Marshalls.base64_to_raw(DEV_PASSWORD_VERIFIER), password_hash)
	if not (id_ok and password_ok):
		if native_plugin != null:
			_secure_remove(DEV_SESSION_KEY)
			_secure_set(DEV_SESSION_KEY, "locked")
		return {"ok": false, "message": "Akses ditolak. Periksa Developer ID dan kata sandi."}
	if native_plugin != null:
		if remember_me:
			var credentials := JSON.stringify({"version": 1, "identifier": clean_identifier, "password": password})
			if not _secure_set(DEV_CREDENTIALS_KEY, credentials):
				return {"ok": false, "message": "Remember Me gagal disimpan ke Android Keystore."}
			remembered_developer_credentials = {"identifier": clean_identifier, "password": password}
		else:
			if not _secure_remove(DEV_CREDENTIALS_KEY):
				var check := _secure_get(DEV_CREDENTIALS_KEY)
				if not check.is_empty():
					return {"ok": false, "message": "Android Keystore gagal menghapus kredensial Remember Me."}
			remembered_developer_credentials.clear()
		if not _secure_set(DEV_SESSION_KEY, "authorized"):
			return {"ok": false, "message": "Android Keystore gagal menyimpan marker sesi Developer."}
	return {"ok": true, "message": "Developer terverifikasi di perangkat ini."}

func _pbkdf2(password: PackedByteArray, salt: PackedByteArray, rounds: int) -> PackedByteArray:
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
	if not save_state():
		return {"ok": false, "message": "Password gagal disimpan; save sebelumnya dipertahankan."}
	return {"ok": true, "message": "Password World Atlas tersimpan di perangkat."}

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

func remember_atlas_credentials(player_name: String, password: String, remember: bool) -> Dictionary:
	var world_atlas: Dictionary = _state["world_atlas"]
	var previous := str(world_atlas.get("remembered_player", ""))
	if remember:
		world_atlas["remembered_player"] = player_name
		if native_plugin != null:
			var key := ATLAS_REMEMBERED_PASSWORD_PREFIX + _account_key(player_name)
			if not _secure_set(ATLAS_REMEMBERED_PLAYER_KEY, player_name):
				return {"ok": false, "message": "World Atlas Remember Me gagal disimpan."}
			if not password.is_empty() and not _secure_set(key, password):
				return {"ok": false, "message": "Password World Atlas gagal disimpan ke Android Keystore."}
	else:
		world_atlas["remembered_player"] = ""
		if native_plugin != null:
			if not previous.is_empty():
				_secure_remove(ATLAS_REMEMBERED_PASSWORD_PREFIX + _account_key(previous))
			_secure_remove(ATLAS_REMEMBERED_PLAYER_KEY)
			if not player_name.is_empty():
				_secure_remove(ATLAS_REMEMBERED_PASSWORD_PREFIX + _account_key(player_name))
	if not save_state():
		return {"ok": false, "message": "Preferensi Remember Me gagal disimpan."}
	return {"ok": true, "message": "Preferensi World Atlas disimpan."}

func remember_atlas_player(player_name: String, remember: bool) -> void:
	remember_atlas_credentials(player_name, "", remember)

func get_remembered_atlas_player() -> String:
	if native_plugin != null:
		var saved := _secure_get(ATLAS_REMEMBERED_PLAYER_KEY)
		if not saved.is_empty() and not saved.begins_with("ERROR:"):
			return saved
	return str(_state["world_atlas"].get("remembered_player", ""))

func restore_remembered_atlas_password(player_name: String) -> String:
	if native_plugin == null:
		return ""
	var key := ATLAS_REMEMBERED_PASSWORD_PREFIX + _account_key(player_name)
	var saved := _secure_get(key)
	if saved.is_empty() or saved.begins_with("ERROR:"):
		return ""
	if await verify_atlas_password(player_name, saved):
		return saved
	_secure_remove(key)
	return ""

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
