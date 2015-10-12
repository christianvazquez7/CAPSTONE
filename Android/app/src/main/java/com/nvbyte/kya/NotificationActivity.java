package com.nvbyte.kya;

import android.app.Activity;
import android.os.Bundle;
import android.os.Vibrator;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.ViewPager;

import java.util.HashMap;
import java.util.Timer;
import java.util.TimerTask;

/**
 * Activity that notifies user that they are moving in the direction of danger. This includes
 * the display of information about the area they have moved into.
 */
public class NotificationActivity extends Activity {

    private ViewPager mMainContentPager;
    private FragmentPagerAdapter mMainContentAdapter;
    private BaseNotificationFragment mBaseNotificationFragment;
    private StatisticsFragment mStatisticsFragment;
    private static final String RATING = "RATING";
    private static final String CRIME_RATE = "CRIME_RATE";
    private static final String LAST_UPDATED = "LAST_UPDATED";
    private static final HashMap<Integer, Integer> mColorMap = new HashMap<>();
    private Timer mFetchHeartBeatTimer;
    private TimerTask mOnFetchHeartBeatTimer;
    private Vibrator mVibrator;
    private long mNotificationId;

    static {
        // Fill map with color scheme. Key is risk zone classification and value is integer value to
        // color resource.
        // mColorMap.put(1,1233);
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
    }

    /**
     * Builds a base notification fragment from the parameter 'RATING' sent in intent.
     *
     * @return A base notification fragment that displays the zone rating that is being entered.
     */
    private BaseNotificationFragment buildBaseNotificationFragment() {
        return null;
    }

    /**
     * Builds a statistics fragment from the parameters 'CRIME_RATE' and 'LAST_UPDATED'.
     *
     * @return A statistics fragment that displays crime rate of current zone and the date of the
     * last update.
     */
    private StatisticsFragment buildStatisticsFragment() {
        return null;
    }
}
