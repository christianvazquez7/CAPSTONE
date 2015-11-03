package com.nvbyte.kya;

import android.content.Context;
import android.provider.Settings;

/**
 * List of useful universal functions for the app.
 */
public class Utils {

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
}
