package com.antarezka.merzkava.android

import android.Manifest
import android.app.NotificationManager
import android.app.PictureInPictureParams
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.provider.Settings
import android.util.Base64
import android.util.Rational
import org.godotengine.godot.Godot
import org.godotengine.godot.plugin.GodotPlugin
import org.godotengine.godot.plugin.UsedByGodot
import org.json.JSONObject
import java.nio.charset.StandardCharsets
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties

class MerzkavaGodotPlugin(godot: Godot) : GodotPlugin(godot) {
    private val keyAlias = "merzkava.godot.secure-storage.v1"
    private val preferencesName = "merzkava_godot_secure_v1"

    override fun getPluginName() = "MerzkavaAndroid"

    private fun keyFor(key: String): String {
        val bytes = java.security.MessageDigest.getInstance("SHA-256")
            .digest(key.toByteArray(StandardCharsets.UTF_8))
        return Base64.encodeToString(bytes, Base64.NO_WRAP or Base64.URL_SAFE)
    }

    private fun getOrCreateKey(): SecretKey {
        val keyStore = KeyStore.getInstance("AndroidKeyStore")
        keyStore.load(null)
        if (keyStore.containsAlias(keyAlias)) return keyStore.getKey(keyAlias, null) as SecretKey
        val generator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore")
        generator.init(
            KeyGenParameterSpec.Builder(
                keyAlias,
                KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
            ).setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setRandomizedEncryptionRequired(true)
                .setKeySize(256)
                .build()
        )
        return generator.generateKey()
    }

    @UsedByGodot
    fun secureSet(key: String, value: String): String = try {
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.ENCRYPT_MODE, getOrCreateKey())
        val encrypted = cipher.doFinal(value.toByteArray(StandardCharsets.UTF_8))
        val packed = Base64.encodeToString(cipher.iv, Base64.NO_WRAP) + ":" +
            Base64.encodeToString(encrypted, Base64.NO_WRAP)
        val saved = activity?.getSharedPreferences(preferencesName, Context.MODE_PRIVATE)
            ?.edit()?.putString(keyFor(key), packed)?.commit() ?: false
        if (saved) "OK" else "ERROR:SECURE_STORAGE_COMMIT"
    } catch (error: Exception) {
        "ERROR:" + error.javaClass.simpleName + ":" + (error.message ?: "unknown")
    }

    @UsedByGodot
    fun secureGet(key: String): String {
        return try {
            val packed = activity?.getSharedPreferences(preferencesName, Context.MODE_PRIVATE)
                ?.getString(keyFor(key), null) ?: return ""
            val parts = packed.split(":", limit = 2)
            if (parts.size != 2) return "ERROR:SECURE_STORAGE_FORMAT"
            val iv = Base64.decode(parts[0], Base64.NO_WRAP)
            val encrypted = Base64.decode(parts[1], Base64.NO_WRAP)
            val cipher = Cipher.getInstance("AES/GCM/NoPadding")
            cipher.init(Cipher.DECRYPT_MODE, getOrCreateKey(), GCMParameterSpec(128, iv))
            String(cipher.doFinal(encrypted), StandardCharsets.UTF_8)
        } catch (error: Exception) {
            "ERROR:" + error.javaClass.simpleName + ":" + (error.message ?: "unknown")
        }
    }

    @UsedByGodot
    fun secureRemove(key: String): String = try {
        val removed = activity?.getSharedPreferences(preferencesName, Context.MODE_PRIVATE)
            ?.edit()?.remove(keyFor(key))?.commit() ?: false
        if (removed) "OK" else "ERROR:SECURE_STORAGE_REMOVE"
    } catch (error: Exception) {
        "ERROR:" + error.javaClass.simpleName + ":" + (error.message ?: "unknown")
    }

    @UsedByGodot
    fun getReadiness(): String {
        val context = activity?.applicationContext ?: return "{}"
        val overlay = Build.VERSION.SDK_INT < Build.VERSION_CODES.M || Settings.canDrawOverlays(context)
        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager
        var notifications = manager?.areNotificationsEnabled() == true
        if (Build.VERSION.SDK_INT >= 33) {
            notifications = notifications && context.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) ==
                android.content.pm.PackageManager.PERMISSION_GRANTED
        }
        val power = context.getSystemService(Context.POWER_SERVICE) as? PowerManager
        val battery = Build.VERSION.SDK_INT < Build.VERSION_CODES.M ||
            (power?.isIgnoringBatteryOptimizations(context.packageName) == true)
        return JSONObject()
            .put("displayOverApps", overlay)
            .put("notifications", notifications)
            .put("batteryExemption", battery)
            .put("serviceRunning", MerzkavaFloatingService.isActive())
            .put("bubbleVisible", MerzkavaFloatingService.isBubbleVisible())
            .toString()
    }

    @UsedByGodot
    fun requestOverlayPermission(): Boolean {
        val host = activity ?: return false
        runOnHostThread {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(host)) {
                host.startActivity(Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:" + host.packageName)))
            }
        }
        return true
    }

    @UsedByGodot
    fun requestNotificationPermission(): Boolean {
        val host = activity ?: return false
        runOnHostThread {
            val intent = Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS)
                .putExtra(Settings.EXTRA_APP_PACKAGE, host.packageName)
            host.startActivity(intent)
        }
        return true
    }

    @UsedByGodot
    fun requestBatteryExemption(): Boolean {
        val host = activity ?: return false
        runOnHostThread {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                val power = host.getSystemService(Context.POWER_SERVICE) as? PowerManager
                if (power?.isIgnoringBatteryOptimizations(host.packageName) != true) {
                    val request = Intent(
                        Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS,
                        Uri.parse("package:" + host.packageName)
                    )
                    try { host.startActivity(request) }
                    catch (_: Exception) {
                        host.startActivity(Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + host.packageName)))
                    }
                }
            }
        }
        return true
    }

    @UsedByGodot
    fun startBubble(): Boolean {
        val host = activity ?: return false
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(host)) return false
        runOnHostThread {
            try {
                val intent = Intent(host, MerzkavaFloatingService::class.java)
                    .setAction(MerzkavaFloatingService.ACTION_START_BUBBLE)
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) host.startForegroundService(intent)
                else host.startService(intent)
                host.window.decorView.postDelayed({ host.moveTaskToBack(true) }, 500)
            } catch (error: Exception) {
                android.util.Log.e("MerzkavaAndroid", "Could not start Kitty bubble", error)
            }
        }
        return true
    }

    @UsedByGodot
    fun openMiniWindow(): Boolean {
        val host = activity ?: return false
        if (Build.VERSION.SDK_INT < 26) return false
        runOnHostThread {
            try {
                host.enterPictureInPictureMode(
                    PictureInPictureParams.Builder().setAspectRatio(Rational(9, 16)).build()
                )
            } catch (error: Exception) {
                android.util.Log.e("MerzkavaAndroid", "Could not open picture-in-picture", error)
            }
        }
        return true
    }

    @UsedByGodot
    fun stopFloatingService(): Boolean {
        val host = activity ?: return false
        runOnHostThread { host.stopService(Intent(host, MerzkavaFloatingService::class.java)) }
        return true
    }

    @UsedByGodot
    fun openMainApp(): Boolean {
        val host = activity ?: return false
        runOnHostThread {
            val launch = host.packageManager.getLaunchIntentForPackage(host.packageName) ?: return@runOnHostThread
            launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP)
            host.startActivity(launch)
        }
        return true
    }
}
