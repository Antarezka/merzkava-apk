extends RefCounted
class_name MerzkavaMotion

# Lightweight UI motion helpers. Keep these short and property-based so the
# final client uses Godot's native Tween system instead of a web animation runtime.

const FAST := 0.14
const STANDARD := 0.22


static func fade_in(target: CanvasItem, duration: float = STANDARD) -> Tween:
	if not is_instance_valid(target):
		return null
	target.modulate.a = 0.0
	var tween := target.create_tween()
	tween.set_pause_mode(Tween.TWEEN_PAUSE_BOUND)
	tween.tween_property(target, "modulate:a", 1.0, maxf(duration, 0.01)) \
		.set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
	return tween


static func pop_in(target: Control, duration: float = STANDARD) -> Tween:
	if not is_instance_valid(target):
		return null
	var final_scale := target.scale
	target.pivot_offset = target.size * 0.5
	target.scale = final_scale * 0.96
	target.modulate.a = 0.0
	var tween := target.create_tween()
	tween.set_pause_mode(Tween.TWEEN_PAUSE_BOUND)
	tween.set_parallel(true)
	tween.tween_property(target, "scale", final_scale, maxf(duration, 0.01)) \
		.set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tween.tween_property(target, "modulate:a", 1.0, maxf(duration, 0.01)) \
		.set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
	return tween


static func press_feedback(target: Control, pressed_scale: float = 0.97) -> Tween:
	if not is_instance_valid(target):
		return null
	var final_scale := target.scale
	target.pivot_offset = target.size * 0.5
	var tween := target.create_tween()
	tween.set_pause_mode(Tween.TWEEN_PAUSE_BOUND)
	tween.tween_property(target, "scale", final_scale * pressed_scale, FAST) \
		.set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	tween.tween_property(target, "scale", final_scale, FAST) \
		.set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	return tween
