@tool
extends Node2D

@onready var character: MerzkavaCharacterSprite = $CharacterSprite

@export_enum("Front", "Back", "Left", "Right") var facing: int = 0:
	set(value):
		facing = clampi(value, 0, 3)
		if is_instance_valid(character):
			character.facing = facing
		queue_redraw()

const BG := Color("#171821")
const PANEL := Color("#23232d")
const GROUND := Color("#393540")
const WALL := Color("#c6b99f")
const WALL_SHADE := Color("#8e806e")
const ROOF := Color("#493a42")
const ROOF_LIGHT := Color("#765349")
const INK := Color("#211f2a")
const GOLD := Color("#d49a54")

func _ready() -> void:
	if is_instance_valid(character):
		character.facing = facing
	queue_redraw()

func _draw() -> void:
	draw_rect(Rect2(0, 0, 720, 400), BG)
	draw_rect(Rect2(18, 16, 684, 58), PANEL)
	draw_string(ThemeDB.fallback_font, Vector2(34, 42), "MERZKAVA  /  GODOT ART WORKSHOP", HORIZONTAL_ALIGNMENT_LEFT, -1, 17, Color("#f0e4cd"))
	draw_string(ThemeDB.fallback_font, Vector2(34, 61), "48 × 64 logical sprite  •  four directions  •  nearest-pixel rendering", HORIZONTAL_ALIGNMENT_LEFT, -1, 10, Color("#b9ad9c"))
	# Ground plane and a simple house used only to verify relative scale.
	draw_rect(Rect2(0, 286, 720, 114), Color("#292832"))
	draw_rect(Rect2(0, 286, 720, 3), GROUND)
	_draw_house()
	draw_string(ThemeDB.fallback_font, Vector2(82, 335), "PLAYER  /  HUMAN SCALE", HORIZONTAL_ALIGNMENT_LEFT, -1, 11, Color("#e5d8bd"))
	draw_string(ThemeDB.fallback_font, Vector2(404, 335), "BUILDING  /  WORLD SCALE", HORIZONTAL_ALIGNMENT_LEFT, -1, 11, Color("#e5d8bd"))
	draw_string(ThemeDB.fallback_font, Vector2(34, 378), "Change Facing in the Inspector to review front, back and both side profiles.", HORIZONTAL_ALIGNMENT_LEFT, -1, 10, Color("#b9ad9c"))

func _draw_house() -> void:
	# A deliberately taller, wider ordinary home: the person stays smaller.
	# Wall outline and interior.
	draw_colored_polygon(PackedVector2Array([
		Vector2(390, 153), Vector2(493, 153), Vector2(493, 286),
		Vector2(390, 286)
	]), INK)
	draw_rect(Rect2(395, 158, 93, 125), WALL)
	draw_rect(Rect2(395, 158, 8, 125), WALL_SHADE)
	draw_rect(Rect2(480, 158, 8, 125), Color("#a8987f"))
	# Roof, with stepped eaves and layered shadow.
	draw_colored_polygon(PackedVector2Array([
		Vector2(369, 158), Vector2(441, 86), Vector2(514, 158),
		Vector2(505, 164), Vector2(441, 105), Vector2(379, 164)
	]), INK)
	draw_colored_polygon(PackedVector2Array([
		Vector2(377, 155), Vector2(441, 92), Vector2(507, 155),
		Vector2(498, 158), Vector2(441, 102), Vector2(385, 158)
	]), ROOF)
	draw_colored_polygon(PackedVector2Array([
		Vector2(390, 148), Vector2(441, 105), Vector2(490, 148),
		Vector2(484, 151), Vector2(441, 112), Vector2(396, 151)
	]), ROOF_LIGHT)
	# Carved roof edge.
	draw_rect(Rect2(371, 156, 142, 5), INK)
	draw_rect(Rect2(379, 161, 126, 3), GOLD)
	# Door, lintel and lattice window.
	draw_rect(Rect2(425, 211, 35, 75), INK)
	draw_rect(Rect2(429, 216, 27, 70), Color("#594238"))
	draw_rect(Rect2(432, 220, 2, 64), Color("#b07a4e"))
	draw_rect(Rect2(451, 220, 2, 64), Color("#b07a4e"))
	draw_rect(Rect2(434, 231, 18, 2), GOLD)
	draw_rect(Rect2(434, 244, 18, 2), GOLD)
	draw_rect(Rect2(434, 257, 18, 2), GOLD)
	draw_rect(Rect2(469, 183, 15, 23), INK)
	draw_rect(Rect2(472, 186, 9, 17), Color("#d7b77e"))
	draw_rect(Rect2(476, 186, 1, 17), ROOF)
	draw_rect(Rect2(472, 194, 9, 1), ROOF)
	# Foundation and small step.
	draw_rect(Rect2(384, 282, 116, 6), INK)
	draw_rect(Rect2(412, 286, 60, 5), WALL_SHADE)
	draw_rect(Rect2(418, 291, 48, 3), INK)
