package com.nvbyte.kya;

import android.app.Activity;
import android.os.Bundle;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.ViewPager;

import java.util.ArrayList;
import java.util.Timer;
import java.util.TimerTask;

/**
 * Activity launched to collect information about user's perception on a particular area.
 */
public class SurveyActivity extends Activity {

    private ViewPager mMainContentPager;
    private FragmentPagerAdapter mMainContentAdapter;
    private ArrayList<ThresholdOptionFragment> mSurveyOptions;
    private Timer interactionTimer;
    private TimerTask onInteractionTimeout;

    @Override
    /**
     * Creates view pager and adapter.
     */
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_survey);
    }

    /**
     * Fetches view pager from xml.
     *
     * @return View pager instantiated from the xml view activity_survey.
     */
    private ViewPager fetchViewPager() {
        return null;
    }

    /**
     * Create a new FragmentPagerAdapter to
     *
     * @return
     */
    private FragmentPagerAdapter buildAdapter() {
        return null;
    }

    private void scheduleTimeout (long timeInSeconds) {

    }


}
