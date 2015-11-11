package com.nvbyte.kya;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.ViewPager;
import android.util.Log;
import android.view.GestureDetector;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;

import com.viewpagerindicator.TitlePageIndicator;
import com.viewpagerindicator.UnderlinePageIndicator;

import java.util.ArrayList;
import java.util.List;

/**
 * Activity that allows user to select the threshold needed for notifications.
 */
public class ThresholdActivity extends FragmentActivity {

    private ViewPager mMainContentPager;
    private FragmentPagerAdapter mMainContentAdaper;
    private ArrayList<ThresholdOptionFragment> thresholdOptionFragments;
    private UnderlinePageIndicator mUnderlinePageIndicator;
    private static final int NUM_OF_OPTIONS = 10;
    private static final String THRESHOLD_PREFERENCE = "THRESHOLD";
    private static final int DEFAULT_THRESHOLD = 1;
    private int mSelectedThreshold;
    private static final String SELECTED_THRESHOLD = "SELECTED_THRESHOLD";
    private GestureDetector detector;

    @Override
    /**
     * Creates the activity and sets up view pager for threshold selection. The gesture detector is
     * also initialized to detect TAP gestures on the view pager. When a tap is detected, the
     * currently displayed fragment is queried to determine the threshold level detected. This level
     * is then returned to the MainActivity as a result.
     */
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_threshold);
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(this);
        mSelectedThreshold = prefs.getInt(THRESHOLD_PREFERENCE,DEFAULT_THRESHOLD);
        thresholdOptionFragments = buildThresholdOptions();
        mMainContentPager = (ViewPager) findViewById(R.id.view_pager);
        mMainContentAdaper = buildAdapter();
        GestureDetector.SimpleOnGestureListener listener = new GestureDetector.SimpleOnGestureListener(){
            @Override
            public boolean onSingleTapConfirmed(MotionEvent e) {
                // Your Code here
                Log.d("TAG","TAP Detected");
                Intent resultIntent = new Intent();
                int selectedThreshold = thresholdOptionFragments.get(mMainContentPager.getCurrentItem()).getThreshold();
                resultIntent.putExtra(SELECTED_THRESHOLD,selectedThreshold);
                setResult(RESULT_OK,resultIntent);
                ThresholdActivity.this.finish();
                return false;
            }
        };

        detector = new GestureDetector(ThresholdActivity.this,listener);

        mMainContentPager.setOnTouchListener(new View.OnTouchListener() {
            public boolean onTouch(View v, MotionEvent event) {
                Log.d("TAG","TAP");
                detector.onTouchEvent(event);
                return false;
            }
        });

        mMainContentPager.setAdapter(mMainContentAdaper);
        mUnderlinePageIndicator = (UnderlinePageIndicator) findViewById(R.id.indicator);
        mUnderlinePageIndicator.setViewPager(mMainContentPager);
        mUnderlinePageIndicator.setFades(false);
    }

    /**
     * Builds pager adapter that manages a list of threshold fragments.
     * @return Adapter set to manage list of threshold options.
     */
    private FragmentPagerAdapter buildAdapter() {
        return new FragmentPagerAdapter(getSupportFragmentManager()) {
            @Override
            public Fragment getItem(int position) {
                return thresholdOptionFragments.get(position);
            }
            @Override
            public int getCount() {
                return NUM_OF_OPTIONS;
            }
        };
    }

    /**
     * Creates a list of threshold options for display in viewPager.
     * @return A list of option fragments in incremental order of threshold from 1-9.
     */
    private ArrayList<ThresholdOptionFragment> buildThresholdOptions() {
        ArrayList<ThresholdOptionFragment> options = new ArrayList<>();
        for (int i = 0; i<NUM_OF_OPTIONS; i++) {
            boolean isSelected = ((i+1) == mSelectedThreshold);
            options.add(ThresholdOptionFragment.forThreshold(i+1,isSelected));
        }
        return options;
    }

}
