@tool
class_name MerzkavaCharacterSprite
extends Node2D

## Original Merzkava wuxia-fantasy pixel sprite.
## Drawn on a 48x64 logical canvas with hard pixel clusters; no external art files.

@export_enum("Front", "Back", "Left", "Right") var facing: int = 0:
	set(value):
		facing = clampi(value, 0, 3)
		queue_redraw()

const INK := Color("#211f2a")
const INK_SOFT := Color("#38313b")
const HAIR := Color("#211e28")
const HAIR_MID := Color("#39323f")
const HAIR_LIGHT := Color("#655264")
const SKIN := Color("#e8c7a1")
const SKIN_SHADE := Color("#bd8e77")
const SKIN_LIGHT := Color("#f5ddbd")
const ROBE := Color("#e8ddc5")
const ROBE_LIGHT := Color("#f7ecd5")
const ROBE_SHADE := Color("#b9a889")
const ROBE_DARK := Color("#877968")
const SASH := Color("#c96f39")
const SASH_LIGHT := Color("#e39a50")
const SASH_DARK := Color("#823f31")
const GOLD := Color("#e6b45f")
const BOOT := Color("#37303a")
const BOOT_LIGHT := Color("#66505a")

func _draw() -> void:
	draw_set_transform(Vector2.ZERO, 0.0, Vector2.ONE)
	match facing:
		0:
			_draw_front()
		1:
			_draw_back()
		2:
			_draw_side(false)
		3:
			draw_set_transform(Vector2(48, 0), 0.0, Vector2(-1, 1))
			_draw_side(true)
			draw_set_transform(Vector2.ZERO, 0.0, Vector2.ONE)

func _poly(points: PackedVector2Array, color: Color) -> void:
	draw_colored_polygon(points, color)

func _px(x: int, y: int, w: int, h: int, color: Color) -> void:
	draw_rect(Rect2(x, y, w, h), color)

func _shadow() -> void:
	_poly(PackedVector2Array([
		Vector2(9, 59), Vector2(15, 57), Vector2(34, 57),
		Vector2(40, 60), Vector2(34, 62), Vector2(14, 62)
	]), Color("#17151c").darkened(0.12))

func _boots_front() -> void:
	_poly(PackedVector2Array([
		Vector2(12, 51), Vector2(21, 51), Vector2(21, 59),
		Vector2(18, 61), Vector2(10, 61), Vector2(10, 57)
	]), INK)
	_poly(PackedVector2Array([
		Vector2(27, 51), Vector2(36, 51), Vector2(38, 57),
		Vector2(36, 61), Vector2(28, 61), Vector2(27, 58)
	]), INK)
	_px(12, 55, 7, 4, BOOT)
	_px(29, 55, 7, 4, BOOT)
	_px(13, 54, 5, 2, BOOT_LIGHT)
	_px(30, 54, 5, 2, BOOT_LIGHT)
	_px(10, 60, 9, 2, INK_SOFT)
	_px(29, 60, 9, 2, INK_SOFT)

func _draw_front() -> void:
	_shadow()
	_boots_front()
	# Long outer robe and its dark pixel outline.
	_poly(PackedVector2Array([
		Vector2(14, 24), Vector2(34, 24), Vector2(39, 31),
		Vector2(40, 49), Vector2(36, 55), Vector2(12, 55),
		Vector2(8, 49), Vector2(9, 32)
	]), INK)
	_poly(PackedVector2Array([
		Vector2(15, 26), Vector2(33, 26), Vector2(37, 32),
		Vector2(37, 49), Vector2(34, 52), Vector2(14, 52),
		Vector2(11, 49), Vector2(12, 32)
	]), ROBE)
	# Sleeves: broad, layered silhouette.
	_poly(PackedVector2Array([
		Vector2(13, 27), Vector2(19, 29), Vector2(17, 40),
		Vector2(12, 45), Vector2(5, 40), Vector2(7, 32)
	]), INK)
	_poly(PackedVector2Array([
		Vector2(14, 29), Vector2(18, 30), Vector2(15, 39),
		Vector2(11, 42), Vector2(8, 39), Vector2(9, 33)
	]), ROBE_LIGHT)
	_poly(PackedVector2Array([
		Vector2(35, 27), Vector2(29, 29), Vector2(31, 40),
		Vector2(36, 45), Vector2(43, 40), Vector2(41, 32)
	]), INK)
	_poly(PackedVector2Array([
		Vector2(34, 29), Vector2(30, 30), Vector2(33, 39),
		Vector2(37, 42), Vector2(40, 39), Vector2(39, 33)
	]), ROBE)
	# Sleeve cuffs and hand hints.
	_px(7, 39, 5, 3, ROBE_SHADE)
	_px(36, 39, 5, 3, ROBE_SHADE)
	_px(8, 42, 3, 2, SKIN_SHADE)
	_px(38, 42, 3, 2, SKIN_SHADE)
	# Main robe panels, folds and hem.
	_poly(PackedVector2Array([
		Vector2(16, 29), Vector2(32, 29), Vector2(35, 49),
		Vector2(31, 53), Vector2(17, 53), Vector2(13, 49)
	]), ROBE_LIGHT)
	_poly(PackedVector2Array([
		Vector2(16, 33), Vector2(21, 35), Vector2(18, 51),
		Vector2(14, 51), Vector2(13, 48)
	]), ROBE_SHADE)
	_poly(PackedVector2Array([
		Vector2(32, 33), Vector2(27, 35), Vector2(30, 51),
		Vector2(34, 51), Vector2(35, 48)
	]), ROBE)
	_px(22, 37, 4, 14, ROBE)
	_px(18, 50, 12, 2, ROBE_DARK)
	_px(15, 52, 19, 1, GOLD)
	# Crossed inner collar.
	_poly(PackedVector2Array([
		Vector2(17, 24), Vector2(24, 29), Vector2(31, 24),
		Vector2(34, 31), Vector2(25, 38), Vector2(14, 31)
	]), INK)
	_poly(PackedVector2Array([
		Vector2(18, 26), Vector2(24, 31), Vector2(30, 26),
		Vector2(31, 30), Vector2(24, 36), Vector2(17, 30)
	]), ROBE_LIGHT)
	_poly(PackedVector2Array([
		Vector2(18, 26), Vector2(24, 31), Vector2(21, 34),
		Vector2(16, 30)
	]), ROBE_SHADE)
	# Waist sash and tied knot.
	_px(15, 37, 19, 4, INK)
	_px(16, 38, 17, 2, SASH)
	_px(17, 38, 8, 1, SASH_LIGHT)
	_px(25, 40, 5, 3, SASH_DARK)
	_poly(PackedVector2Array([
		Vector2(27, 40), Vector2(31, 41), Vector2(30, 48),
		Vector2(27, 46)
	]), SASH)
	_px(26, 41, 2, 2, GOLD)
	# Neck and face.
	_px(21, 20, 7, 6, SKIN_SHADE)
	_px(22, 20, 5, 5, SKIN)
	_poly(PackedVector2Array([
		Vector2(15, 10), Vector2(18, 7), Vector2(30, 7),
		Vector2(34, 12), Vector2(33, 23), Vector2(29, 28),
		Vector2(19, 28), Vector2(15, 23)
	]), INK)
	_poly(PackedVector2Array([
		Vector2(17, 12), Vector2(20, 10), Vector2(29, 10),
		Vector2(32, 13), Vector2(31, 23), Vector2(28, 26),
		Vector2(20, 26), Vector2(17, 22)
	]), SKIN)
	_px(18, 13, 2, 7, SKIN_LIGHT)
	_px(29, 21, 2, 3, SKIN_SHADE)
	# Eyes, brows and calm expression.
	_px(19, 18, 4, 1, HAIR)
	_px(27, 18, 4, 1, HAIR)
	_px(20, 19, 2, 2, Color("#a66b3f"))
	_px(28, 19, 2, 2, Color("#a66b3f"))
	_px(22, 23, 5, 1, SKIN_SHADE)
	# Hair cap, separated locks and ribbon ornament.
	_poly(PackedVector2Array([
		Vector2(14, 15), Vector2(13, 9), Vector2(18, 4),
		Vector2(29, 3), Vector2(35, 8), Vector2(35, 17),
		Vector2(31, 14), Vector2(28, 12), Vector2(24, 16),
		Vector2(19, 14), Vector2(16, 20)
	]), HAIR)
	_poly(PackedVector2Array([
		Vector2(16, 9), Vector2(21, 5), Vector2(29, 5),
		Vector2(33, 9), Vector2(30, 11), Vector2(22, 10)
	]), HAIR_MID)
	_px(19, 6, 5, 1, HAIR_LIGHT)
	_px(30, 8, 2, 2, HAIR)
	_poly(PackedVector2Array([
		Vector2(15, 13), Vector2(19, 13), Vector2(18, 24),
		Vector2(15, 27), Vector2(13, 21)
	]), HAIR)
	_poly(PackedVector2Array([
		Vector2(31, 12), Vector2(35, 13), Vector2(35, 23),
		Vector2(32, 27), Vector2(30, 22)
	]), HAIR_MID)
	_px(16, 16, 1, 5, HAIR_LIGHT)
	_px(33, 18, 1, 5, HAIR)
	_px(22, 4, 7, 2, SASH_DARK)
	_px(24, 3, 4, 1, GOLD)
	_px(25, 6, 2, 2, SASH_LIGHT)
	# Small woven detail on the robe.
	_px(19, 44, 2, 2, GOLD)
	_px(28, 46, 2, 2, GOLD)
	_px(23, 48, 2, 1, ROBE_LIGHT)

func _draw_back() -> void:
	_shadow()
	_boots_front()
	_poly(PackedVector2Array([
		Vector2(14, 24), Vector2(34, 24), Vector2(39, 31),
		Vector2(40, 49), Vector2(36, 55), Vector2(12, 55),
		Vector2(8, 49), Vector2(9, 32)
	]), INK)
	_poly(PackedVector2Array([
		Vector2(15, 26), Vector2(33, 26), Vector2(37, 32),
		Vector2(37, 49), Vector2(34, 52), Vector2(14, 52),
		Vector2(11, 49), Vector2(12, 32)
	]), ROBE)
	_poly(PackedVector2Array([
		Vector2(13, 28), Vector2(19, 29), Vector2(16, 42),
		Vector2(10, 44), Vector2(6, 39), Vector2(8, 32)
	]), INK)
	_poly(PackedVector2Array([
		Vector2(35, 28), Vector2(29, 29), Vector2(32, 42),
		Vector2(38, 44), Vector2(42, 39), Vector2(40, 32)
	]), INK)
	_poly(PackedVector2Array([
		Vector2(15, 29), Vector2(18, 31), Vector2(14, 40),
		Vector2(9, 39), Vector2(10, 33)
	]), ROBE_LIGHT)
	_poly(PackedVector2Array([
		Vector2(33, 29), Vector2(30, 31), Vector2(34, 40),
		Vector2(39, 39), Vector2(38, 33)
	]), ROBE)
	# Back panel with vertical tailoring.
	_poly(PackedVector2Array([
		Vector2(17, 28), Vector2(31, 28), Vector2(35, 50),
		Vector2(31, 53), Vector2(17, 53), Vector2(13, 50)
	]), ROBE_LIGHT)
	_px(23, 30, 2, 20, ROBE_SHADE)
	_px(17, 37, 14, 3, INK)
	_px(18, 38, 12, 1, SASH)
	_px(23, 41, 2, 7, SASH_DARK)
	_px(24, 42, 1, 5, GOLD)
	_px(15, 51, 18, 1, GOLD)
	# Neck and hair drape.
	_px(21, 21, 7, 7, SKIN_SHADE)
	_poly(PackedVector2Array([
		Vector2(14, 13), Vector2(16, 7), Vector2(22, 4),
		Vector2(30, 5), Vector2(35, 11), Vector2(35, 24),
		Vector2(33, 31), Vector2(30, 35), Vector2(18, 35),
		Vector2(14, 29)
	]), INK)
	_poly(PackedVector2Array([
		Vector2(17, 9), Vector2(23, 6), Vector2(30, 7),
		Vector2(33, 12), Vector2(31, 25), Vector2(28, 32),
		Vector2(19, 32), Vector2(16, 25)
	]), HAIR_MID)
	_px(19, 9, 6, 2, HAIR_LIGHT)
	_px(17, 16, 2, 12, HAIR)
	_px(30, 15, 3, 14, HAIR)
	_px(21, 17, 7, 2, HAIR)
	_px(23, 20, 3, 9, HAIR)
	_px(22, 4, 8, 2, SASH_DARK)
	_px(25, 3, 3, 1, GOLD)
	# Hair ribbon and small robe embroidery.
	_px(18, 34, 12, 2, SASH_DARK)
	_px(20, 34, 8, 1, GOLD)
	_px(18, 44, 2, 3, GOLD)
	_px(29, 44, 2, 3, GOLD)

func _draw_side(mirrored: bool) -> void:
	_shadow()
	# Side silhouette: narrow shoulder, long back hair, layered robe.
	_poly(PackedVector2Array([
		Vector2(14, 24), Vector2(30, 25), Vector2(36, 32),
		Vector2(34, 50), Vector2(30, 55), Vector2(12, 55),
		Vector2(9, 49), Vector2(12, 34)
	]), INK)
	_poly(PackedVector2Array([
		Vector2(16, 27), Vector2(29, 27), Vector2(33, 33),
		Vector2(31, 50), Vector2(29, 52), Vector2(14, 52),
		Vector2(12, 49), Vector2(14, 34)
	]), ROBE)
	_poly(PackedVector2Array([
		Vector2(16, 28), Vector2(21, 30), Vector2(18, 41),
		Vector2(11, 43), Vector2(8, 38), Vector2(11, 32)
	]), INK)
	_poly(PackedVector2Array([
		Vector2(17, 30), Vector2(20, 31), Vector2(17, 39),
		Vector2(12, 40), Vector2(11, 37), Vector2(13, 33)
	]), ROBE_LIGHT)
	_px(17, 34, 3, 15, ROBE_SHADE)
	_px(22, 35, 3, 16, ROBE_LIGHT)
	_px(25, 38, 7, 3, INK)
	_px(26, 39, 6, 1, SASH)
	_px(28, 41, 3, 7, SASH_DARK)
	_px(29, 42, 1, 5, GOLD)
	_px(15, 51, 16, 1, GOLD)
	# Feet.
	_px(12, 54, 9, 6, INK)
	_px(13, 55, 7, 4, BOOT)
	_px(27, 54, 8, 6, INK)
	_px(28, 55, 6, 4, BOOT_LIGHT)
	# Face profile.
	_px(20, 20, 6, 6, SKIN_SHADE)
	_poly(PackedVector2Array([
		Vector2(16, 11), Vector2(20, 8), Vector2(29, 9),
		Vector2(33, 14), Vector2(30, 23), Vector2(23, 27),
		Vector2(17, 23)
	]), INK)
	_poly(PackedVector2Array([
		Vector2(19, 12), Vector2(27, 11), Vector2(30, 15),
		Vector2(28, 22), Vector2(23, 24), Vector2(19, 21)
	]), SKIN)
	_px(27, 16, 3, 2, SKIN_LIGHT)
	_px(28, 19, 2, 2, Color("#9f633e"))
	_px(26, 22, 3, 1, SKIN_SHADE)
	# Top hair, swept fringe and a tied tail.
	_poly(PackedVector2Array([
		Vector2(14, 16), Vector2(14, 9), Vector2(20, 4),
		Vector2(30, 5), Vector2(35, 11), Vector2(33, 19),
		Vector2(29, 15), Vector2(24, 14), Vector2(20, 18),
		Vector2(17, 23)
	]), HAIR)
	_poly(PackedVector2Array([
		Vector2(17, 9), Vector2(22, 6), Vector2(30, 8),
		Vector2(33, 12), Vector2(28, 12), Vector2(22, 10)
	]), HAIR_MID)
	_px(21, 7, 5, 1, HAIR_LIGHT)
	_px(16, 16, 2, 10, HAIR)
	_px(13, 25, 4, 12, HAIR_MID)
	_px(12, 35, 3, 7, HAIR)
	_px(28, 5, 5, 2, SASH_DARK)
	_px(30, 4, 2, 1, GOLD)
	# Layered shoulder capelet.
	_poly(PackedVector2Array([
		Vector2(17, 27), Vector2(27, 27), Vector2(32, 32),
		Vector2(29, 35), Vector2(19, 33)
	]), ROBE_LIGHT)
	_px(19, 31, 8, 1, GOLD)
