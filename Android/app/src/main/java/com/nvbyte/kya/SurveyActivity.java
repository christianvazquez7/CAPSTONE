package com.nvbyte.kya;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Vibrator;
import android.preference.PreferenceManager;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.ViewPager;
import android.util.Log;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.ProgressBar;

import com.viewpagerindicator.UnderlinePageIndicator;

import java.util.ArrayList;
import java.util.Timer;
import java.util.TimerTask;

/**
 * Activity launched to collect information about user's perception on a particular area.
 */
public class SurveyActivity extends FragmentActivity {

    private ViewPager mMainContentPager;
    private FragmentPagerAdapter mMainContentAdapter;
    private ArrayList<SurveyOptionFragment> mSurveyOptions;
    private static final int NUM_OF_OPTIONS = 10;
    private static final long TIMEOUT = 10000;
    private Timer mInteractionTimer;
    private ProgressBar mTimeout;
    private final static String NOTIFICATION_ID_EXTRA = "NOTIFICATION_ID";
    private final static String SELECTED_EXTRA = "SELECTED_ID";

    private static final String RATING = "RATING";
    private static final String CRIME_RATE = "CRIME_RATE";
    private static final String LAST_UPDATED = "LAST_UPDATED";
    private static final String EXTRA_ID = "NOTIFICATION_ID";
    private static final int VIBRATION_PERIOD = 1000;

    private int timeLeft = 10000;
    private Timer tick;

    @Override
    /**
     * Creates view pager and adapter.
     */
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_survey);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        if(preferences.getBoolean("vibrate_preference",true)) {
            Vibrator mVibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
            mVibrator.vibrate(VIBRATION_PERIOD);
        }
        mMainContentPager = fetchViewPager();
        mMainContentAdapter = buildAdapter();
        mSurveyOptions = buildOptions();
        mTimeout = (ProgressBar) findViewById(R.id.progress);
        mTimeout.setMax(100);
        mTimeout.setProgress(100);
        mTimeout.setIndeterminate(false);
        mMainContentPager.setAdapter(mMainContentAdapter);
        GestureDetector.SimpleOnGestureListener listener = new GestureDetector.SimpleOnGestureListener(){
            @Override
            public boolean onSingleTapConfirmed(MotionEvent e) {

                String notificationID = getIntent().getExtras().getString(NOTIFICATION_ID_EXTRA);
                int selectedThreshold = mSurveyOptions.get(mMainContentPager.getCurrentItem()).getSafetyRating();
                Intent intent = new Intent();
                intent.setAction("com.nvbyte.kya.SEND_SURVEY");
                intent.putExtra(NOTIFICATION_ID_EXTRA, notificationID);
                intent.putExtra(SELECTED_EXTRA, selectedThreshold);
                intent = cascadeExtras(intent);
                sendBroadcast(intent);
                finish();
                return false;
            }
        };

        final GestureDetector detector = new GestureDetector(SurveyActivity.this,listener);

        mMainContentPager.setOnTouchListener(new View.OnTouchListener() {
            public boolean onTouch(View v, MotionEvent event) {
                Log.d("TAG","TAP");
                mInteractionTimer.cancel();
                tick.cancel();
                mTimeout.setVisibility(View.GONE);
                UnderlinePageIndicator mUnderlinePageIndicator = (UnderlinePageIndicator) findViewById(R.id.indicator);
                mUnderlinePageIndicator.setViewPager(mMainContentPager);
                mUnderlinePageIndicator.setFades(false);
                mUnderlinePageIndicator.setVisibility(View.VISIBLE);
                detector.onTouchEvent(event);
                return false;
            }
        });

        mInteractionTimer = new Timer();
        mInteractionTimer.schedule(buildTimeoutTask(), TIMEOUT);

        tick = new Timer();
        tick.schedule(new TimerTask() {
            @Override
            public void run() {
                timeLeft = timeLeft - 10;
                int prog = (int)((timeLeft/10000.0)*100);
                Log.d("HERE",""+prog);

                mTimeout.setProgress(prog);
            }
        },0,10);
    }

    /**
     * Fetches view pager from xml.
     *
     * @return View pager instantiated from the xml view activity_survey.
     */
    private ViewPager fetchViewPager() {
        return (ViewPager) findViewById(R.id.view_pager);
    }

    /**
     * Create a new FragmentPagerAdapter to
     *
     * @return
     */
    private FragmentPagerAdapter buildAdapter() {
        return new FragmentPagerAdapter(getSupportFragmentManager()) {
            @Override
            public Fragment getItem(int position) {
                return mSurveyOptions.get(position);
            }
            @Override
            public int getCount() {
                return NUM_OF_OPTIONS;
            }
        };
    }

    private ArrayList<SurveyOptionFragment> buildOptions() {
        ArrayList<SurveyOptionFragment> options = new ArrayList<>();
        for(int i =0 ; i<NUM_OF_OPTIONS; i++) {
            options.add(SurveyOptionFragment.forRating(i + 1));
        }
        return options;
    }

    private TimerTask buildTimeoutTask() {
        return new TimerTask() {
            @Override
            public void run() {
                tick.cancel();
                finish();
            }
        };
    }

    private Intent cascadeExtras(Intent intent) {
        intent.putExtra(EXTRA_ID,this.getIntent().getExtras().getString(EXTRA_ID));
        intent.putExtra(RATING, this.getIntent().getExtras().getInt(RATING));
        intent.putExtra(CRIME_RATE,this.getIntent().getExtras().getDouble(CRIME_RATE));
        intent.putExtra(LAST_UPDATED,this.getIntent().getExtras().getString(LAST_UPDATED));
        return intent;
    }

    @Override
    protected void onPause() {
        super.onPause();
        Intent intent = new Intent();
        intent.setAction("com.nvbyte.kya.SURVEY_CANCELED");
        intent = cascadeExtras(intent);
        sendBroadcast(intent);
    }
}
