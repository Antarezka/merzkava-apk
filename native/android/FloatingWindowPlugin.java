package com.antarezka.merzkava;

import android.app.Activity;
import android.app.ActivityManager;
import android.content.Context;
import android.content.pm.PackageManager;
import android.app.NotificationManager;
import android.os.PowerManager;
import android.content.Intent;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PixelFormat;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.webkit.WebView;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.lang.ref.WeakReference;
import java.util.List;

@CapacitorPlugin(name = "FloatingWindow")
public class FloatingWindowPlugin extends Plugin {
    private static final int MODE_FULL_SCREEN = 0;
    private static final int MODE_WINDOW = 1;
    private static final int MODE_STRIP = 2;
    private static final int MODE_BUBBLE = 3;
    private static final Handler MAIN = new Handler(Looper.getMainLooper());

    private static WeakReference<Activity> activityRef;
    private static WebView webView;
    private static ViewGroup originalParent;
    private static ViewGroup.LayoutParams originalLayoutParams;
    private static int originalIndex = -1;
    private static WindowManager windowManager;
    private static View currentOverlay;
    private static LinearLayout floatingRoot;
    private static FrameLayout contentFrame;
    private static View bubbleView;
    private static TextView stripView;
    private static WindowManager.LayoutParams overlayParams;
    private static volatile int mode = MODE_FULL_SCREEN;
    private static boolean transitionInProgress;
    private static int windowWidth;
    private static int windowHeight;
    private static int touchStartX;
    private static int touchStartY;
    private static float touchRawX;
    private static float touchRawY;
    private static boolean dragged;
    private static int resizeStartWidth;
    private static int resizeStartHeight;

    @Override
    public void load() {
        super.load();
        Activity activity = getActivity();
        if (activity != null) {
            activityRef = new WeakReference<>(activity);
            webView = getBridge().getWebView();
            windowManager = (WindowManager) activity.getApplicationContext().getSystemService(Context.WINDOW_SERVICE);
        }
    }

    @PluginMethod
    public void getReadiness(PluginCall call) {
        Context context = getContext();
        JSObject result = new JSObject();
        boolean overlay = Build.VERSION.SDK_INT < Build.VERSION_CODES.M || Settings.canDrawOverlays(context);
        NotificationManager notifications = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        boolean notificationReady = notifications != null && notifications.areNotificationsEnabled();
        if (Build.VERSION.SDK_INT >= 33) {
            notificationReady = notificationReady && context.checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED;
        }
        PowerManager power = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
        boolean batteryReady = Build.VERSION.SDK_INT < Build.VERSION_CODES.M || (power != null && power.isIgnoringBatteryOptimizations(context.getPackageName()));
        result.put("displayOverApps", overlay);
        result.put("notifications", notificationReady);
        result.put("batteryExemption", batteryReady);
        result.put("serviceRunning", isServiceRunning(context) && FloatingKeepAliveService.isActive());
        call.resolve(result);
    }

    private static boolean isServiceRunning(Context context) {
        ActivityManager manager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        if (manager == null) return false;
        for (ActivityManager.RunningServiceInfo info : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (FloatingKeepAliveService.class.getName().equals(info.service.getClassName()) && info.foreground) return true;
        }
        return false;
    }

    @PluginMethod
    public void requestNotifications(PluginCall call) {
        Intent intent = new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
        intent.putExtra(Settings.EXTRA_APP_PACKAGE, getContext().getPackageName());
        getActivity().startActivity(intent);
        call.resolve();
    }

    @PluginMethod
    public void requestBatteryExemption(PluginCall call) {
        Context context = getContext();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            PowerManager power = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
            if (power == null || !power.isIgnoringBatteryOptimizations(context.getPackageName())) {
                Intent intent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS,
                    Uri.parse("package:" + context.getPackageName()));
                try { getActivity().startActivity(intent); }
                catch (Exception error) {
                    Intent fallback = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                        Uri.parse("package:" + context.getPackageName()));
                    getActivity().startActivity(fallback);
                }
            }
        }
        call.resolve();
    }

    @PluginMethod
    public void startService(PluginCall call) {
        try {
            Context context = getContext();
            Intent service = new Intent(context, FloatingKeepAliveService.class);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) context.startForegroundService(service);
            else context.startService(service);
            call.resolve();
        } catch (Exception error) {
            call.reject("Could not start the floating service: " + error.getMessage());
        }
    }

    @PluginMethod
    public void showBubble(PluginCall call) {
        Activity activity = getActivity();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(activity)) {
            call.reject("Display over other apps permission is not enabled.");
            return;
        }
        try {
            activityRef = new WeakReference<>(activity);
            webView = getBridge().getWebView();
            windowManager = (WindowManager) activity.getSystemService(Context.WINDOW_SERVICE);
            Intent service = new Intent(activity, FloatingKeepAliveService.class);
            service.setAction(FloatingKeepAliveService.ACTION_START_BUBBLE);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) activity.startForegroundService(service);
            else activity.startService(service);
            MAIN.postDelayed(() -> {
                if (FloatingKeepAliveService.isBubbleVisible()) {
                    activity.moveTaskToBack(true);
                    call.resolve();
                } else {
                    activity.stopService(new Intent(activity, FloatingKeepAliveService.class));
                    call.reject("Kitty bubble gagal ditampilkan. Periksa izin overlay dan status service.");
                }
            }, 450);
        } catch (Exception error) {
            activity.stopService(new Intent(activity, FloatingKeepAliveService.class));
            call.reject("Could not start the Kitty bubble service: " + error.getMessage());
        }
    }

    @PluginMethod
    public void stop(PluginCall call) {
        Activity activity = getActivity();
        MAIN.post(() -> {
            removeCurrentOverlay();
            if (webView != null && originalParent != null && webView.getParent() != originalParent) {
                if (webView.getParent() instanceof ViewGroup) ((ViewGroup) webView.getParent()).removeView(webView);
                int index = Math.max(0, Math.min(originalIndex, originalParent.getChildCount()));
                originalParent.addView(webView, index, originalLayoutParams);
                webView.evaluateJavascript("document.body.classList.remove('native-floating-mode')", null);
            }
            if (activity != null) activity.stopService(new Intent(activity, FloatingKeepAliveService.class));
            mode = MODE_FULL_SCREEN;
            transitionInProgress = false;
            call.resolve();
        });
    }

    @PluginMethod
    public void checkPermission(PluginCall call) {
        JSObject result = new JSObject();
        result.put("granted", Build.VERSION.SDK_INT < Build.VERSION_CODES.M || Settings.canDrawOverlays(getContext()));
        call.resolve(result);
    }

    @PluginMethod
    public void requestPermission(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(getContext())) {
            Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:" + getContext().getPackageName()));
            getActivity().startActivity(intent);
        }
        call.resolve();
    }

    @PluginMethod
    public void show(PluginCall call) {
        Activity activity = getActivity();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(activity)) {
            call.reject("Display over other apps permission is not enabled.");
            return;
        }
        try {
            activityRef = new WeakReference<>(activity);
            webView = getBridge().getWebView();
            windowManager = (WindowManager) activity.getSystemService(Context.WINDOW_SERVICE);
            Intent service = new Intent(activity, FloatingKeepAliveService.class);
            service.setAction(FloatingKeepAliveService.ACTION_HIDE_BUBBLE);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) activity.startForegroundService(service);
            else activity.startService(service);
            showWindowMode();
            webView.evaluateJavascript("document.body.classList.add('native-floating-mode')", null);
            call.resolve();
        } catch (Exception error) {
            restoreToActivity();
            call.reject("Could not open Floating Mini Window: " + error.getMessage());
        }
    }

    @PluginMethod
    public void restore(PluginCall call) {
        restoreToActivity();
        call.resolve();
    }

    private static Activity getActivityRef() {
        return activityRef == null ? null : activityRef.get();
    }

    private static int dp(Context context, float value) {
        return Math.round(value * context.getResources().getDisplayMetrics().density);
    }

    private static void attachWebViewToFloatingRoot(Activity activity) {
        if (floatingRoot != null && webView != null && webView.getParent() == contentFrame) return;
        if (webView == null) throw new IllegalStateException("The application WebView is unavailable.");

        if (webView.getParent() instanceof ViewGroup) {
            originalParent = (ViewGroup) webView.getParent();
            originalIndex = originalParent.indexOfChild(webView);
            originalLayoutParams = webView.getLayoutParams();
            originalParent.removeView(webView);
        }

        floatingRoot = new LinearLayout(activity);
        floatingRoot.setOrientation(LinearLayout.VERTICAL);
        floatingRoot.setBackground(background("#eee7d6", "#738276", dp(activity, 12)));
        floatingRoot.setClipToOutline(true);

        LinearLayout header = new LinearLayout(activity);
        header.setGravity(Gravity.CENTER_VERTICAL);
        header.setOrientation(LinearLayout.HORIZONTAL);
        header.setPadding(dp(activity, 10), 0, dp(activity, 5), 0);
        header.setBackgroundColor(Color.rgb(38, 60, 54));
        LinearLayout.LayoutParams headerParams = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, dp(activity, 42));
        floatingRoot.addView(header, headerParams);

        TextView title = new TextView(activity);
        title.setText("MERZKAVA  ·  DRAG WINDOW");
        title.setTextColor(Color.rgb(231, 218, 188));
        title.setTextSize(9);
        title.setLetterSpacing(0.12f);
        title.setGravity(Gravity.CENTER_VERTICAL);
        header.addView(title, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, 1));
        title.setOnTouchListener((view, event) -> handleDrag(view, event, false));

        TextView minimize = control(activity, "🐈‍⬛");
        TextView fullscreen = control(activity, "□");
        header.addView(minimize, new LinearLayout.LayoutParams(dp(activity, 42), ViewGroup.LayoutParams.MATCH_PARENT));
        header.addView(fullscreen, new LinearLayout.LayoutParams(dp(activity, 34), ViewGroup.LayoutParams.MATCH_PARENT));
        minimize.setOnClickListener(view -> showBubbleMode());
        fullscreen.setOnClickListener(view -> restoreToActivity());

        contentFrame = new FrameLayout(activity);
        contentFrame.setBackgroundColor(Color.rgb(238, 231, 214));
        floatingRoot.addView(contentFrame, new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, 0, 1));
        contentFrame.addView(webView, new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        TextView resize = new TextView(activity);
        resize.setText("◢");
        resize.setTextColor(Color.rgb(67, 82, 70));
        resize.setTextSize(19);
        resize.setGravity(Gravity.CENTER);
        resize.setBackgroundColor(Color.rgb(217, 200, 158));
        FrameLayout.LayoutParams resizeParams = new FrameLayout.LayoutParams(
            dp(activity, 36), dp(activity, 36), Gravity.END | Gravity.BOTTOM);
        contentFrame.addView(resize, resizeParams);
        resize.setOnTouchListener((view, event) -> handleDrag(view, event, true));

        int screenWidth = activity.getResources().getDisplayMetrics().widthPixels;
        int screenHeight = activity.getResources().getDisplayMetrics().heightPixels;
        int defaultWidth = Math.min(Math.max(dp(activity, 240), screenWidth - dp(activity, 20)), dp(activity, 420));
        int defaultHeight = Math.min(Math.max(dp(activity, 260), screenHeight - dp(activity, 80)), dp(activity, 560));
        windowWidth = activity.getPreferences(Context.MODE_PRIVATE).getInt("floating_width", defaultWidth);
        windowHeight = activity.getPreferences(Context.MODE_PRIVATE).getInt("floating_height", defaultHeight);
    }

    private static GradientDrawable background(String fill, String stroke, int radius) {
        GradientDrawable drawable = new GradientDrawable();
        drawable.setColor(Color.parseColor(fill));
        drawable.setCornerRadius(radius);
        drawable.setStroke(1, Color.parseColor(stroke));
        return drawable;
    }

    private static TextView control(Activity activity, String label) {
        TextView view = new TextView(activity);
        view.setText(label);
        view.setTextColor(Color.rgb(232, 225, 207));
        view.setTextSize(18);
        view.setGravity(Gravity.CENTER);
        view.setBackgroundColor(Color.TRANSPARENT);
        view.setClickable(true);
        return view;
    }

    private static WindowManager.LayoutParams params(Activity activity, int width, int height) {
        int type = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
            ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            : WindowManager.LayoutParams.TYPE_PHONE;
        WindowManager.LayoutParams result = new WindowManager.LayoutParams(
            width, height, type,
            WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN |
                WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
            PixelFormat.TRANSLUCENT);
        result.gravity = Gravity.TOP | Gravity.START;
        result.softInputMode = WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE;
        result.x = activity.getPreferences(Context.MODE_PRIVATE).getInt("floating_x", dp(activity, 8));
        result.y = activity.getPreferences(Context.MODE_PRIVATE).getInt("floating_y", dp(activity, 90));
        return result;
    }

    private static void removeCurrentOverlay() {
        if (currentOverlay != null && currentOverlay.getParent() != null && windowManager != null) {
            try { windowManager.removeViewImmediate(currentOverlay); } catch (Exception ignored) { }
        }
        currentOverlay = null;
        overlayParams = null;
    }

    private static void addOverlay(View view, int width, int height) {
        Activity activity = getActivityRef();
        if (activity == null || windowManager == null) {
            throw new IllegalStateException("Floating overlay host is unavailable.");
        }
        removeCurrentOverlay();
        WindowManager.LayoutParams nextParams = params(activity, width, height);
        windowManager.addView(view, nextParams);
        overlayParams = nextParams;
        currentOverlay = view;
    }

    private static void showWindowMode() {
        Activity activity = getActivityRef();
        if (activity == null || activity.isFinishing() || webView == null) return;
        if (transitionInProgress) return;
        if (currentOverlay == floatingRoot && floatingRoot != null && floatingRoot.getParent() != null) return;
        transitionInProgress = true;
        try {
            Intent hideBubble = new Intent(activity, FloatingKeepAliveService.class);
            hideBubble.setAction(FloatingKeepAliveService.ACTION_HIDE_BUBBLE);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) activity.startForegroundService(hideBubble);
            else activity.startService(hideBubble);
            if (floatingRoot == null || webView.getParent() != contentFrame) attachWebViewToFloatingRoot(activity);
            mode = MODE_WINDOW;
            addOverlay(floatingRoot, windowWidth, windowHeight);
            MAIN.post(() -> {
                if (activity.isFinishing()) { restoreToActivity(); return; }
                if (currentOverlay == floatingRoot && floatingRoot != null && floatingRoot.getParent() != null) {
                    transitionInProgress = false;
                    activity.moveTaskToBack(true);
                } else {
                    transitionInProgress = false;
                    restoreToActivity();
                }
            });
        } catch (Exception error) {
            android.util.Log.e("MerzkavaFloating", "Could not attach floating mini window", error);
            transitionInProgress = false;
            restoreToActivity();
        }
    }

    private static void showStripMode() {
        Activity activity = getActivityRef();
        if (activity == null) return;
        mode = MODE_STRIP;
        transitionInProgress = false;
        if (stripView == null) {
            stripView = new TextView(activity);
            stripView.setText("MERZKAVA  ·  TAP TO RESTORE");
            stripView.setTextColor(Color.rgb(238, 231, 214));
            stripView.setTextSize(9);
            stripView.setGravity(Gravity.CENTER);
            stripView.setPadding(dp(activity, 16), 0, dp(activity, 16), 0);
            stripView.setBackground(background("#263c36", "#b49b68", dp(activity, 18)));
            stripView.setOnTouchListener((view, event) -> {
                if (handleDrag(view, event, false)) {
                    if (event.getAction() == MotionEvent.ACTION_UP && !dragged) showWindowMode();
                    return true;
                }
                return false;
            });
        }
        addOverlay(stripView, dp(activity, 230), dp(activity, 40));
    }

    private static void showBubbleMode() {
        Activity activity = getActivityRef();
        if (activity == null) return;
        try {
            removeCurrentOverlay();
            if (webView != null && originalParent != null && webView.getParent() != originalParent) {
                if (webView.getParent() instanceof ViewGroup) ((ViewGroup) webView.getParent()).removeView(webView);
                int index = Math.max(0, Math.min(originalIndex, originalParent.getChildCount()));
                originalParent.addView(webView, index, originalLayoutParams);
                webView.evaluateJavascript("document.body.classList.remove('native-floating-mode')", null);
            }
            Intent service = new Intent(activity, FloatingKeepAliveService.class);
            service.setAction(FloatingKeepAliveService.ACTION_START_BUBBLE);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) activity.startForegroundService(service);
            else activity.startService(service);
            mode = MODE_BUBBLE;
            transitionInProgress = false;
            MAIN.postDelayed(() -> {
                if (FloatingKeepAliveService.isBubbleVisible()) {
                    activity.moveTaskToBack(true);
                } else {
                    android.util.Log.e("MerzkavaFloating", "Kitty bubble was not attached; restoring the app to the foreground.");
                    try {
                        List<ActivityManager.AppTask> tasks = ((ActivityManager) activity.getSystemService(Context.ACTIVITY_SERVICE)).getAppTasks();
                        if (!tasks.isEmpty()) tasks.get(0).moveToFront();
                    } catch (Exception ignored) { }
                    activity.stopService(new Intent(activity, FloatingKeepAliveService.class));
                    mode = MODE_FULL_SCREEN;
                    transitionInProgress = false;
                }
            }, 450);
        } catch (Exception error) {
            android.util.Log.e("MerzkavaFloating", "Could not minimize to Kitty bubble", error);
            restoreToActivity();
        }
    }

    private static boolean handleDrag(View view, MotionEvent event, boolean resize) {
        Activity activity = getActivityRef();
        if (activity == null || overlayParams == null || currentOverlay == null) return false;
        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                touchStartX = overlayParams.x;
                touchStartY = overlayParams.y;
                touchRawX = event.getRawX();
                touchRawY = event.getRawY();
                resizeStartWidth = windowWidth;
                resizeStartHeight = windowHeight;
                dragged = false;
                return true;
            case MotionEvent.ACTION_MOVE:
                int dx = Math.round(event.getRawX() - touchRawX);
                int dy = Math.round(event.getRawY() - touchRawY);
                if (Math.abs(dx) + Math.abs(dy) > dp(activity, 5)) dragged = true;
                if (resize) {
                    int maxWidth = activity.getResources().getDisplayMetrics().widthPixels - dp(activity, 16);
                    int maxHeight = activity.getResources().getDisplayMetrics().heightPixels - dp(activity, 70);
                    windowWidth = Math.max(dp(activity, 240), Math.min(maxWidth, resizeStartWidth + dx));
                    windowHeight = Math.max(dp(activity, 260), Math.min(maxHeight, resizeStartHeight + dy));
                    overlayParams.width = windowWidth;
                    overlayParams.height = windowHeight;
                } else {
                    overlayParams.x = Math.max(0, touchStartX + dx);
                    overlayParams.y = Math.max(0, touchStartY + dy);
                }
                try { windowManager.updateViewLayout(currentOverlay, overlayParams); } catch (Exception ignored) { }
                return true;
            case MotionEvent.ACTION_UP:
                if (dragged) {
                    android.content.SharedPreferences.Editor editor = activity.getPreferences(Context.MODE_PRIVATE).edit();
                    if (resize) editor.putInt("floating_width", windowWidth).putInt("floating_height", windowHeight);
                    else editor.putInt("floating_x", overlayParams.x).putInt("floating_y", overlayParams.y);
                    editor.apply();
                }
                return true;
            case MotionEvent.ACTION_CANCEL:
                return true;
            default:
                return false;
        }
    }


    private static class KittyBubbleView extends View {
        private final Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        private final Path head = new Path();

        KittyBubbleView(Context context) { super(context); }

        @Override
        protected void onDraw(Canvas canvas) {
            super.onDraw(canvas);
            float cx = getWidth() / 2f;
            float cy = getHeight() / 2f;
            float unit = Math.min(getWidth(), getHeight()) * 0.39f;

            head.reset();
            head.moveTo(cx - unit * 0.72f, cy - unit * 0.02f);
            head.lineTo(cx - unit * 0.82f, cy - unit * 0.92f);
            head.lineTo(cx - unit * 0.22f, cy - unit * 0.52f);
            head.quadTo(cx, cy - unit * 0.66f, cx + unit * 0.22f, cy - unit * 0.52f);
            head.lineTo(cx + unit * 0.82f, cy - unit * 0.92f);
            head.lineTo(cx + unit * 0.72f, cy - unit * 0.02f);
            head.quadTo(cx + unit * 0.62f, cy + unit * 0.78f, cx, cy + unit * 0.78f);
            head.quadTo(cx - unit * 0.62f, cy + unit * 0.78f, cx - unit * 0.72f, cy - unit * 0.02f);
            head.close();

            paint.setColor(Color.rgb(10, 12, 11));
            paint.setStyle(Paint.Style.FILL);
            canvas.drawPath(head, paint);

            paint.setColor(Color.rgb(212, 175, 55));
            canvas.drawOval(cx - unit * 0.43f, cy + unit * 0.02f, cx - unit * 0.12f, cy + unit * 0.28f, paint);
            canvas.drawOval(cx + unit * 0.12f, cy + unit * 0.02f, cx + unit * 0.43f, cy + unit * 0.28f, paint);

            paint.setColor(Color.rgb(24, 27, 23));
            canvas.drawCircle(cx - unit * 0.275f, cy + unit * 0.15f, unit * 0.065f, paint);
            canvas.drawCircle(cx + unit * 0.275f, cy + unit * 0.15f, unit * 0.065f, paint);
        }
    }

    public static void onBubbleTapped(Activity activity) {
        if (activity == null || activity.isFinishing()) return;
        activityRef = new WeakReference<>(activity);
        windowManager = (WindowManager) activity.getApplicationContext().getSystemService(Context.WINDOW_SERVICE);
        // Refresh the Bridge WebView from the resumed host instead of trusting a
        // possibly stale static reference after Android recreates MainActivity.
        if (activity instanceof BridgeActivity) {
            WebView resumedWebView = ((BridgeActivity) activity).getBridge().getWebView();
            if (resumedWebView != null) webView = resumedWebView;
        }
        if (webView == null) {
            android.util.Log.e("MerzkavaFloating", "Cannot open mini window: Capacitor WebView is unavailable.");
            return;
        }
        MAIN.post(() -> {
            if (activity.isFinishing()) return;
            showWindowMode();
        });
    }

    public static void restoreForForeground() {
        restoreToActivity();
    }

    private static void restoreToActivity() {
        Activity activity = getActivityRef();
        if (activity == null) return;
        MAIN.post(() -> {
            removeCurrentOverlay();
            if (webView != null && originalParent != null && webView.getParent() != originalParent) {
                if (webView.getParent() instanceof ViewGroup) {
                    ((ViewGroup) webView.getParent()).removeView(webView);
                }
                int index = Math.max(0, Math.min(originalIndex, originalParent.getChildCount()));
                originalParent.addView(webView, index, originalLayoutParams);
                webView.evaluateJavascript("document.body.classList.remove('native-floating-mode')", null);
            }
            try {
                List<ActivityManager.AppTask> tasks = ((ActivityManager) activity.getSystemService(Context.ACTIVITY_SERVICE)).getAppTasks();
                if (!tasks.isEmpty()) tasks.get(0).moveToFront();
            } catch (Exception ignored) { }
            activity.stopService(new Intent(activity, FloatingKeepAliveService.class));
            mode = MODE_FULL_SCREEN;
            transitionInProgress = false;
        });
    }
}
