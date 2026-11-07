package com.antarezka.merzkava.android

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.PixelFormat
import android.graphics.RadialGradient
import android.graphics.RectF
import android.graphics.Shader
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.os.Build
import android.os.IBinder
import android.os.SystemClock
import android.provider.Settings
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager

class MerzkavaFloatingService : Service() {
    companion object {
        const val ACTION_START_BUBBLE = "com.antarezka.merzkava.godot.FLOATING_START_BUBBLE"
        const val ACTION_STOP = "com.antarezka.merzkava.godot.FLOATING_STOP"
        private const val CHANNEL_ID = "merzkava_godot_floating"
        private const val NOTIFICATION_ID = 2401
        @Volatile private var active = false
        @Volatile private var visible = false
        fun isActive() = active
        fun isBubbleVisible() = visible
    }

    private var windowManager: WindowManager? = null
    private var bubble: KittyBubbleView? = null
    private var networkManager: ConnectivityManager? = null
    private var networkCallback: ConnectivityManager.NetworkCallback? = null
    private var online = false
    private var downX = 0f
    private var downY = 0f
    private var startX = 0
    private var startY = 0
    private var moved = false

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(CHANNEL_ID, "Merzkava Floating Mode", NotificationManager.IMPORTANCE_LOW)
            channel.description = "Keeps the requested Kitty bubble available."
            (getSystemService(NOTIFICATION_SERVICE) as? NotificationManager)?.createNotificationChannel(channel)
        }
        updateNetworkState()
        registerNetworkObserver()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        try {
            val builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                Notification.Builder(this, CHANNEL_ID) else Notification.Builder(this)
            val notification = builder
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle("Merzkava Floating Mode")
                .setContentText("Kitty bubble is active.")
                .setOngoing(true)
                .setCategory(Notification.CATEGORY_SERVICE)
                .build()
            if (Build.VERSION.SDK_INT >= 34) {
                startForeground(NOTIFICATION_ID, notification, android.content.pm.ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE)
            } else {
                startForeground(NOTIFICATION_ID, notification)
            }
            active = true
            when (intent?.action) {
                ACTION_START_BUBBLE -> showBubble()
                ACTION_STOP -> {
                    removeBubble()
                    stopForeground(true)
                    active = false
                    stopSelf()
                }
            }
        } catch (error: Exception) {
            android.util.Log.e("MerzkavaAndroid", "Floating service action failed", error)
            removeBubble()
            active = false
            stopSelf()
        }
        return START_NOT_STICKY
    }

    private fun registerNetworkObserver() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) return
        networkManager = getSystemService(CONNECTIVITY_SERVICE) as? ConnectivityManager
        networkCallback = object : ConnectivityManager.NetworkCallback() {
            override fun onAvailable(network: Network) = updateNetworkState()
            override fun onLost(network: Network) = updateNetworkState()
            override fun onCapabilitiesChanged(network: Network, caps: NetworkCapabilities) = updateNetworkState()
        }
        try {
            networkManager?.registerDefaultNetworkCallback(networkCallback!!)
        } catch (error: Exception) {
            android.util.Log.w("MerzkavaAndroid", "Unable to observe network changes", error)
        }
    }

    private fun updateNetworkState() {
        val manager = getSystemService(CONNECTIVITY_SERVICE) as? ConnectivityManager
        val network = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) manager?.activeNetwork else null
        val caps = network?.let { manager?.getNetworkCapabilities(it) }
        val next = caps?.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) == true &&
            caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED)
        if (next != online) {
            online = next
            bubble?.postInvalidate()
        }
    }

    private fun dp(value: Float) = (value * resources.displayMetrics.density).toInt()

    private fun showBubble() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) return
        val wm = windowManager ?: return
        removeBubble()
        val view = KittyBubbleView(this)
        val params = WindowManager.LayoutParams(
            dp(64f), dp(64f),
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY else WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
                WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
            PixelFormat.TRANSLUCENT
        )
        params.gravity = Gravity.TOP or Gravity.START
        params.x = dp(12f)
        params.y = dp(110f)
        view.setOnTouchListener { _, event ->
            when (event.actionMasked) {
                MotionEvent.ACTION_DOWN -> {
                    downX = event.rawX
                    downY = event.rawY
                    startX = params.x
                    startY = params.y
                    moved = false
                    true
                }
                MotionEvent.ACTION_MOVE -> {
                    val dx = (event.rawX - downX).toInt()
                    val dy = (event.rawY - downY).toInt()
                    if (kotlin.math.abs(dx) + kotlin.math.abs(dy) > dp(5f)) moved = true
                    params.x = (startX + dx).coerceAtLeast(0)
                    params.y = (startY + dy).coerceAtLeast(0)
                    try { wm.updateViewLayout(view, params) } catch (_: Exception) { }
                    true
                }
                MotionEvent.ACTION_UP -> {
                    if (!moved) openMainApp()
                    true
                }
                MotionEvent.ACTION_CANCEL -> true
                else -> false
            }
        }
        try {
            wm.addView(view, params)
            bubble = view
            visible = true
        } catch (error: Exception) {
            android.util.Log.e("MerzkavaAndroid", "Kitty bubble attachment failed", error)
            visible = false
        }
    }

    private fun openMainApp() {
        try {
            val launch = packageManager.getLaunchIntentForPackage(packageName) ?: return
            launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP)
            startActivity(launch)
        } catch (error: Exception) {
            android.util.Log.e("MerzkavaAndroid", "Unable to restore app from Kitty bubble", error)
        }
    }

    private fun removeBubble() {
        val view = bubble
        val wm = windowManager
        if (view != null && view.parent != null && wm != null) {
            try { wm.removeViewImmediate(view) } catch (_: Exception) { }
        }
        bubble = null
        visible = false
    }

    private inner class KittyBubbleView(context: Context) : View(context) {
        private val paint = Paint(Paint.ANTI_ALIAS_FLAG)
        private val shadow: Bitmap? = BitmapFactory.decodeResource(resources, R.drawable.kitty_shadow)
        private val tail: Bitmap? = BitmapFactory.decodeResource(resources, R.drawable.kitty_tail)
        private val body: Bitmap? = BitmapFactory.decodeResource(resources, R.drawable.kitty_body)
        private val head: Bitmap? = BitmapFactory.decodeResource(resources, R.drawable.kitty_head)

        private fun drawLayer(canvas: Canvas, bitmap: Bitmap?) {
            if (bitmap == null) return
            val inset = dp(4f).toFloat()
            canvas.drawBitmap(bitmap, null, RectF(inset, inset, width - inset, height - inset), paint)
        }

        override fun onDraw(canvas: Canvas) {
            super.onDraw(canvas)
            val cx = width / 2f
            val cy = height / 2f
            val now = SystemClock.uptimeMillis()
            val ring = if (online) Color.rgb(226, 184, 82) else Color.rgb(224, 65, 62)
            val rotation = (now % 2600L) * (360f / 2600f)
            paint.shader = null
            paint.style = Paint.Style.STROKE
            paint.strokeWidth = dp(1.4f).toFloat()
            paint.color = ring
            paint.alpha = 22
            canvas.drawCircle(cx, cy, dp(29.5f).toFloat(), paint)

            paint.strokeCap = Paint.Cap.ROUND
            paint.strokeWidth = dp(3.2f).toFloat()
            for (index in 0 until 14) {
                val progress = index / 13f
                val start = rotation - 112f + progress * 112f
                val sweep = 112f / 14f - 1.1f
                paint.color = Color.argb((24 + 196 * progress * progress).toInt(), Color.red(ring), Color.green(ring), Color.blue(ring))
                paint.setShadowLayer(dp(5.5f * progress).toFloat(), 0f, 0f, ring)
                canvas.drawArc(
                    RectF(cx - dp(29.5f), cy - dp(29.5f), cx + dp(29.5f), cy + dp(29.5f)),
                    start, sweep, false, paint
                )
                paint.clearShadowLayer()
            }

            val angle = Math.toRadians(rotation.toDouble())
            val hx = cx + kotlin.math.cos(angle).toFloat() * dp(29.5f)
            val hy = cy + kotlin.math.sin(angle).toFloat() * dp(29.5f)
            val phase = (now % 2600L) / 2600f
            val flash = when {
                phase >= .735f && phase < .755f -> 1f
                phase >= .755f && phase < .768f -> .12f
                phase >= .768f && phase < .790f -> .92f
                else -> 0f
            }
            if (flash > 0f) {
                paint.style = Paint.Style.FILL
                paint.shader = RadialGradient(
                    hx, hy, dp(16f).toFloat(),
                    intArrayOf(
                        Color.argb((238 * flash).toInt(), 255, 250, 231),
                        Color.argb((170 * flash).toInt(), Color.red(ring), Color.green(ring), Color.blue(ring)),
                        Color.TRANSPARENT
                    ),
                    floatArrayOf(0f, 0.26f, 1f), Shader.TileMode.CLAMP
                )
                canvas.drawCircle(hx, hy, dp(16f).toFloat(), paint)
                paint.shader = null
            }
            paint.style = Paint.Style.FILL
            paint.color = Color.WHITE
            paint.setShadowLayer(dp(11f).toFloat(), 0f, 0f, if (online) Color.rgb(255, 224, 142) else Color.rgb(255, 91, 83))
            canvas.drawCircle(hx, hy, dp(2.8f).toFloat(), paint)
            paint.clearShadowLayer()
            paint.color = Color.rgb(29, 35, 29)
            canvas.drawCircle(cx, cy, dp(26f).toFloat(), paint)
            paint.shader = null
            drawLayer(canvas, shadow)
            drawLayer(canvas, tail)
            drawLayer(canvas, body)
            drawLayer(canvas, head)
            postInvalidateDelayed(32)
        }
    }

    override fun onDestroy() {
        removeBubble()
        networkCallback?.let { callback ->
            try { networkManager?.unregisterNetworkCallback(callback) } catch (_: Exception) { }
        }
        networkCallback = null
        active = false
        stopForeground(true)
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
