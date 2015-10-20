package com.nvbyte.kya;

import android.content.Context;
import android.provider.Settings;

/**
 * Created by christianvazquez on 10/20/15.
 */
public class Utils {
    public static String getUserId(Context c) {
        return Settings.Secure.getString(c.getContentResolver(),Settings.Secure.ANDROID_ID);
    }
}
