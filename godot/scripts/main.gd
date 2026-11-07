extends Control

const AccountServiceScript = preload("res://scripts/core/account_service.gd")
const CanonServiceScript = preload("res://scripts/core/canon_service.gd")

const INK := Color("#18231e")
const INK_SOFT := Color("#26352d")
const ENAMEL := Color("#34493d")
const ENAMEL_DARK := Color("#202b24")
const BRASS := Color("#c5a36b")
const BRASS_LIGHT := Color("#e6d4ab")
const PAPER := Color("#eee7d6")
const PAPER_DARK := Color("#d9cdb3")
const MUTED := Color("#9da898")
const ALERT := Color("#c96c5a")

const KITTY_SHADOW := "res://assets/kitty/kitty-shadow.png"
const KITTY_TAIL := "res://assets/kitty/kitty-tail.png"
const KITTY_BODY := "res://assets/kitty/kitty-body.png"
const KITTY_HEAD := "res://assets/kitty/kitty-head.png"
const OPENING_CHIME := "res://assets/audio/opening-chime.mp3"
const OPENING_VOICE := "res://assets/audio/opening-voice.mp3"
const BUTTON_SOUND := "res://assets/audio/soft-click.mp3"
const CORD_GRAB_SOUND := "res://assets/audio/golden-handle.mp3"
const CORD_ACTIVATE_SOUND := "res://assets/audio/mechanical-activation.mp3"
const CORD_SPRING_SOUND := "res://assets/audio/spring-return.mp3"
const CORD_DROP_SOUND := "res://assets/audio/toolbar-drop.mp3"

const NAV_ITEMS := [
	{"id": "home", "label": "Home", "mark": "⌂"},
	{"id": "eternal", "label": "Eternal Path", "mark": "✧"},
	{"id": "archive", "label": "World Archive", "mark": "▤"},
	{"id": "profile", "label": "Profile", "mark": "◉"},
	{"id": "convo", "label": "Convo", "mark": "✉"},
	{"id": "inventory", "label": "Inventory", "mark": "◇"},
	{"id": "journal", "label": "Journal", "mark": "▧"},
	{"id": "settings", "label": "Settings", "mark": "⚙"}
]

const PLAYER_ACCESS_STAGES := [
	"Memverifikasi commit Universe...",
	"Memeriksa INDEX dan authority order...",
	"Mengambil registry players.md...",
	"Mencocokkan identitas karakter..."
]
const PLAYER_ACCESS_LOGS := [
	"UNIVERSE COMMIT CHECK",
	"PINNED SOURCE VALIDATION",
	"PLAYER REGISTRY REQUEST",
	"EXACT IDENTITY MATCH"
]
const DEVELOPER_ACCESS_STAGES := [
	"Memeriksa Developer ID...",
	"Menurunkan verifier PBKDF2...",
	"Memeriksa kata sandi...",
	"Mempersiapkan sesi Developer..."
]
const DEVELOPER_ACCESS_LOGS := [
"LOCAL IDENTITY CHECK",
"PBKDF2 · 600000 ROUNDS",
"CONSTANT-TIME VERIFICATION",
"LOCAL SESSION HANDOFF"
]
const ATLAS_ACCESS_STAGES := [
	"Memverifikasi snapshot Universe...",
	"Memeriksa identitas World Atlas...",
	"Memvalidasi password lokal...",
	"Mempersiapkan akses Atlas..."
]
const ATLAS_ACCESS_LOGS := [
	"PINNED SOURCE CHECK",
	"WORLD ATLAS ACCOUNT",
	"LOCAL PASSWORD VERIFICATION",
	"ATLAS SESSION HANDOFF"
]

var account_service: Node
var canon_service: Node
var current_page := "control"
var access_mode := "player"
var atlas_mode := "login"
var atlas_gate_open := false
var is_dark_theme := true
var sound_enabled := true
var is_busy := false
var auth_result: Dictionary = {"done": false, "ok": false, "message": ""}
var auth_attempt := 0
var login_name_field: LineEdit
var developer_id_field: LineEdit
var developer_password_field: LineEdit
var access_message_label: Label
var access_progress: ProgressBar
var access_stage_label: Label
var access_log_label: Label
var atlas_name_field: LineEdit
var atlas_password_field: LineEdit
var atlas_confirm_field: LineEdit
var atlas_remember_check: CheckBox
var atlas_message_label: Label
var gate_layer: CanvasLayer
var atlas_layer: CanvasLayer
var exit_layer: CanvasLayer
var screen_stack: Array[String] = []
var notice_text := ""
var notification_status := "NOT CHECKED"
var overlay_status := "NOT CHECKED"
var battery_status := "NOT CHECKED"
var service_status := "NOT RUNNING"
var native_bridge_status := "NOT CONNECTED"
var native_plugin: Object
var root_box: VBoxContainer
var page_box: VBoxContainer
var nav_scroll: ScrollContainer
var content_scroll: ScrollContainer
var audio_player: AudioStreamPlayer
var nav_scroll_position := 0.0
var map_position := Vector2i(0, 0)
var map_move_count := 0
var access_buffer_active := false
var _splash_skip := false
var _cord_start := Vector2.ZERO
var _cord_active := false
var _cord_handle: Button
var _cord_rope: ColorRect
var _cord_pull_amount := 0.0
var _cord_dragged := false

func _ready() -> void:
	account_service = AccountServiceScript.new()
	add_child(account_service)
	canon_service = CanonServiceScript.new()
	add_child(canon_service)
	audio_player = AudioStreamPlayer.new()
	audio_player.name = "AppAudio"
	audio_player.bus = "Master"
	add_child(audio_player)
	var preferences: Dictionary = account_service.get_preferences()
	is_dark_theme = str(preferences.get("theme", "dark")) == "dark"
	sound_enabled = bool(preferences.get("sound", true))
	var local_game: Dictionary = account_service.get_local_game()
	var saved_position: Dictionary = local_game.get("position", {"x": 0, "y": 0})
	map_position = Vector2i(int(saved_position.get("x", 0)), int(saved_position.get("y", 0)))
	if Engine.has_singleton("MerzkavaAndroid"):
		native_plugin = Engine.get_singleton("MerzkavaAndroid")
		native_bridge_status = "CONNECTED"
	_refresh_native_readiness()
	_render()
	if account_service.active_role.is_empty():
		_show_login_gate()
	set_process_unhandled_key_input(true)

func _notification(what: int) -> void:
	if what == NOTIFICATION_WM_GO_BACK_REQUEST:
		_handle_back()

func _unhandled_key_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		if event.keycode == KEY_ESCAPE or event.keycode == KEY_BACK:
			_handle_back()

func _handle_back() -> void:
	if exit_layer != null:
		exit_layer.queue_free()
		exit_layer = null
		return
	if atlas_layer != null:
		atlas_layer.queue_free()
		atlas_layer = null
		atlas_gate_open = false
		return
	if gate_layer != null and account_service.active_role.is_empty():
		return
	if gate_layer != null:
		gate_layer.queue_free()
		gate_layer = null
	if current_page != "home" and current_page != "control":
		_navigate("home")
	elif current_page == "home":
		_show_exit_confirmation()
	else:
		_show_exit_confirmation()

func _render() -> void:
	if is_instance_valid(root_box):
		root_box.queue_free()
	var background := ColorRect.new()
	background.name = "Background"
	background.color = Color("#121a16") if is_dark_theme else Color("#e4dccb")
	background.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	add_child(background)
	move_child(background, 0)

	root_box = VBoxContainer.new()
	root_box.name = "AppShell"
	root_box.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	root_box.offset_left = 14
	root_box.offset_top = 12
	root_box.offset_right = -14
	root_box.offset_bottom = -10
	root_box.add_theme_constant_override("separation", 8)
	add_child(root_box)

	if current_page != "control":
		_build_header(root_box)
	var scroll := ScrollContainer.new()
	scroll.name = "PageScroll"
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	scroll.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	scroll.vertical_scroll_mode = ScrollContainer.SCROLL_MODE_AUTO
	root_box.add_child(scroll)
	content_scroll = scroll
	page_box = VBoxContainer.new()
	page_box.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	page_box.add_theme_constant_override("separation", 12)
	scroll.add_child(page_box)
	_build_current_page(page_box)
	if current_page != "control":
		_build_navigation(root_box)
		_build_pull_cord(root_box)
	if not notice_text.is_empty():
		_add_notice(page_box, notice_text)

func _build_header(parent: VBoxContainer) -> void:
	var header := HBoxContainer.new()
	header.custom_minimum_size.y = 64
	header.add_theme_constant_override("separation", 10)
	parent.add_child(header)
	var brand := Button.new()
	brand.text = "M"
	brand.custom_minimum_size = Vector2(48, 48)
	brand.add_theme_font_size_override("font_size", 26)
	brand.add_theme_color_override("font_color", BRASS_LIGHT)
	brand.add_theme_stylebox_override("normal", _style_box(ENAMEL, BRASS, 5, 2))
	brand.pressed.connect(_navigate.bind("home"))
	header.add_child(brand)
	var title_stack := VBoxContainer.new()
	title_stack.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	title_stack.add_theme_constant_override("separation", 0)
	header.add_child(title_stack)
	_add_label(title_stack, "MERZKAVA UNIVERSE", 9, BRASS, true)
	_add_label(title_stack, _page_title(current_page), 20, PAPER if is_dark_theme else INK, true)
	var kitty_button := Button.new()
	kitty_button.custom_minimum_size = Vector2(54, 54)
	kitty_button.tooltip_text = "Start Kitty Bubble Mode"
	kitty_button.add_theme_stylebox_override("normal", _style_box(Color("#615238") if not is_dark_theme else Color("#2c3028"), BRASS, 28, 1))
	kitty_button.pressed.connect(_start_bubble_mode)
	header.add_child(kitty_button)
	_add_kitty_layers(kitty_button, 48, true)
	var settings_button := Button.new()
	settings_button.text = "⚙"
	settings_button.custom_minimum_size = Vector2(48, 48)
	settings_button.add_theme_font_size_override("font_size", 21)
	settings_button.add_theme_color_override("font_color", PAPER if is_dark_theme else ENAMEL)
	settings_button.add_theme_stylebox_override("normal", _style_box(ENAMEL, BRASS, 6, 1))
	settings_button.pressed.connect(_navigate.bind("settings"))
	header.add_child(settings_button)

func _build_current_page(parent: VBoxContainer) -> void:
	match current_page:
		"control":
			_build_floating_control(parent)
		"home":
			_build_home(parent)
		"eternal":
			_build_eternal_path(parent)
		"archive":
			_build_archive(parent)
		"profile":
			_build_profile(parent)
		"convo":
			_build_convo(parent)
		"inventory":
			_build_inventory(parent)
		"journal":
			_build_journal(parent)
		"settings":
			_build_settings(parent)
		_:
			_build_home(parent)

func _build_floating_control(parent: VBoxContainer) -> void:
	var brand_card := _make_card(parent)
	brand_card.add_theme_constant_override("separation", 5)
	var brand_row := HBoxContainer.new()
	brand_card.add_child(brand_row)
	var seal := Label.new()
	seal.text = "M"
	seal.custom_minimum_size = Vector2(52, 52)
	seal.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	seal.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	seal.add_theme_font_size_override("font_size", 30)
	seal.add_theme_color_override("font_color", BRASS)
	seal.add_theme_stylebox_override("normal", _style_box(ENAMEL, BRASS, 8, 1))
	brand_row.add_child(seal)
	var brand_copy := VBoxContainer.new()
	brand_copy.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	brand_row.add_child(brand_copy)
	_add_label(brand_copy, "MERZKAVA · ANDROID CLIENT", 9, BRASS, true)
	_add_label(brand_copy, "Floating Control", 23, PAPER if is_dark_theme else INK, true)
	_add_label(brand_card, "Prepare Android permissions and the background service before entering your world.", 12, MUTED)
	_add_label(parent, "ACCOUNT ACCESS", 10, BRASS, true)
	var account_card := _make_card(parent)
	var role := "NOT SIGNED IN"
	if account_service.is_developer():
		role = "DEVELOPER SESSION"
	elif account_service.is_player():
		role = "PLAYER · " + account_service.active_player_name
	_add_label(account_card, "CURRENT ROLE  ·  " + role, 11, BRASS_LIGHT if is_dark_theme else ENAMEL, true)
	if account_service.is_developer():
		_add_label(account_card, "Developer-only tools are unlocked. Player identity and World Atlas accounts remain separate.", 11, MUTED)
	elif account_service.is_player():
		_add_label(account_card, "Player access is verified against the pinned Universe roster. Developer tools remain locked.", 11, MUTED)
	else:
		_add_label(account_card, "The Player / Developer access gate is required before entering the app.", 11, MUTED)
	_add_label(parent, "SYSTEM READINESS", 10, BRASS, true)
	var health := _make_card(parent)
	_add_status_row(health, "Display over other apps", overlay_status)
	_add_status_row(health, "Notifications", notification_status)
	_add_status_row(health, "Battery exemption", battery_status)
	_add_status_row(health, "Foreground service", service_status)
	_add_status_row(health, "Godot Android bridge", native_bridge_status)
	_add_label(parent, "INITIAL SETUP · COMPLETE IN ORDER", 10, BRASS, true)
	_add_permission_step(parent, "01", "Display over other apps", "Allow the Kitty bubble and mini-window to appear above other apps.", "overlay")
	_add_permission_step(parent, "02", "Notifications", "Allow the ongoing Floating Mode notification.", "notifications")
	_add_permission_step(parent, "03", "Battery / background activity", "Allow the foreground service to remain available under Android power management.", "battery")
	var actions := _make_card(parent)
	_add_label(actions, "QUICK ACTIONS", 10, BRASS, true)
	_add_wide_button(actions, "Open game / continue playing", _enter_game, true)
	var ready := _floating_setup_complete()
	_add_wide_button(actions, "Start Kitty Bubble Mode", _start_bubble_mode, false, not ready)
	_add_wide_button(actions, "Open floating mini-window", _open_mini_window, false, not _has_native_bridge() or overlay_status != "READY")
	_add_wide_button(actions, "Stop service and close window", _stop_floating_service, false, service_status != "RUNNING" and native_bridge_status != "CONNECTED")
	_add_wide_button(actions, "Donate stuff", func(): _set_notice("Donation destination belum dikonfigurasi. Tidak ada tautan pembayaran yang akan dibuka."), false)
	_add_label(parent, "Foreground service starts only after a user action and keeps an ongoing notification while Floating Mode is active.", 10, MUTED)
	if account_service.is_developer() or account_service.is_player():
		var account_actions := _make_card(parent)
		_add_label(account_actions, "ACCOUNT", 10, BRASS, true)
		_add_wide_button(account_actions, "Account & access settings", _navigate.bind("settings"), false)
		_add_wide_button(account_actions, "Sign out", _sign_out_with_buffer, false)

func _build_home(parent: VBoxContainer) -> void:
	var hero := _make_card(parent)
	hero.custom_minimum_size.y = 190
	_add_label(hero, "WELCOME TO THE EASTERN REALMS", 9, BRASS, true)
	_add_label(hero, "The world awaits.", 28, PAPER if is_dark_theme else INK, true)
	_add_label(hero, "An offline-first cultivation world, carried in your pocket.", 13, MUTED)
	_add_spacer(hero, 12)
	var continue_button := _wide_button(hero, "Enter Eternal Path  ↗", _navigate.bind("eternal"), true)
	continue_button.custom_minimum_size.y = 52
	var quick := _make_card(parent)
	_add_label(quick, "YOUR WORLD", 10, BRASS, true)
	_add_wide_button(quick, "Eternal Path · Explore the world", _navigate.bind("eternal"))
	_add_wide_button(quick, "World Archive · Browse records", _navigate.bind("archive"))
	_add_wide_button(quick, "Character Profile", _navigate.bind("profile"))
	var status := _make_card(parent)
	_add_label(status, "LOCAL SESSION", 10, BRASS, true)
	_add_label(status, "Role: " + ("Developer" if account_service.is_developer() else "Player"), 11, PAPER if is_dark_theme else INK)
	_add_label(status, "Universe source: " + str(canon_service.source_status), 11, MUTED)
	if account_service.is_developer():
		_add_wide_button(status, "Open Developer tools & settings", _navigate.bind("settings"))

func _build_eternal_path(parent: VBoxContainer) -> void:
	var hero := _make_card(parent)
	_add_label(hero, "MERZKAVA · ETERNAL PATH", 9, BRASS, true)
	_add_label(hero, "A journey of your own.", 25, PAPER if is_dark_theme else INK, true)
	_add_label(hero, "Local world state is stored on this device. Live Convo and cloud services are not required to open this mode.", 12, MUTED)
	var field := _make_card(parent)
	_add_label(field, "FIELD DESK", 10, BRASS, true)
	_add_label(field, "World map runtime", 18, PAPER if is_dark_theme else INK, true)
	_add_label(field, "The full region atlas, terrain, NPC schedules and movement engine are still being transferred. This migration screen is not pretending that the legacy map has already been ported.", 11, MUTED)
	_add_wide_button(field, "Open World Atlas · TV access", _open_world_atlas_gate, true)
	_add_wide_button(field, "Return to Home", _navigate.bind("home"))
	var state := _make_card(parent)
	var local_game: Dictionary = account_service.get_local_game()
	_add_label(state, "LOCAL CHARACTER STATE", 10, BRASS, true)
	_add_label(state, "Player: " + str(local_game.get("player_name", account_service.active_player_name)), 12, PAPER if is_dark_theme else INK)
	_add_label(state, "Position: " + str(local_game.get("position", {"x": 0, "y": 0})), 11, MUTED)
	_add_label(state, "Wallet: " + _wallet_summary(local_game.get("wallet", {})), 11, MUTED)
	_add_label(state, "Save file: user://merzkava-local-state.json", 10, MUTED)

func _build_archive(parent: VBoxContainer) -> void:
	var hero := _make_card(parent)
	_add_label(hero, "WORLD ARCHIVE", 9, BRASS, true)
	_add_label(hero, "A library of the known world.", 24, PAPER if is_dark_theme else INK, true)
	_add_label(hero, "The reader must use a reviewed, packaged Archive snapshot and preserve source provenance. Live network access is not required for packaged entries.", 12, MUTED)
	var content := _make_card(parent)
	_add_label(content, "ARCHIVE PACKAGE STATUS", 10, BRASS, true)
	_add_status_row(content, "Packaged local Archive", "PENDING MIGRATION")
	_add_label(content, "The previous Archive files have not yet been imported into the Godot project. This screen intentionally does not show invented lore as if it were a verified dossier.", 11, MUTED)
	_add_wide_button(content, "Return to Eternal Path", _navigate.bind("eternal"))

func _build_profile(parent: VBoxContainer) -> void:
	var profile := _make_card(parent)
	_add_label(profile, "PLAYER DOSSIER", 9, BRASS, true)
	_add_label(profile, account_service.active_player_name if not account_service.active_player_name.is_empty() else "No active character", 23, PAPER if is_dark_theme else INK, true)
	_add_label(profile, "App role: " + account_service.active_role.to_upper(), 11, BRASS)
	_add_label(profile, "A full Universe profile is loaded only from a verified players.md profile path. The profile-data importer is a separate migration task.", 11, MUTED)
	var local_game: Dictionary = account_service.get_local_game()
	_add_label(profile, "Local wallet · " + _wallet_summary(local_game.get("wallet", {})), 11, MUTED)
	_add_wide_button(profile, "Return to Home", _navigate.bind("home"))

func _build_convo(parent: VBoxContainer) -> void:
	var card := _make_card(parent)
	_add_label(card, "CONVO · AI GAME MASTER", 9, BRASS, true)
	_add_label(card, "Connected roleplay.", 24, PAPER if is_dark_theme else INK, true)
	_add_status_row(card, "Cloud authentication", "NOT CONNECTED")
	_add_status_row(card, "AI provider gateway", "NOT CONFIGURED")
	_add_label(card, "Convo remains a separate online service. No Player, Developer or World Atlas password is reused here. The Supabase token adapter and AI gateway are not yet ported into the Godot runtime.", 11, MUTED)
	_add_wide_button(card, "Return to Home", _navigate.bind("home"))

func _build_inventory(parent: VBoxContainer) -> void:
	var local_game: Dictionary = account_service.get_local_game()
	var wallet: Dictionary = local_game.get("wallet", {})
	var card := _make_card(parent)
	_add_label(card, "TRAVELER'S SATCHEL", 9, BRASS, true)
	_add_label(card, "Inventory & Wallet", 24, PAPER if is_dark_theme else INK, true)
	_add_label(card, "Wallet: " + _wallet_summary(wallet), 12, MUTED)
	var items: Array = local_game.get("inventory", [])
	if items.is_empty():
		_add_label(card, "The satchel is currently empty.", 12, MUTED)
	else:
		for item in items:
			_add_label(card, str(item), 12, PAPER if is_dark_theme else INK)
	_add_label(card, "Authoritative item transactions and the Xuan ledger will be migrated from the legacy deterministic game engine. No AI proposal can edit this state.", 10, MUTED)

func _build_journal(parent: VBoxContainer) -> void:
	var card := _make_card(parent)
	_add_label(card, "FIELD JOURNAL", 9, BRASS, true)
	_add_label(card, "Records of your journey.", 23, PAPER if is_dark_theme else INK, true)
	var local_game: Dictionary = account_service.get_local_game()
	var entries: Array = local_game.get("journal", [])
	if entries.is_empty():
		_add_label(card, "No local journal records yet.", 12, MUTED)
	else:
		for entry in entries:
			_add_label(card, str(entry), 11, PAPER if is_dark_theme else INK)

func _build_settings(parent: VBoxContainer) -> void:
	var app_card := _make_card(parent)
	_add_label(app_card, "APP SETTINGS", 10, BRASS, true)
	_add_label(app_card, "Appearance · Sound · Account", 18, PAPER if is_dark_theme else INK, true)
	_add_wide_button(app_card, "Switch to " + ("Light" if is_dark_theme else "Dark") + " theme", _toggle_theme)
	_add_wide_button(app_card, "Sound: " + ("ON" if sound_enabled else "OFF"), _toggle_sound)
	_add_label(app_card, "LOCAL PREFERENCES", 9, BRASS, true)
	_add_label(app_card, "Theme and sound preferences are written to the local save file.", 11, MUTED)
	var account_card := _make_card(parent)
	_add_label(account_card, "ACCOUNT & ACCESS", 10, BRASS, true)
	if account_service.is_developer():
		_add_label(account_card, "DEVELOPER SESSION", 11, PAPER if is_dark_theme else INK, true)
		_add_wide_button(account_card, "Open Floating Control", _navigate.bind("control"))
		_add_wide_button(account_card, "Lock Developer session", _sign_out_with_buffer, false)
		_add_label(account_card, "WORLD & ACCOUNT SERVICES", 9, BRASS, true)
		_add_status_row(account_card, "Universe source", str(canon_service.source_status))
		_add_status_row(account_card, "Supabase session", "NOT PORTED")
		_add_status_row(account_card, "AI Gateway", "NOT PORTED")
	elif account_service.is_player():
		_add_label(account_card, "PLAYER SESSION", 11, PAPER if is_dark_theme else INK, true)
		_add_wide_button(account_card, "Open Floating Control", _navigate.bind("control"))
		_add_wide_button(account_card, "Sign out", _sign_out_with_buffer, false)
	else:
		_add_label(account_card, "No active app role.", 11, MUTED)
		_add_wide_button(account_card, "Open account gate", _show_login_gate, true)

func _build_navigation(parent: VBoxContainer) -> void:
	var dock := PanelContainer.new()
	dock.custom_minimum_size.y = 70
	dock.add_theme_stylebox_override("panel", _style_box(ENAMEL_DARK, BRASS, 8, 1))
	parent.add_child(dock)
	nav_scroll = ScrollContainer.new()
	nav_scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_AUTO
	nav_scroll.vertical_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	nav_scroll.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	dock.add_child(nav_scroll)
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 3)
	nav_scroll.add_child(row)
	for item in NAV_ITEMS:
		if item.id == "convo" and not account_service.is_developer():
			continue
		var nav_button := Button.new()
		nav_button.text = str(item.mark) + "\n" + str(item.label)
		nav_button.custom_minimum_size = Vector2(78, 62)
		nav_button.size_flags_horizontal = Control.SIZE_SHRINK_CENTER
		nav_button.add_theme_font_size_override("font_size", 10)
		nav_button.add_theme_color_override("font_color", BRASS_LIGHT if current_page == item.id else MUTED)
		nav_button.add_theme_stylebox_override("normal", _style_box(Color("#46523f") if current_page == item.id else ENAMEL_DARK, BRASS if current_page == item.id else Color("#536052"), 6, 1))
		nav_button.pressed.connect(_navigate.bind(str(item.id)))
		row.add_child(nav_button)
	if nav_scroll_position > 0:
		nav_scroll.set_deferred("scroll_horizontal", int(nav_scroll_position))

func _build_pull_cord(parent: VBoxContainer) -> void:
	# A short, touch-safe pull handle is kept beside the dock. It is not a
	# full-screen gesture target and can be activated by a deliberate pull.
	var row := HBoxContainer.new()
	row.alignment = BoxContainer.ALIGNMENT_BEGIN
	parent.add_child(row)
	var handle := Button.new()
	handle.text = "⌁"
	handle.tooltip_text = "Pull down to retract or restore the navigation dock"
	handle.custom_minimum_size = Vector2(48, 38)
	handle.add_theme_font_size_override("font_size", 24)
	handle.add_theme_color_override("font_color", BRASS_LIGHT)
	handle.add_theme_stylebox_override("normal", _style_box(ENAMEL_DARK, BRASS, 8, 1))
	handle.button_down.connect(_play_asset.bind(CORD_GRAB_SOUND, -12.0))
	handle.button_up.connect(_toggle_navigation_cord)
	row.add_child(handle)
	var note := Label.new()
	note.text = "CLOCKWORK NAVIGATION"
	note.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	note.add_theme_font_size_override("font_size", 8)
	note.add_theme_color_override("font_color", MUTED)
	row.add_child(note)
	_cord_handle = handle

func _make_card(parent: Node) -> VBoxContainer:
	var panel := PanelContainer.new()
	panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	panel.add_theme_stylebox_override("panel", _style_box(Color("#202b24") if is_dark_theme else Color("#f1eadb"), Color("#786847") if is_dark_theme else Color("#b39a69"), 8, 1))
	parent.add_child(panel)
	var inner := VBoxContainer.new()
	inner.add_theme_constant_override("separation", 8)
	inner.add_theme_constant_override("margin_left", 12)
	inner.add_theme_constant_override("margin_right", 12)
	inner.add_theme_constant_override("margin_top", 12)
	inner.add_theme_constant_override("margin_bottom", 12)
	panel.add_child(inner)
	return inner

func _style_box(background: Color, border: Color, radius: int = 5, border_width: int = 1) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = background
	style.border_color = border
	style.set_border_width_all(border_width)
	style.set_corner_radius_all(radius)
	style.content_margin_left = 10
	style.content_margin_right = 10
	style.content_margin_top = 7
	style.content_margin_bottom = 7
	return style

func _add_label(parent: Node, text: String, size: int = 12, color: Color = PAPER, bold: bool = false) -> Label:
	var label := Label.new()
	label.text = text
	label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	label.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	label.add_theme_font_size_override("font_size", size)
	label.add_theme_color_override("font_color", color)
	if bold:
		label.add_theme_color_override("font_shadow_color", Color("#00000044"))
		label.add_theme_constant_override("shadow_offset_x", 0)
	parent.add_child(label)
	return label

func _add_spacer(parent: Node, height: float) -> void:
	var spacer := Control.new()
	spacer.custom_minimum_size.y = height
	parent.add_child(spacer)

func _make_button(text: String, callback: Callable, primary: bool = false, disabled: bool = false) -> Button:
	var button := Button.new()
	button.text = text
	button.custom_minimum_size.y = 44
	button.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	button.disabled = disabled
	button.add_theme_font_size_override("font_size", 12)
	button.add_theme_color_override("font_color", INK if primary else PAPER)
	button.add_theme_color_override("font_disabled_color", MUTED)
	button.add_theme_stylebox_override("normal", _style_box(BRASS if primary else ENAMEL, BRASS_LIGHT if primary else Color("#6f755f"), 5, 1))
	button.add_theme_stylebox_override("hover", _style_box(Color("#d9bd82") if primary else Color("#425747"), BRASS_LIGHT, 5, 1))
	button.add_theme_stylebox_override("pressed", _style_box(Color("#ad8a50") if primary else Color("#1c2821"), BRASS, 5, 1))
	button.add_theme_stylebox_override("disabled", _style_box(Color("#313a32") if is_dark_theme else Color("#c6c0b2"), Color("#4a5146"), 5, 1))
	button.pressed.connect(callback)
	return button

func _wide_button(parent: Node, text: String, callback: Callable, primary: bool = false, disabled: bool = false) -> Button:
	var button := _make_button(text, callback, primary, disabled)
	parent.add_child(button)
	return button

func _add_wide_button(parent: Node, text: String, callback: Callable, primary: bool = false, disabled: bool = false) -> Button:
	return _wide_button(parent, text, callback, primary, disabled)

func _add_status_row(parent: Node, title: String, status: String) -> void:
	var row := HBoxContainer.new()
	parent.add_child(row)
	var label := Label.new()
	label.text = title
	label.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	label.add_theme_font_size_override("font_size", 11)
	label.add_theme_color_override("font_color", PAPER if is_dark_theme else INK)
	row.add_child(label)
	var state := Label.new()
	state.text = status
	state.add_theme_font_size_override("font_size", 9)
	state.add_theme_color_override("font_color", BRASS_LIGHT if status == "READY" or status == "RUNNING" else ALERT if status.contains("NOT") or status.contains("PENDING") else MUTED)
	row.add_child(state)

func _add_permission_step(parent: Node, number: String, title: String, description: String, action: String) -> void:
	var card := _make_card(parent)
	var line := HBoxContainer.new()
	card.add_child(line)
	var number_label := Label.new()
	number_label.text = number
	number_label.custom_minimum_size.x = 28
	number_label.add_theme_font_size_override("font_size", 15)
	number_label.add_theme_color_override("font_color", BRASS)
	line.add_child(number_label)
	var copy := VBoxContainer.new()
	copy.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	line.add_child(copy)
	_add_label(copy, title, 12, PAPER if is_dark_theme else INK, true)
	_add_label(copy, description, 10, MUTED)
	var bridge_ready := _has_native_bridge()
	var status := overlay_status if action == "overlay" else notification_status if action == "notifications" else battery_status
	_add_status_row(card, "Status", status)
	_add_wide_button(card, "Open Android permission settings", _request_permission.bind(action), false, not bridge_ready or status == "READY")

func _show_login_gate() -> void:
	if is_instance_valid(gate_layer):
		gate_layer.queue_free()
	gate_layer = CanvasLayer.new()
	gate_layer.layer = 20
	add_child(gate_layer)
	var dim := ColorRect.new()
	dim.color = Color(0.025, 0.035, 0.03, 0.84)
	dim.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	gate_layer.add_child(dim)
	var center := CenterContainer.new()
	center.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	center.offset_left = 14
	center.offset_right = -14
	gate_layer.add_child(center)
	var panel := PanelContainer.new()
	panel.custom_minimum_size = Vector2(320, 0)
	panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	panel.add_theme_stylebox_override("panel", _style_box(Color("#202b24"), BRASS, 9, 1))
	center.add_child(panel)
	var wrapper := VBoxContainer.new()
	wrapper.add_theme_constant_override("separation", 11)
	panel.add_child(wrapper)
	_add_label(wrapper, "MERZKAVA · ACCOUNT ACCESS", 9, BRASS_LIGHT, true)
	_add_label(wrapper, "Sign in to your world", 22, PAPER, true)
	var tabs := HBoxContainer.new()
	wrapper.add_child(tabs)
	tabs.add_child(_make_button("PLAYER", _set_access_mode.bind("player"), access_mode == "player"))
	tabs.add_child(_make_button("DEVELOPER", _set_access_mode.bind("developer"), access_mode == "developer"))
	if access_mode == "player":
		_add_label(wrapper, "Enter the exact character name from the currently pinned Universe players.md registry.", 11, MUTED)
		login_name_field = LineEdit.new()
		login_name_field.placeholder_text = "Registered character name"
		login_name_field.max_length = 80
		login_name_field.custom_minimum_size.y = 44
		login_name_field.add_theme_stylebox_override("normal", _style_box(Color("#17231d"), Color("#69755f")))
		wrapper.add_child(login_name_field)
		access_message_label = _add_label(wrapper, notice_text, 10, ALERT)
		_wide_button(wrapper, "Continue as Player", _submit_player_login, true)
	else:
		_add_label(wrapper, "Device-local Developer verifier · offline capable · 600,000 PBKDF2 rounds.", 11, MUTED)
		developer_id_field = LineEdit.new()
		developer_id_field.placeholder_text = "Developer ID"
		developer_id_field.max_length = 80
		developer_id_field.custom_minimum_size.y = 44
		developer_id_field.add_theme_stylebox_override("normal", _style_box(Color("#17231d"), Color("#69755f")))
		wrapper.add_child(developer_id_field)
		developer_password_field = LineEdit.new()
		developer_password_field.placeholder_text = "Password"
		developer_password_field.secret = true
		developer_password_field.custom_minimum_size.y = 44
		developer_password_field.add_theme_stylebox_override("normal", _style_box(Color("#17231d"), Color("#69755f")))
		wrapper.add_child(developer_password_field)
		var note := _add_label(wrapper, "Remember Me is held until the native Android Keystore vault is integrated. Credentials are not written as plain text to user://.", 9, MUTED)
		note.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		access_message_label = _add_label(wrapper, notice_text, 10, ALERT)
		_wide_button(wrapper, "Sign in as Developer", _submit_developer_login, true)
	if not account_service.active_role.is_empty():
		_wide_button(wrapper, "Close", _close_login_gate)
	elif not notice_text.is_empty():
		_add_label(wrapper, "Offline Eternal Path access is not enabled by this gate. Player access needs the pinned online roster; Developer access is local.", 9, MUTED)

func _set_access_mode(mode: String) -> void:
	if is_busy:
		return
	access_mode = mode
	notice_text = ""
	_show_login_gate()

func _close_login_gate() -> void:
	if account_service.active_role.is_empty():
		return
	gate_layer.queue_free()
	gate_layer = null

func _show_access_buffer(context: String) -> void:
	if not is_instance_valid(gate_layer):
		_show_login_gate()
	var dim := gate_layer.get_child(0) as ColorRect
	var center := gate_layer.get_child(1) as CenterContainer
	for child in center.get_children():
		child.queue_free()
	var panel := PanelContainer.new()
	panel.custom_minimum_size = Vector2(320, 0)
	panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	panel.add_theme_stylebox_override("panel", _style_box(Color("#202b24"), BRASS, 9, 1))
	center.add_child(panel)
	var stack := VBoxContainer.new()
	stack.add_theme_constant_override("separation", 10)
	panel.add_child(stack)
	_add_label(stack, "MERZKAVA ACCESS ROUTINE", 9, BRASS_LIGHT, true)
	_add_label(stack, context.to_upper() + " · AUTHENTICATION SEQUENCE", 9, MUTED)
	access_stage_label = _add_label(stack, "Resolving account identity...", 13, PAPER, true)
	access_log_label = _add_label(stack, "INITIALIZING...", 8, BRASS)
	access_progress = ProgressBar.new()
	access_progress.min_value = 0
	access_progress.max_value = 100
	access_progress.value = 0
	access_progress.show_percentage = false
	access_progress.custom_minimum_size.y = 7
	access_progress.add_theme_stylebox_override("background", _style_box(Color("#101914"), Color("#505b49"), 2, 1))
	access_progress.add_theme_stylebox_override("fill", _style_box(BRASS, BRASS_LIGHT, 2, 0))
	stack.add_child(access_progress)
	_add_label(stack, "The sequence follows the actual local or network verification. It does not authorize an account by itself.", 9, MUTED)
	dim.color = Color(0.025, 0.035, 0.03, 0.9)

func _submit_player_login() -> void:
	if is_busy or not is_instance_valid(login_name_field):
		return
	var name := login_name_field.text.strip_edges()
	if name.is_empty():
		notice_text = "Masukkan nama karakter yang terdaftar."
		_show_login_gate()
		return
	is_busy = true
	auth_attempt += 1
	var attempt := auth_attempt
	auth_result = {"done": false, "ok": false, "message": ""}
	_show_access_buffer("PLAYER")
	_perform_player_check.call_deferred(name, attempt)
	var succeeded := await _run_access_sequence(PLAYER_ACCESS_STAGES, PLAYER_ACCESS_LOGS, attempt)
	is_busy = false
	if not succeeded:
		notice_text = str(auth_result.get("message", "Player verification failed."))
		_show_login_gate()
		return
	account_service.sign_in_player(name)
	notice_text = ""
	current_page = "control"
	_render()
	_refresh_native_readiness()

func _perform_player_check(name: String, attempt: int) -> void:
	var result: Dictionary = await canon_service.verify_player_name(name)
	if attempt != auth_attempt:
		return
	auth_result = {"done": true, "ok": bool(result.get("ok", false)), "message": str(result.get("message", ""))}

func _submit_developer_login() -> void:
	if is_busy or not is_instance_valid(developer_id_field) or not is_instance_valid(developer_password_field):
		return
	var identifier := developer_id_field.text
	var password := developer_password_field.text
	if identifier.strip_edges().is_empty() or password.is_empty():
		notice_text = "ID dan kata sandi wajib diisi."
		_show_login_gate()
		return
	is_busy = true
	auth_attempt += 1
	var attempt := auth_attempt
	auth_result = {"done": false, "ok": false, "message": ""}
	_show_access_buffer("DEVELOPER")
	_perform_developer_check.call_deferred(identifier, password, attempt)
	var succeeded := await _run_access_sequence(DEVELOPER_ACCESS_STAGES, DEVELOPER_ACCESS_LOGS, attempt)
	is_busy = false
	if not succeeded:
		notice_text = str(auth_result.get("message", "Developer authentication failed."))
		_show_login_gate()
		return
	account_service.sign_in_developer()
	notice_text = ""
	current_page = "control"
	_render()

func _perform_developer_check(identifier: String, password: String, attempt: int) -> void:
	var result: Dictionary = await account_service.authenticate_developer(identifier, password)
	if attempt != auth_attempt:
		return
	auth_result = {"done": true, "ok": bool(result.get("ok", false)), "message": str(result.get("message", ""))}

func _run_access_sequence(stages: Array, logs: Array, attempt: int) -> bool:
	var checkpoints := [12.0, 31.0, 53.0, 76.0, 92.0]
	var waits := [0.23, 0.42, 0.61, 0.73, 0.46]
	for index in range(checkpoints.size()):
		if attempt != auth_attempt:
			return false
		if bool(auth_result.get("done", false)) and not bool(auth_result.get("ok", false)):
			return false
		_set_access_frame(str(stages[min(index, stages.size() - 1)]), str(logs[min(index, logs.size() - 1)]), 1)
		var tween := create_tween()
		tween.tween_property(access_progress, "value", checkpoints[index], waits[index]).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
		await tween.finished
		for dots in [2, 3]:
			if bool(auth_result.get("done", false)) and not bool(auth_result.get("ok", false)):
				return false
			_set_access_frame(str(stages[min(index, stages.size() - 1)]), str(logs[min(index, logs.size() - 1)]), dots)
			await get_tree().create_timer(0.075).timeout
	while not bool(auth_result.get("done", false)):
		if attempt != auth_attempt:
			return false
		_set_access_frame(str(stages[stages.size() - 1]), str(logs[logs.size() - 1]), 1 + (Time.get_ticks_msec() / 180) % 3)
		await get_tree().create_timer(0.18).timeout
	if not bool(auth_result.get("ok", false)):
		return false
	var finish := create_tween()
	finish.tween_property(access_progress, "value", 100.0, 0.22).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
	await finish.finished
	_set_access_frame("Akses berhasil.", "SESSION READY", 3)
	await get_tree().create_timer(0.12).timeout
	return true

func _set_access_frame(stage: String, log_line: String, dots: int) -> void:
	if is_instance_valid(access_stage_label):
		access_stage_label.text = stage.trim_suffix(".") + ".".repeat(clampi(dots, 1, 3))
	if is_instance_valid(access_log_label):
		access_log_label.text = log_line

func _sign_out_with_buffer() -> void:
	if is_busy:
		return
	is_busy = true
	auth_attempt += 1
	var attempt := auth_attempt
	auth_result = {"done": false, "ok": false, "message": ""}
	_show_access_buffer("SESSION LOCK")
	_perform_sign_out.call_deferred(attempt)
	var succeeded := await _run_access_sequence(
		["Mencabut sesi aktif...", "Menghapus hak akses sementara...", "Mengunci Developer Mode...", "Mengembalikan Floating Control..."],
		["SESSION REVOKE", "ROLE FLAGS", "DEVELOPER MODE OFF", "APP ACCESS LOCK"],
		attempt
	)
	is_busy = false
	if not succeeded:
		notice_text = str(auth_result.get("message", "Session could not be locked."))
		_show_login_gate()
		return
	notice_text = ""
	current_page = "control"
	access_mode = "player"
	_render()
	_show_login_gate()

func _perform_sign_out(attempt: int) -> void:
	account_service.sign_out()
	if attempt != auth_attempt:
		return
	auth_result = {"done": true, "ok": true, "message": "Sesi lokal telah dikunci."}

func _navigate(destination: String) -> void:
	if is_busy:
		return
	if destination == "convo" and not account_service.is_developer():
		_set_notice("Convo dan pengaturan cloud hanya tersedia pada Developer session.")
		return
	if destination == current_page:
		return
	if current_page != "control":
		screen_stack.append(current_page)
	nav_scroll_position = nav_scroll.scroll_horizontal if is_instance_valid(nav_scroll) else nav_scroll_position
	current_page = destination
	notice_text = ""
	_render()
	_play_click()

func _enter_game() -> void:
	if account_service.active_role.is_empty():
		_show_login_gate()
		return
	await _play_entry_splash()
	current_page = "home"
	_render()

func _play_entry_splash() -> void:
	_splash_skip = false
	var layer := CanvasLayer.new()
	layer.layer = 30
	add_child(layer)
	var backdrop := ColorRect.new()
	backdrop.color = Color("#101914")
	backdrop.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	layer.add_child(backdrop)
	var center := CenterContainer.new()
	center.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	layer.add_child(center)
	var stack := VBoxContainer.new()
	stack.alignment = BoxContainer.ALIGNMENT_CENTER
	stack.add_theme_constant_override("separation", 8)
	center.add_child(stack)
	_add_label(stack, "WELCOME TO THE EASTERN REALMS", 9, BRASS_LIGHT, true).horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	var wordmark := _add_label(stack, "MERZKAVA", 30, PAPER, true)
	wordmark.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	var stage := Control.new()
	stage.custom_minimum_size = Vector2(290, 330)
	stack.add_child(stage)
	var kitty := _add_kitty_layers(stage, 300, false)
	var tagline := _add_label(stack, "THE WORLD AWAITS", 9, BRASS_LIGHT, true)
	tagline.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	var skip := Button.new()
	skip.text = "Tap to continue"
	skip.custom_minimum_size.y = 38
	skip.add_theme_font_size_override("font_size", 10)
	skip.add_theme_color_override("font_color", MUTED)
	skip.add_theme_stylebox_override("normal", _style_box(Color(0, 0, 0, 0), Color(0, 0, 0, 0), 2, 0))
	skip.pressed.connect(func(): _splash_skip = true)
	stack.add_child(skip)

	var body: TextureRect = kitty.get("body")
	var tail: TextureRect = kitty.get("tail")
	if is_instance_valid(body):
		var body_tween := create_tween().set_loops()
		body_tween.tween_property(body, "position:y", body.position.y - 2.0, 1.1).set_trans(Tween.TRANS_SINE)
		body_tween.tween_property(body, "position:y", body.position.y, 1.1).set_trans(Tween.TRANS_SINE)
	if is_instance_valid(tail):
		var tail_tween := create_tween().set_loops()
		tail_tween.tween_property(tail, "rotation_degrees", 5.0, 0.9).set_trans(Tween.TRANS_SINE)
		tail_tween.tween_property(tail, "rotation_degrees", -5.0, 0.9).set_trans(Tween.TRANS_SINE)
	backdrop.modulate.a = 0.0
	stack.modulate.a = 0.0
	var entrance := create_tween()
	entrance.tween_property(backdrop, "modulate:a", 1.0, 0.35)
	entrance.parallel().tween_property(stack, "modulate:a", 1.0, 0.75)
	entrance.tween_interval(0.45)
	if sound_enabled:
		_play_asset(OPENING_CHIME, -7.0)
		await audio_player.finished
		if not _splash_skip and sound_enabled:
			_play_asset(OPENING_VOICE, -3.0)
			await audio_player.finished
	var hold := 0.0
	while hold < 1.2 and not _splash_skip:
		await get_tree().create_timer(0.1).timeout
		hold += 0.1
	var closing := create_tween()
	closing.tween_property(stack, "modulate:a", 0.0, 0.24)
	closing.parallel().tween_property(backdrop, "modulate:a", 0.0, 0.32)
	await closing.finished
	layer.queue_free()

func _add_kitty_layers(parent: Control, size: float, inset: bool) -> Dictionary:
	var base := TextureRect.new()
	base.texture = load(KITTY_SHADOW)
	base.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	base.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	var layer_size := Vector2(size, size)
	base.custom_minimum_size = layer_size
	base.size = layer_size
	base.position = Vector2.ZERO
	parent.add_child(base)
	var tail := _add_kitty_layer(parent, KITTY_TAIL, layer_size)
	var body := _add_kitty_layer(parent, KITTY_BODY, layer_size)
	var head := _add_kitty_layer(parent, KITTY_HEAD, layer_size)
	if inset:
		base.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
		tail.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
		body.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
		head.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	return {"shadow": base, "tail": tail, "body": body, "head": head}

func _add_kitty_layer(parent: Control, path: String, layer_size: Vector2) -> TextureRect:
	var layer := TextureRect.new()
	layer.texture = load(path)
	layer.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	layer.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	layer.size = layer_size
	layer.position = Vector2.ZERO
	parent.add_child(layer)
	return layer

func _start_bubble_mode() -> void:
	if not _has_native_bridge():
		_set_notice("Android FloatingWindow bridge belum terpasang pada build ini. Bubble tidak akan ditampilkan sebagai animasi palsu di dalam layar.")
		return
	if not _floating_setup_complete():
		_set_notice("Selesaikan tiga izin Android secara berurutan sebelum memulai Bubble Mode.")
		return
	await _play_entry_splash()
	_native_call("startBubble")

func _open_mini_window() -> void:
	if not _has_native_bridge() or overlay_status != "READY":
		_set_notice("Mini-window membutuhkan Android overlay bridge dan izin Display over other apps.")
		return
	_native_call("openMiniWindow")

func _stop_floating_service() -> void:
	if not _has_native_bridge():
		_set_notice("Android FloatingWindow bridge belum tersedia.")
		return
	_native_call("stopFloatingService")

func _request_permission(action: String) -> void:
	if not _has_native_bridge():
		_set_notice("Izin Android khusus ini membutuhkan native bridge. Tidak ada status izin yang akan dipalsukan.")
		return
	var method := "requestOverlayPermission" if action == "overlay" else "requestNotificationPermission" if action == "notifications" else "requestBatteryExemption"
	_native_call(method)
	await get_tree().create_timer(0.45).timeout
	_refresh_native_readiness()
	_render()

func _native_call(method: String) -> void:
	if not _has_native_bridge():
		_set_notice("Native Android bridge belum terhubung.")
		return
	if not native_plugin.has_method(method):
		_set_notice("Native bridge terdeteksi, tetapi metode " + method + " belum tersedia.")
		return
	var result: Variant = native_plugin.call(method)
	if result is Dictionary and not bool(result.get("ok", true)):
		_set_notice(str(result.get("message", "Android action gagal.")))
	else:
		_set_notice("Perintah Android dikirim. Status akan dibaca ulang dari sistem.")

func _refresh_native_readiness() -> void:
	if not _has_native_bridge():
		overlay_status = "NOT CONNECTED"
		notification_status = "NOT CONNECTED"
		battery_status = "NOT CONNECTED"
		service_status = "NOT RUNNING"
		native_bridge_status = "NOT CONNECTED"
		return
	native_bridge_status = "CONNECTED"
	if native_plugin.has_method("getReadiness"):
		var state: Variant = native_plugin.call("getReadiness")
		if state is Dictionary:
			overlay_status = "READY" if bool(state.get("displayOverApps", false)) else "NOT READY"
			notification_status = "READY" if bool(state.get("notifications", false)) else "NOT READY"
			battery_status = "READY" if bool(state.get("batteryExemption", false)) else "NOT READY"
			service_status = "RUNNING" if bool(state.get("serviceRunning", false)) else "NOT RUNNING"

func _has_native_bridge() -> bool:
	return native_plugin != null

func _floating_setup_complete() -> bool:
	return overlay_status == "READY" and notification_status == "READY" and battery_status == "READY"

func _open_world_atlas_gate() -> void:
	if atlas_layer != null:
		atlas_layer.queue_free()
	atlas_layer = CanvasLayer.new()
	atlas_layer.layer = 25
	add_child(atlas_layer)
	atlas_gate_open = true
	var dim := ColorRect.new()
	dim.color = Color(0.02, 0.03, 0.025, 0.92)
	dim.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	atlas_layer.add_child(dim)
	var center := CenterContainer.new()
	center.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	center.offset_left = 12
	center.offset_right = -12
	atlas_layer.add_child(center)
	var panel := PanelContainer.new()
	panel.custom_minimum_size = Vector2(320, 0)
	panel.add_theme_stylebox_override("panel", _style_box(Color("#202b24"), BRASS, 9, 1))
	center.add_child(panel)
	var wrapper := VBoxContainer.new()
	wrapper.add_theme_constant_override("separation", 9)
	panel.add_child(wrapper)
	_add_label(wrapper, "WORLD ARCHIVE · PLAYER ACCESS", 9, BRASS_LIGHT, true)
	_add_label(wrapper, "Enter World Atlas", 23, PAPER, true)
	atlas_name_field = LineEdit.new()
	atlas_name_field.placeholder_text = "Registered character"
	atlas_name_field.text = account_service.active_player_name if account_service.is_player() else account_service.get_remembered_atlas_player()
	atlas_name_field.custom_minimum_size.y = 44
	wrapper.add_child(atlas_name_field)
	atlas_password_field = LineEdit.new()
	atlas_password_field.placeholder_text = "World Atlas password"
	atlas_password_field.secret = true
	atlas_password_field.custom_minimum_size.y = 44
	wrapper.add_child(atlas_password_field)
	atlas_confirm_field = LineEdit.new()
	atlas_confirm_field.placeholder_text = "Confirm password for first setup"
	atlas_confirm_field.secret = true
	atlas_confirm_field.custom_minimum_size.y = 44
	wrapper.add_child(atlas_confirm_field)
	atlas_remember_check = CheckBox.new()
	atlas_remember_check.text = "Remember this player on this device"
	atlas_remember_check.button_pressed = not account_service.get_remembered_atlas_player().is_empty()
	wrapper.add_child(atlas_remember_check)
	atlas_message_label = _add_label(wrapper, "World Atlas uses its own local password. It is not the Player or Developer app login.", 10, MUTED)
	_add_wide_button(wrapper, "Sign in / Create account", _submit_atlas_login, true)
	_add_wide_button(wrapper, "Close World Atlas", _close_world_atlas)

func _submit_atlas_login() -> void:
	if is_busy or not atlas_gate_open:
		return
	var name := atlas_name_field.text.strip_edges()
	var password := atlas_password_field.text
	var confirmation := atlas_confirm_field.text
	if name.is_empty() or password.is_empty():
		atlas_message_label.text = "Nama karakter dan password wajib diisi."
		return
	is_busy = true
	auth_attempt += 1
	var attempt := auth_attempt
	auth_result = {"done": false, "ok": false, "message": ""}
	_show_atlas_access_buffer()
	_perform_atlas_check.call_deferred(name, password, confirmation, attempt)
	var success := await _run_atlas_access_sequence(attempt)
	is_busy = false
	if not success:
		if is_instance_valid(atlas_message_label):
			atlas_message_label.text = str(auth_result.get("message", "World Atlas access failed."))
		_rebuild_atlas_gate()
		return
	account_service.remember_atlas_player(name, atlas_remember_check.button_pressed)
	_close_world_atlas()
	_set_notice("World Atlas access granted for this session.")

func _perform_atlas_check(name: String, password: String, confirmation: String, attempt: int) -> void:
	var source_check: Dictionary = await canon_service.verify_player_name(name)
	if not bool(source_check.get("ok", false)):
		if attempt == auth_attempt:
			auth_result = {"done": true, "ok": false, "message": str(source_check.get("message", "Universe verification failed."))}
		return
	var exists := account_service.has_atlas_password(name)
	if exists:
		var valid: bool = await account_service.verify_atlas_password(name, password)
		if not valid:
			auth_result = {"done": true, "ok": false, "message": "Incorrect World Atlas password."}
			return
	else:
		if password != confirmation:
			auth_result = {"done": true, "ok": false, "message": "Password confirmation does not match."}
			return
		var created: Dictionary = await account_service.set_atlas_password(name, password)
		if not bool(created.get("ok", false)):
			auth_result = {"done": true, "ok": false, "message": str(created.get("message", "Password could not be saved."))}
			return
	auth_result = {"done": true, "ok": true, "message": "World Atlas identity and password verified."}

func _show_atlas_access_buffer() -> void:
	if atlas_layer == null:
		return
	var dim := atlas_layer.get_child(0) as ColorRect
	var center := atlas_layer.get_child(1) as CenterContainer
	for child in center.get_children():
		child.queue_free()
	var panel := PanelContainer.new()
	panel.custom_minimum_size = Vector2(320, 0)
	panel.add_theme_stylebox_override("panel", _style_box(Color("#202b24"), BRASS, 9, 1))
	center.add_child(panel)
	var stack := VBoxContainer.new()
	stack.add_theme_constant_override("separation", 9)
	panel.add_child(stack)
	_add_label(stack, "WORLD ATLAS · ACCOUNT HANDSHAKE", 9, BRASS_LIGHT, true)
	atlas_stage_label = _add_label(stack, ATLAS_ACCESS_STAGES[0], 13, PAPER, true)
	atlas_log_label = _add_label(stack, "PINNED SOURCE CHECK", 8, BRASS)
	atlas_progress = ProgressBar.new()
	atlas_progress.min_value = 0
	atlas_progress.max_value = 100
	atlas_progress.show_percentage = false
	atlas_progress.custom_minimum_size.y = 7
	stack.add_child(atlas_progress)

var atlas_stage_label: Label
var atlas_log_label: Label
var atlas_progress: ProgressBar

func _run_atlas_access_sequence(attempt: int) -> bool:
	var checkpoints := [18.0, 42.0, 66.0, 92.0]
	for i in range(checkpoints.size()):
		if bool(auth_result.get("done", false)) and not bool(auth_result.get("ok", false)):
			return false
		atlas_stage_label.text = ATLAS_ACCESS_STAGES[i] + "."
		atlas_log_label.text = ATLAS_ACCESS_LOGS[i]
		var tween := create_tween()
		tween.tween_property(atlas_progress, "value", checkpoints[i], 0.42 + float(i) * 0.1)
		await tween.finished
		for dots in [2, 3]:
			atlas_stage_label.text = ATLAS_ACCESS_STAGES[i].trim_suffix(".") + ".".repeat(dots)
			await get_tree().create_timer(0.075).timeout
	while not bool(auth_result.get("done", false)):
		atlas_stage_label.text = ATLAS_ACCESS_STAGES[3].trim_suffix(".") + ".".repeat(1 + (Time.get_ticks_msec() / 180) % 3)
		await get_tree().create_timer(0.18).timeout
	if not bool(auth_result.get("ok", false)) or attempt != auth_attempt:
		return false
	var finish := create_tween()
	finish.tween_property(atlas_progress, "value", 100.0, 0.22)
	await finish.finished
	return true

func _rebuild_atlas_gate() -> void:
	if is_instance_valid(atlas_layer):
		atlas_layer.queue_free()
	atlas_layer = null
	_open_world_atlas_gate()

func _close_world_atlas() -> void:
	if is_instance_valid(atlas_layer):
		atlas_layer.queue_free()
	atlas_layer = null
	atlas_gate_open = false
	is_busy = false

func _toggle_theme() -> void:
	is_dark_theme = not is_dark_theme
	account_service.set_preference("theme", "dark" if is_dark_theme else "light")
	_render()

func _toggle_sound() -> void:
	sound_enabled = not sound_enabled
	account_service.set_preference("sound", sound_enabled)
	if not sound_enabled:
		audio_player.stop()
	_render()

func _toggle_navigation_cord() -> void:
	if current_page == "control":
		return
	if _cord_active:
		return
	_cord_active = true
	var was_collapsed := bool(account_service.get_preferences().get("navigation_collapsed", false))
	account_service.set_preference("navigation_collapsed", not was_collapsed)
	_play_asset(CORD_ACTIVATE_SOUND if not was_collapsed else CORD_SPRING_SOUND, -9.0)
	var target := root_box.position.y + (12.0 if not was_collapsed else -12.0)
	var tween := create_tween()
	tween.tween_property(root_box, "position:y", target, 0.22).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	await tween.finished
	_cord_active = false
	_render()

func _show_exit_confirmation() -> void:
	if is_instance_valid(exit_layer):
		exit_layer.queue_free()
	exit_layer = CanvasLayer.new()
	exit_layer.layer = 40
	add_child(exit_layer)
	var backdrop := ColorRect.new()
	backdrop.color = Color(0.02, 0.03, 0.025, 0.88)
	backdrop.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	exit_layer.add_child(backdrop)
	var center := CenterContainer.new()
	center.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	exit_layer.add_child(center)
	var panel := PanelContainer.new()
	panel.add_theme_stylebox_override("panel", _style_box(Color("#202b24"), BRASS, 8, 1))
	center.add_child(panel)
	var stack := VBoxContainer.new()
	panel.add_child(stack)
	_add_label(stack, "LEAVE MERZKAVA?", 16, PAPER, true)
	_add_label(stack, "The current local save is preserved.", 11, MUTED)
	_wide_button(stack, "Stay", func(): exit_layer.queue_free(); exit_layer = null)
	_wide_button(stack, "Exit application", func(): get_tree().quit(), true)

func _wallet_summary(wallet_value: Variant) -> String:
	var wallet: Dictionary = wallet_value if wallet_value is Dictionary else {}
	return "%s xc · %s xs · %s xg · %s zj · %s az" % [
		str(wallet.get("xc", 0)), str(wallet.get("xs", 0)), str(wallet.get("xg", 0)),
		str(wallet.get("zj", 0)), str(wallet.get("az", 0))
	]

func _page_title(page: String) -> String:
	for item in NAV_ITEMS:
		if item.id == page:
			return str(item.label)
	return "Floating Control"

func _set_notice(message: String) -> void:
	notice_text = message
	_render()

func _add_notice(parent: Node, message: String) -> void:
	var panel := PanelContainer.new()
	panel.add_theme_stylebox_override("panel", _style_box(Color("#392c24") if is_dark_theme else Color("#f2e4d8"), ALERT, 5, 1))
	parent.add_child(panel)
	var label := Label.new()
	label.text = message
	label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	label.add_theme_font_size_override("font_size", 10)
	label.add_theme_color_override("font_color", PAPER if is_dark_theme else INK)
	panel.add_child(label)

func _play_click() -> void:
	_play_asset(BUTTON_SOUND, -12.0)

func _play_asset(path: String, volume_db: float = -9.0) -> void:
	if not sound_enabled:
		return
	if not ResourceLoader.exists(path):
		return
	var stream: AudioStream = load(path)
	if stream == null:
		return
	audio_player.stop()
	audio_player.stream = stream
	audio_player.volume_db = volume_db
	audio_player.play()

func _add_kitty_dummy() -> void:
	pass
