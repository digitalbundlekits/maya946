package com.miramatka.app;

import android.app.Application;
import com.onesignal.OneSignal;
import com.onesignal.debug.LogLevel;
import com.onesignal.Continue;

public class ApplicationClass extends Application {

    // Replace with your OneSignal App ID
    private static final String ONESIGNAL_APP_ID = "dea056db-3b4a-4333-b209-8c1e3c5776ee";

    @Override
    public void onCreate() {
        super.onCreate();

        // Enable verbose logging for debugging during development
        OneSignal.getDebug().setLogLevel(LogLevel.VERBOSE);

        // Initialize the OneSignal SDK
        OneSignal.initWithContext(this, ONESIGNAL_APP_ID);

        // Request notification permissions for Android 13+ (runtime permissions)
        // This will show the native notification permission prompt
        OneSignal.getNotifications().requestPermission(false, Continue.none());
    }
}
