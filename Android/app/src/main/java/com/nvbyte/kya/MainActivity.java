package com.nvbyte.kya;

import android.app.Activity;
import android.os.Bundle;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.ViewPager;


/**
 * Activity that is triggered by user opening app from the menu. In it, the user can see the current
 * area of risk and modify settings for the KYA application.
 */
public class MainActivity extends Activity {


    private ViewPager mMainContentPager;
    private FragmentPagerAdapter mMainContentAdapter;
    private CurrentZoneFragment mCurrentZoneFragment;
    private SettingsFragment mSettingsFragment;


    @Override
    /**
     * Creates fragments if they do not exists and adds them to the ViewPager.
     */
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

    }

    @Override
    /**
     * Calls refresh on the current zone fragment to fetch up to date information about location.
     */
    protected void onResume() {
        super.onResume();
    }
}
