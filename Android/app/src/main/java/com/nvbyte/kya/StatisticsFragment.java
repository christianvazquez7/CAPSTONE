package com.nvbyte.kya;


import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

/**
 * Fragment that displays statistics information about an area inside a NotificationActivity.
 */
public class StatisticsFragment extends Fragment {
    private View mBackgroundView;
    private TextView mCrimeRateTextView;
    private TextView mDateTextView;
    public static final String CRIME_PARAM = "CRIME";
    public static final String CLASS_PARAM = "CLASS";
    public static final String DATE_PARAM = "DATE";
    public static final String BACKGROUND_COLOR_PARAM = "COLOR";


    /**
     * Creates a statistic fragment for a specific zone from a server response.
     * @param crimeRate Crime rate associated with this zone.
     * @param classification Classification for the zone (between 1-10).
     * @param date Date for la update of this zone.
     * @param color Resource id for this level's color.
     * @return A Statistics fragment with all the parameters bundled in arguments CRIME_PARAM,
     * CLASS_PARAM , and DATE_PARAM.
     */
    public static StatisticsFragment buildStatisticsFragment(double crimeRate, int classification, String date, int color) {
        Bundle args = new Bundle();
        args.putDouble(CRIME_PARAM, crimeRate);
        args.putInt(CLASS_PARAM,classification);
        args.putInt(BACKGROUND_COLOR_PARAM,color);
        args.putString(DATE_PARAM, date);
        StatisticsFragment fragment = new StatisticsFragment();
        fragment.setArguments(args);
        return fragment;
    }

    @Nullable
    @Override
    /**
     * Creates the view for the statistics fragment. Changes background, crime rate, and date
     * according to bundled parameters.
     */
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_statistics, container, false);
        mBackgroundView = rootView.findViewById(R.id.background);
        mCrimeRateTextView = (TextView) rootView.findViewById(R.id.crime_rate);
        mDateTextView = (TextView) rootView.findViewById(R.id.date);
        mBackgroundView.setBackgroundColor(getResources().getColor(getArguments().getInt(BACKGROUND_COLOR_PARAM)));
        mCrimeRateTextView.setText(getArguments().getDouble(CRIME_PARAM)+"");
        mDateTextView.setText(getArguments().getString(DATE_PARAM));
        return rootView;
    }
}
