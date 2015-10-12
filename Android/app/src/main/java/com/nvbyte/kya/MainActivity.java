package com.nvbyte.kya;

import android.app.Activity;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.ViewPager;

import java.util.ArrayList;
import java.util.List;


/**
 * Activity that is triggered by user opening app from the menu. In it, the user can see the current
 * area of risk and modify settings for the KYA application.
 */
public class MainActivity extends FragmentActivity {


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
        setContentView(R.layout.round_activity_main);
        mMainContentPager = (ViewPager) findViewById(R.id.pager);
        mCurrentZoneFragment = new CurrentZoneFragment();
        mSettingsFragment = new SettingsFragment();
        mMainContentAdapter = new FragmentPagerAdapter(getSupportFragmentManager()) {
            @Override
            public Fragment getItem(int position) {
                switch (position) {
                    case 0: return mCurrentZoneFragment;
                    case 1: return mSettingsFragment;
                }
                return null;
            }

            @Override
            public int getCount() {
                return 2;
            }
        };
        mMainContentPager.setAdapter(mMainContentAdapter);
    }

    @Override
    /**
     * Calls refresh on the current zone fragment to fetch up to date information about location.
     */
    protected void onResume() {
        super.onResume();
    }
}
