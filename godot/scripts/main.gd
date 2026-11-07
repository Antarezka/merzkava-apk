extends Control

const BACKGROUND := Color("#101319")
const PANEL := Color("#191f28")
const BRASS := Color("#c69b58")
const TEXT_MAIN := Color("#eee5d6")
const TEXT_MUTED := Color("#b1aa9c")
const Motion = preload("res://scripts/motion/motion.gd")


func _ready() -> void:
	_build_migration_screen()


func _build_migration_screen() -> void:
	var background := ColorRect.new()
	background.color = BACKGROUND
	background.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	add_child(background)

	var center := CenterContainer.new()
	center.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	add_child(center)

	var panel := PanelContainer.new()
	panel.custom_minimum_size = Vector2(340, 0)
	var panel_style := StyleBoxFlat.new()
	panel_style.bg_color = PANEL
	panel_style.border_color = Color("#51432f")
	panel_style.set_border_width_all(1)
	panel_style.set_corner_radius_all(12)
	panel_style.content_margin_left = 24
	panel_style.content_margin_right = 24
	panel_style.content_margin_top = 28
	panel_style.content_margin_bottom = 28
	panel.add_theme_stylebox_override("panel", panel_style)
	center.add_child(panel)

	var stack := VBoxContainer.new()
	stack.add_theme_constant_override("separation", 12)
	panel.add_child(stack)

	var title := Label.new()
	title.text = "MERZKAVA"
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.add_theme_color_override("font_color", BRASS)
	title.add_theme_font_size_override("font_size", 30)
	stack.add_child(title)

	var subtitle := Label.new()
	subtitle.text = "UNIVERSE"
	subtitle.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	subtitle.add_theme_color_override("font_color", TEXT_MAIN)
	subtitle.add_theme_font_size_override("font_size", 15)
	stack.add_child(subtitle)

	var divider := HSeparator.new()
	stack.add_child(divider)

	var status := Label.new()
	status.text = "Godot client foundation is online.\nFull feature migration is in progress."
	status.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	status.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	status.add_theme_color_override("font_color", TEXT_MUTED)
	status.add_theme_font_size_override("font_size", 14)
	stack.add_child(status)

	var offline := Label.new()
	offline.text = "OFFLINE-FIRST · LOCAL SAVE · ANDROID"
	offline.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	offline.add_theme_color_override("font_color", BRASS)
	offline.add_theme_font_size_override("font_size", 11)
	stack.add_child(offline)

	# All entrance motion is authored with Godot-native Tween helpers.
	Motion.pop_in(panel, 0.24)
	Motion.fade_in(title, 0.28)
