package dk.oddfellow.slagelse.infotavle;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.json.JSONArray;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MainActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);

        webView.addJavascriptInterface(new LocalImagesBridge(), "AndroidImages");
        webView.setWebViewClient(new WebViewClient());
        webView.setBackgroundColor(0xFF171310);
        webView.loadUrl("file:///android_asset/www/index.html");

        hideSystemUI();
    }

    public class LocalImagesBridge {
        @JavascriptInterface
        public String listDownloadedImages() {
            try {
                File dir = new File(getFilesDir(), "slideshow");
                if (!dir.exists()) return "[]";
                File[] files = dir.listFiles();
                if (files == null) return "[]";

                List<String> names = new ArrayList<>();
                for (File f : files) {
                    if (f.isFile()) {
                        String n = f.getName().toLowerCase();
                        if (n.endsWith(".jpg") || n.endsWith(".jpeg") || n.endsWith(".png")
                                || n.endsWith(".webp") || n.endsWith(".gif") || n.endsWith(".avif")) {
                            names.add("file://" + f.getAbsolutePath());
                        }
                    }
                }
                Collections.sort(names);
                return new JSONArray(names).toString();
            } catch (Exception e) {
                return "[]";
            }
        }

        @JavascriptInterface
        public String getDownloadDir() {
            File dir = new File(getFilesDir(), "slideshow");
            if (!dir.exists()) dir.mkdirs();
            return dir.getAbsolutePath();
        }
    }

    private void hideSystemUI() {
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            | View.SYSTEM_UI_FLAG_FULLSCREEN
            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        );
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) hideSystemUI();
    }

    @Override
    protected void onResume() {
        super.onResume();
        hideSystemUI();
        if (webView != null) webView.onResume();
    }

    @Override
    protected void onPause() {
        if (webView != null) webView.onPause();
        super.onPause();
    }

    @Override
    public void onBackPressed() {
        // Kiosk mode
    }
}
