@tool
extends EditorPlugin

var export_plugin: EditorExportPlugin

func _enter_tree() -> void:
	export_plugin = MerzkavaAndroidExport.new()
	add_export_plugin(export_plugin)

func _exit_tree() -> void:
	if export_plugin:
		remove_export_plugin(export_plugin)
		export_plugin = null

class MerzkavaAndroidExport extends EditorExportPlugin:
	var plugin_name := "MerzkavaAndroid"

	func _supports_platform(platform: EditorExportPlatform) -> bool:
		return platform is EditorExportPlatformAndroid

	func _get_android_libraries(platform: EditorExportPlatform, debug: bool) -> PackedStringArray:
		if debug:
			return PackedStringArray(["merzkava_android/bin/debug/MerzkavaAndroid-debug.aar"])
		return PackedStringArray(["merzkava_android/bin/release/MerzkavaAndroid-release.aar"])

	func _get_name() -> String:
		return plugin_name

	func _get_android_manifest_activity_element_contents(platform: EditorExportPlatform, debug: bool) -> String:
		return 'android:supportsPictureInPicture="true" android:resizeableActivity="true"'
