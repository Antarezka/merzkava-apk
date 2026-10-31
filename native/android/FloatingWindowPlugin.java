package com.antarezka.merzkava;

import android.app.Activity;
import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
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
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.lang.ref.WeakReference;
import java.util.List;

@CapacitorPlugin(name = "FloatingWindow")
public class FloatingWindowPlugin extends Plugin {
    private static final int MODE_WINDOW = 0;
    private static final int MODE_STRIP = 1;
    private static final int MODE_BUBBLE = 2;
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
    private static TextView bubbleView;
    private static TextView stripView;
    private static WindowManager.LayoutParams overlayParams;
    private static int mode = MODE_WINDOW;
    private static int windowWidth;
    private static int windowHeight;
    private static int touchStartX;
    private static int touchStartY;
    private static float touchRawX;
    private static float touchRawY;
    private static boolean dragged;

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
            attachWebViewToFloatingRoot(activity);
            Intent service = new Intent(activity, FloatingKeepAliveService.class);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) activity.startForegroundService(service);
            else activity.startService(service);
            showWindowMode();
            webView.evaluateJavascript("document.body.classList.add('native-floating-mode')", null);
            call.resolve();
            MAIN.postDelayed(() -> {
                Activity current = getActivityRef();
                if (current != null) current.moveTaskToBack(true);
            }, 180);
        } catch (Exception error) {
            call.reject("Could not open Floating Mode: " + error.getMessage());
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

        TextView minimize = control(activity, "—");
        TextView kitty = control(activity, "🐈‍⬛");
        TextView fullscreen = control(activity, "□");
        header.addView(minimize, new LinearLayout.LayoutParams(dp(activity, 34), ViewGroup.LayoutParams.MATCH_PARENT));
        header.addView(kitty, new LinearLayout.LayoutParams(dp(activity, 38), ViewGroup.LayoutParams.MATCH_PARENT));
        header.addView(fullscreen, new LinearLayout.LayoutParams(dp(activity, 34), ViewGroup.LayoutParams.MATCH_PARENT));
        minimize.setOnClickListener(view -> showStripMode());
        kitty.setOnClickListener(view -> showBubbleMode());
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
        windowWidth = Math.min(screenWidth - dp(activity, 20), dp(activity, 420));
        windowHeight = Math.min(screenHeight - dp(activity, 80), dp(activity, 560));
        windowWidth = Math.max(dp(activity, 300), windowWidth);
        windowHeight = Math.max(dp(activity, 320), windowHeight);
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
        if (activity == null || windowManager == null) return;
        removeCurrentOverlay();
        overlayParams = params(activity, width, height);
        currentOverlay = view;
        windowManager.addView(view, overlayParams);
    }

    private static void showWindowMode() {
        Activity activity = getActivityRef();
        if (activity == null || floatingRoot == null) return;
        mode = MODE_WINDOW;
        addOverlay(floatingRoot, windowWidth, windowHeight);
    }

    private static void showStripMode() {
        Activity activity = getActivityRef();
        if (activity == null) return;
        mode = MODE_STRIP;
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
        mode = MODE_BUBBLE;
        if (bubbleView == null) {
            bubbleView = new TextView(activity);
            bubbleView.setText("🐈‍⬛");
            bubbleView.setTextSize(30);
            bubbleView.setGravity(Gravity.CENTER);
            bubbleView.setBackground(background("#263c36", "#d4af37", dp(activity, 40)));
            bubbleView.setElevation(dp(activity, 8));
            bubbleView.setOnTouchListener((view, event) -> {
                if (handleDrag(view, event, false)) {
                    if (event.getAction() == MotionEvent.ACTION_UP && !dragged) showWindowMode();
                    return true;
                }
                return false;
            });
        }
        addOverlay(bubbleView, dp(activity, 64), dp(activity, 64));
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
                dragged = false;
                return true;
            case MotionEvent.ACTION_MOVE:
                int dx = Math.round(event.getRawX() - touchRawX);
                int dy = Math.round(event.getRawY() - touchRawY);
                if (Math.abs(dx) + Math.abs(dy) > dp(activity, 5)) dragged = true;
                if (resize) {
                    int maxWidth = activity.getResources().getDisplayMetrics().widthPixels - dp(activity, 16);
                    int maxHeight = activity.getResources().getDisplayMetrics().heightPixels - dp(activity, 70);
                    windowWidth = Math.max(dp(activity, 300), Math.min(maxWidth, windowWidth + dx));
                    windowHeight = Math.max(dp(activity, 320), Math.min(maxHeight, windowHeight + dy));
                    overlayParams.width = windowWidth;
                    overlayParams.height = windowHeight;
                } else {
                    overlayParams.x = Math.max(0, touchStartX + dx);
                    overlayParams.y = Math.max(0, touchStartY + dy);
                }
                try { windowManager.updateViewLayout(currentOverlay, overlayParams); } catch (Exception ignored) { }
                return true;
            case MotionEvent.ACTION_UP:
                if (!resize && dragged) {
                    activity.getPreferences(Context.MODE_PRIVATE).edit()
                        .putInt("floating_x", overlayParams.x)
                        .putInt("floating_y", overlayParams.y).apply();
                }
                return true;
            case MotionEvent.ACTION_CANCEL:
                return true;
            default:
                return false;
        }
    }

    private static void restoreToActivity() {
        Activity activity = getActivityRef();
        if (activity == null || webView == null || originalParent == null) return;
        MAIN.post(() -> {
            removeCurrentOverlay();
            if (webView.getParent() instanceof ViewGroup) {
                ((ViewGroup) webView.getParent()).removeView(webView);
            }
            int index = Math.max(0, Math.min(originalIndex, originalParent.getChildCount()));
            originalParent.addView(webView, index, originalLayoutParams);
            webView.evaluateJavascript("document.body.classList.remove('native-floating-mode')", null);
            try {
                List<ActivityManager.AppTask> tasks = ((ActivityManager) activity.getSystemService(Context.ACTIVITY_SERVICE)).getAppTasks();
                if (!tasks.isEmpty()) tasks.get(0).moveToFront();
            } catch (Exception ignored) { }
            activity.stopService(new Intent(activity, FloatingKeepAliveService.class));
            mode = MODE_WINDOW;
        });
    }
}
