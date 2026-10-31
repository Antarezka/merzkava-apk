package com.antarezka.merzkava;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.IBinder;
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
    private WindowManager windowManager;
    private KittyBubbleView bubble;
    private WindowManager.LayoutParams bubbleParams;
    private float downX, downY;
    private int startX, startY;
    private boolean moved;

    public static boolean isActive() { return active; }

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
            stopSelf();
        }
        return START_NOT_STICKY;
    }

    private void showBubble() {
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
    }

    private void openFloatingWindow() {
        Intent launch = getPackageManager().getLaunchIntentForPackage(getPackageName());
        if (launch == null) return;
        launch.setAction(ACTION_OPEN_WINDOW);
        launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        startActivity(launch);
    }

    private void removeBubble() {
        if (bubble != null && bubble.getParent() != null && windowManager != null) {
            try { windowManager.removeViewImmediate(bubble); } catch (Exception ignored) { }
        }
        bubble = null;
        bubbleParams = null;
    }

    private int dp(float value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private final class KittyBubbleView extends View {
        private final Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        private final Path head = new Path();
        KittyBubbleView() { super(FloatingKeepAliveService.this); setLayerType(View.LAYER_TYPE_SOFTWARE, null); }
        @Override protected void onDraw(Canvas canvas) {
            super.onDraw(canvas);
            float cx = getWidth()/2f, cy = getHeight()/2f, u = Math.min(getWidth(), getHeight())*.39f;
            paint.setColor(Color.rgb(38,60,54)); canvas.drawCircle(cx,cy,Math.min(cx,cy),paint);
            head.reset(); head.moveTo(cx-u*.72f,cy-u*.02f); head.lineTo(cx-u*.82f,cy-u*.92f);
            head.lineTo(cx-u*.22f,cy-u*.52f); head.quadTo(cx,cy-u*.66f,cx+u*.22f,cy-u*.52f);
            head.lineTo(cx+u*.82f,cy-u*.92f); head.lineTo(cx+u*.72f,cy-u*.02f);
            head.quadTo(cx+u*.62f,cy+u*.78f,cx,cy+u*.78f); head.quadTo(cx-u*.62f,cy+u*.78f,cx-u*.72f,cy-u*.02f); head.close();
            paint.setColor(Color.rgb(10,12,11)); canvas.drawPath(head,paint);
            paint.setColor(Color.rgb(212,175,55));
            canvas.drawOval(cx-u*.43f,cy+u*.02f,cx-u*.12f,cy+u*.28f,paint);
            canvas.drawOval(cx+u*.12f,cy+u*.02f,cx+u*.43f,cy+u*.28f,paint);
            paint.setColor(Color.rgb(24,27,23));
            canvas.drawCircle(cx-u*.275f,cy+u*.15f,u*.065f,paint);
            canvas.drawCircle(cx+u*.275f,cy+u*.15f,u*.065f,paint);
        }
    }

    @Override public void onDestroy() {
        removeBubble();
        active = false;
        stopForeground(true);
        super.onDestroy();
    }
    @Override public IBinder onBind(Intent intent) { return null; }
}