package com.nvbyte.kya;

import android.app.Activity;
import android.os.Bundle;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.ViewPager;

import java.util.ArrayList;
import java.util.List;

/**
 * Activity that allows user to select the threshold needed for notifications.
 */
public class ThresholdActivity extends Activity {

    private ViewPager mMainContentPager;
    private FragmentPagerAdapter mMainContentAdaper;
    private ArrayList<ThresholdOptionFragment> thresholdOptionFragments;

    @Override
    /**
     * Creates the activity and sets up view pager for threshold selection.
     */
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_threshold);
    }

    /**
     * Builds pager adapter that manages a list of threshold fragments.
     *
     * @return Adapter set to manage list of threshold options.
     */
    private FragmentPagerAdapter buildAdapter() {
        return null;
    }

    /**
     * Creates a list of threshold options for display in viewPager.
     *
     * @return A list of option fragments in incremental order of threshold from 1-9.
     */
    private List<ThresholdOptionFragment> buildThresholdOptions() {
        return null;
    }

}
