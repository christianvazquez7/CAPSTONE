package com.nvbyte.kya;

import android.content.Context;
import android.os.PowerManager;
import android.provider.Settings;

/**
 * List of useful universal functions for the app.
 */
public class Utils {

    private static PowerManager.WakeLock wakeLock;

    /**
     * Private constructor to avoid instantiation.
     */
    private Utils() {};

    /**
     * Get the user Id for this specific device.
     * @param c The application context.
     * @return A string that consists of the Android Id. This string is unique per device.
     */
    public static String getUserId(Context c) {
        return Settings.Secure.getString(c.getContentResolver(),Settings.Secure.ANDROID_ID);
    }

    public static void acquire(Context context) {
        if (wakeLock != null) wakeLock.release();
        PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
        wakeLock = pm.newWakeLock(PowerManager.FULL_WAKE_LOCK |
                PowerManager.ACQUIRE_CAUSES_WAKEUP |
                PowerManager.ON_AFTER_RELEASE, "WakeLock");
        wakeLock.acquire();
    }

    public static void release(Context context) {
        if (wakeLock != null) {wakeLock.release(); wakeLock = null;}
    }

    public static int getColorByLevel(int level) {
        switch (level) {
            case 1: return R.color.level1;
            case 2: return R.color.level2;
            case 3: return R.color.level3;
            case 4: return R.color.level4;
            case 5: return R.color.level5;
            case 6: return R.color.level6;
            case 7: return R.color.level7;
            case 8: return R.color.level8;
            case 9: return R.color.level9;
            case 10: return R.color.level10;
            default: return R.color.level1;
        }
    }

    public static int getAlphaColorByLevel(int level) {
        switch (level) {
            case 1: return R.color.level1transluscent;
            case 2: return R.color.level2transluscent;
            case 3: return R.color.level3transluscent;
            case 4: return R.color.level4transluscent;
            case 5: return R.color.level5transluscent;
            case 6: return R.color.level6transluscent;
            case 7: return R.color.level7transluscent;
            case 8: return R.color.level8transluscent;
            case 9: return R.color.level9transluscent;
            case 10: return R.color.level10transluscent;
            default: return R.color.level1transluscent;
        }
    }
}
