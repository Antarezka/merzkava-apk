package com.antarezka.merzkava;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkInfo;
import android.content.pm.ServiceInfo;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.SweepGradient;
import android.graphics.Matrix;
import android.graphics.Path;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.IBinder;
import android.os.SystemClock;
import android.provider.Settings;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;

public class FloatingKeepAliveService extends Service {
    public static final String ACTION_START_BUBBLE = "com.antarezka.merzkava.FLOATING_START_BUBBLE";
    public static final String ACTION_HIDE_BUBBLE = "com.antarezka.merzkava.FLOATING_HIDE_BUBBLE";
    public static final String ACTION_STOP = "com.antarezka.merzkava.FLOATING_STOP";
    public static final String ACTION_OPEN_WINDOW = "com.antarezka.merzkava.FLOATING_OPEN_WINDOW";
    private static final String CHANNEL_ID = "merzkava_floating_mode";
    private static final int NOTIFICATION_ID = 2301;
    private static volatile boolean active;
    private static volatile boolean bubbleVisible;
    private WindowManager windowManager;
    private KittyBubbleView bubble;
    private WindowManager.LayoutParams bubbleParams;
    private float downX, downY;
    private int startX, startY;
    private boolean moved;

    public static boolean isActive() { return active; }
    public static boolean isBubbleVisible() { return bubbleVisible; }

    @Override public void onCreate() {
        super.onCreate();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID, "Merzkava Floating Mode", NotificationManager.IMPORTANCE_LOW);
            channel.setDescription("Keeps the user-requested Merzkava floating controls available.");
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) manager.createNotificationChannel(channel);
        }
        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
    }

    @Override public int onStartCommand(Intent intent, int flags, int startId) {
        try {
            Notification.Builder builder = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                ? new Notification.Builder(this, CHANNEL_ID) : new Notification.Builder(this);
            builder.setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle("Merzkava Floating Mode")
                .setContentText("Kitty bubble is ready for your floating session.")
                .setOngoing(true).setCategory(Notification.CATEGORY_SERVICE);
            Notification notification = builder.build();
            if (Build.VERSION.SDK_INT >= 34) {
                startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE);
            } else {
                startForeground(NOTIFICATION_ID, notification);
            }
            active = true;
            String action = intent == null ? null : intent.getAction();
            if (ACTION_START_BUBBLE.equals(action)) showBubble();
            else if (ACTION_HIDE_BUBBLE.equals(action)) removeBubble();
            else if (ACTION_STOP.equals(action)) {
                removeBubble();
                stopForeground(true);
                stopSelf();
            }
        } catch (Exception error) {
            active = false;
            bubbleVisible = false;
            android.util.Log.e("MerzkavaFloating", "Foreground floating service action failed", error);
            stopSelf();
        }
        return START_NOT_STICKY;
    }

    private void showBubble() {
        bubbleVisible = false;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) return;
        if (windowManager == null) windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        if (windowManager == null) return;
        removeBubble();
        bubble = new KittyBubbleView();
        int type = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
            ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY : WindowManager.LayoutParams.TYPE_PHONE;
        bubbleParams = new WindowManager.LayoutParams(
            dp(64), dp(64), type,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE |
                WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN |
                WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
            PixelFormat.TRANSLUCENT);
        bubbleParams.gravity = Gravity.TOP | Gravity.START;
        bubbleParams.x = dp(12);
        bubbleParams.y = dp(110);
        bubble.setOnTouchListener((view, event) -> {
            switch (event.getAction()) {
                case MotionEvent.ACTION_DOWN:
                    downX = event.getRawX(); downY = event.getRawY();
                    startX = bubbleParams.x; startY = bubbleParams.y; moved = false;
                    return true;
                case MotionEvent.ACTION_MOVE:
                    int dx = Math.round(event.getRawX() - downX);
                    int dy = Math.round(event.getRawY() - downY);
                    if (Math.abs(dx) + Math.abs(dy) > dp(5)) moved = true;
                    bubbleParams.x = Math.max(0, startX + dx);
                    bubbleParams.y = Math.max(0, startY + dy);
                    try { windowManager.updateViewLayout(bubble, bubbleParams); } catch (Exception ignored) { }
                    return true;
                case MotionEvent.ACTION_UP:
                    if (!moved) openFloatingWindow();
                    return true;
                case MotionEvent.ACTION_CANCEL: return true;
                default: return false;
            }
        });
        windowManager.addView(bubble, bubbleParams);
        bubbleVisible = true;
    }

    private void openFloatingWindow() {
        try {
            Intent launch = getPackageManager().getLaunchIntentForPackage(getPackageName());
            if (launch == null) throw new IllegalStateException("MainActivity launch intent is unavailable.");
            launch.setAction(ACTION_OPEN_WINDOW);
            launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            startActivity(launch);
        } catch (Exception error) {
            android.util.Log.e("MerzkavaFloating", "Could not launch the floating mini window", error);
        }
    }

    private boolean hasValidatedInternet() {
        ConnectivityManager manager = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
        if (manager == null) return false;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Network network = manager.getActiveNetwork();
            if (network == null) return false;
            NetworkCapabilities capabilities = manager.getNetworkCapabilities(network);
            return capabilities != null && capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
                && capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED);
        }
        NetworkInfo info = manager.getActiveNetworkInfo();
        return info != null && info.isConnected();
    }

    private void removeBubble() {
        if (bubble != null && bubble.getParent() != null && windowManager != null) {
            try { windowManager.removeViewImmediate(bubble); } catch (Exception ignored) { }
        }
        bubble = null;
        bubbleParams = null;
        bubbleVisible = false;
    }

    private int dp(float value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private final class KittyBubbleView extends View {
        private final Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        private final Bitmap shadow = loadKittyLayer("kitty_shadow");
        private final Bitmap tail = loadKittyLayer("kitty_tail");
        private final Bitmap body = loadKittyLayer("kitty_body");
        private final Bitmap head = loadKittyLayer("kitty_head");
        private boolean online = hasValidatedInternet();
        private ConnectivityManager connectivityManager;
        private ConnectivityManager.NetworkCallback networkCallback;
        KittyBubbleView() { super(FloatingKeepAliveService.this); setLayerType(View.LAYER_TYPE_SOFTWARE, null); }
        private Bitmap loadKittyLayer(String name) {
            int id = getResources().getIdentifier(name, "drawable", getPackageName());
            return id == 0 ? null : BitmapFactory.decodeResource(getResources(), id);
        }
        private void updateConnectionState() {
            boolean next = hasValidatedInternet();
            if (online != next) { online = next; invalidate(); }
        }
        @Override protected void onAttachedToWindow() {
            super.onAttachedToWindow();
            connectivityManager = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
            updateConnectionState();
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N && connectivityManager != null) {
                networkCallback = new ConnectivityManager.NetworkCallback() {
                    @Override public void onAvailable(Network network) { post(() -> updateConnectionState()); }
                    @Override public void onLost(Network network) { post(() -> updateConnectionState()); }
                    @Override public void onCapabilitiesChanged(Network network, NetworkCapabilities caps) { post(() -> updateConnectionState()); }
                };
                try { connectivityManager.registerDefaultNetworkCallback(networkCallback); }
                catch (Exception error) { android.util.Log.w("MerzkavaFloating", "Could not observe network changes", error); }
            }
        }
        @Override protected void onDetachedFromWindow() {
            if (connectivityManager != null && networkCallback != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                try { connectivityManager.unregisterNetworkCallback(networkCallback); } catch (Exception ignored) { }
            }
            networkCallback = null;
            super.onDetachedFromWindow();
        }
        private void drawLayer(Canvas canvas, Bitmap bitmap, float inset) {
            if (bitmap == null) return;
            float side = dp(64) - inset * 2f;
            android.graphics.RectF target = new android.graphics.RectF(inset, inset, inset + side, inset + side);
            paint.setStyle(Paint.Style.FILL); paint.setAlpha(255);
            canvas.drawBitmap(bitmap, null, target, paint);
        }
        @Override protected void onDraw(Canvas canvas) {
            super.onDraw(canvas);
            float cx = getWidth()/2f, cy = getHeight()/2f;
            float pulse = .72f + .28f * (float)Math.sin(System.currentTimeMillis()/520.0);
            int ringColor = online ? Color.rgb(226, 184, 82) : Color.rgb(224, 65, 62);
            paint.setStyle(Paint.Style.STROKE); paint.setStrokeWidth(dp(2.2f));
            paint.setColor(ringColor); paint.setAlpha((int)(92 + 76 * pulse));
            paint.setShadowLayer(dp(4), 0, 0, ringColor);
            canvas.drawCircle(cx, cy, dp(29.5f), paint);
            paint.clearShadowLayer();
            // A bright sweep travels continuously around the full circumference.
            // Connectivity only changes its palette; drag, touch, service and window behavior stay untouched.
            int soft = Color.argb((int)(70 * pulse), Color.red(ringColor), Color.green(ringColor), Color.blue(ringColor));
            int bright = Color.argb((int)(255 * pulse), 255, 238, 190);
            SweepGradient sweep = new SweepGradient(cx, cy,
                new int[] { Color.TRANSPARENT, soft, ringColor, bright, ringColor, soft, Color.TRANSPARENT },
                new float[] { 0f, 0.68f, 0.80f, 0.86f, 0.91f, 0.98f, 1f });
            Matrix sweepRotation = new Matrix();
            float rotation = (SystemClock.uptimeMillis() % 2600L) * (360f / 2600f);
            sweepRotation.setRotate(rotation, cx, cy);
            sweep.setLocalMatrix(sweepRotation);
            paint.setShader(sweep);
            paint.setStrokeCap(Paint.Cap.ROUND);
            paint.setStrokeWidth(dp(2.8f));
            paint.setAlpha(255);
            paint.setShadowLayer(dp(7), 0, 0, ringColor);
            canvas.drawCircle(cx, cy, dp(29.5f), paint);
            paint.clearShadowLayer(); paint.setShader(null); paint.setStyle(Paint.Style.FILL); paint.setAlpha(255);
            paint.setColor(Color.rgb(29, 35, 29)); canvas.drawCircle(cx, cy, dp(26), paint);
            drawLayer(canvas, shadow, dp(4)); drawLayer(canvas, tail, dp(4));
            drawLayer(canvas, body, dp(4)); drawLayer(canvas, head, dp(4));
            postInvalidateDelayed(24);
        }
    }

    @Override public void onDestroy() {
        removeBubble();
        active = false;
        bubbleVisible = false;
        stopForeground(true);
        super.onDestroy();
    }
    @Override public IBinder onBind(Intent intent) { return null; }
}