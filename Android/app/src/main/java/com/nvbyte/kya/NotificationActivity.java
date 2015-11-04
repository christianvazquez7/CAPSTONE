package com.nvbyte.kya;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Vibrator;
import android.preference.PreferenceManager;
import android.provider.Settings;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.ViewPager;
import android.view.WindowManager;

import java.util.HashMap;
import java.util.Timer;
import java.util.TimerTask;

/**
 * Activity that notifies user that they are moving in the direction of danger. This includes
 * the display of information about the area they have moved into. The color of the background is
 * associated with the risk classification.
 */
public class NotificationActivity extends FragmentActivity {

    private ViewPager mMainContentPager;
    private FragmentPagerAdapter mMainContentAdapter;
    private static final String RATING = "RATING";
    private static final String CRIME_RATE = "CRIME_RATE";
    private static final String LAST_UPDATED = "LAST_UPDATED";
    private static final String EXTRA_ID = "NOTIFICATION_ID";
    private static final HashMap<Integer, Integer> mColorMap = new HashMap<>();
    private Vibrator mVibrator;
    private String mNotificationId;
    private static final int VIBRATION_PERIOD = 1000;

    static {
        mColorMap.put(1,R.color.level1);
        mColorMap.put(2,R.color.level2);
        mColorMap.put(3,R.color.level3);
        mColorMap.put(4,R.color.level4);
        mColorMap.put(5,R.color.level5);
        mColorMap.put(6,R.color.level6);
        mColorMap.put(7,R.color.level7);
        mColorMap.put(8,R.color.level8);
        mColorMap.put(9,R.color.level9);
        mColorMap.put(10,R.color.level10);
    }

    @Override
    /**
     * Activity that launches when a threshold or positive delta condition is met. This activity
     * creates two fragments (base notification & statistics) from information that is passed
     * as a bundle by the KYANotificationService.
     */
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_notification);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        String userId  = Settings.Secure.getString(this.getContentResolver(),Settings.Secure.ANDROID_ID);
        mNotificationId = userId + System.currentTimeMillis();
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        if(preferences.getBoolean("vibrate_preference",true)) {
            mVibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
            mVibrator.vibrate(VIBRATION_PERIOD);
        }
        final boolean isHigher = getIntent().getExtras().getBoolean("HIGHER");

        if(isHigher) {
            Intent captureBeat = new Intent();
            captureBeat.setAction("com.nvbyte.kya.SEND_AFTER_BEAT");
            captureBeat.putExtra(EXTRA_ID, mNotificationId);
            sendBroadcast(captureBeat);
        }

        mMainContentPager = (ViewPager) findViewById(R.id.view_pager);
        final int classification = getIntent().getExtras().getInt(RATING);
        final double crimeRate = getIntent().getExtras().getDouble(CRIME_RATE);
        final int color = mColorMap.get(classification);
        final String date = getIntent().getExtras().getString(LAST_UPDATED);
        mMainContentAdapter = new FragmentPagerAdapter(getSupportFragmentManager()) {
            @Override
            public Fragment getItem(int position) {
                switch (position) {
                    case 0: return BaseNotificationFragment.build(classification,color,isHigher);
                    case 1: return StatisticsFragment.buildStatisticsFragment(crimeRate,classification,date,color);
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
    protected void onDestroy() {
        Utils.release(this);
        super.onDestroy();
    }
}
