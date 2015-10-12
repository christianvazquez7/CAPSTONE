package com.nvbyte.kya;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceFragment;

/**
 * Fragment that contains setting controls. These update shared preferences.
 */
public class SettingsFragment extends PreferenceFragment {
    private static final int THRESHOLD_SELECTED = 7;

    @Override
    /**
     * Loads preferences into fragment. These include: vibration controls, mute controls,
     */
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Load the preferences from an XML resource
        addPreferencesFromResource(R.xml.preferences);

    }

    @Override
    /**
     * Method handles when a threshold is selected from the Threshold activity. Result code
     * is THRESHOLD_SELECTED.
     */
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

    }
}
