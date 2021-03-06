package com.nvbyte.kya;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.Preference;
import android.preference.PreferenceManager;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.github.machinarius.preferencefragment.PreferenceFragment;

/**
 * Fragment that contains setting controls. These update shared preferences.
 */
public class SettingsFragment extends PreferenceFragment {
    private static final int THRESHOLD_SELECTED = 1500;
    private static final String THRESHOLD_PREFERENCE = "THRESHOLD";
    private static final String SELECTED_THRESHOLD = "SELECTED_THRESHOLD";


    @Override
    /**
     * Loads preferences into fragment. These include: vibration controls, mute controls,lower
     * delta notification, and threshold selection.
     */
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Load the preferences from an XML resource
        addPreferencesFromResource(R.xml.preferences);

        Preference pref = (Preference) findPreference("threshold_preference");
        pref.setOnPreferenceClickListener(new Preference.OnPreferenceClickListener() {
            @Override
            public boolean onPreferenceClick(Preference preference) {
                startActivityForResult(preference.getIntent(), THRESHOLD_SELECTED);
                return true;
            }
        });
    }

    @Override
    /**
     * Method handles when a threshold is selected from the Threshold activity. Result code
     * is THRESHOLD_SELECTED.
     */
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        Log.d("TAG","From result with: "+ resultCode);
        if(resultCode == Activity.RESULT_OK) {
            SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
            Log.d("TAG","SELECTED THRESHOLD: "+data.getIntExtra(SELECTED_THRESHOLD,0));
            preferences.edit().putInt(THRESHOLD_PREFERENCE,data.getIntExtra(SELECTED_THRESHOLD,0)).commit();
        }
    }

    @Override
    /**
     * Creates fragment view. Adds padding for circular watch face.
     */
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = super.onCreateView(inflater, container, savedInstanceState);
        view.setBackgroundColor(getResources().getColor(R.color.white));
        float scale = getResources().getDisplayMetrics().density;
        int dpAsPixels = (int) (25*scale + 0.5f);
        int dpAsPixelsleft = (int) (20*scale + 0.5f);
        int dpAsPixelsdown = (int) (10*scale + 0.5f);
        int dpAsPixelsRight = (int) (5*scale + 0.5f);
        view.setPadding(dpAsPixelsleft,dpAsPixels,dpAsPixelsdown,dpAsPixelsRight);
        return view;
    }
}
