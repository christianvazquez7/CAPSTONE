package com.nvbyte.kya;

import android.app.Fragment;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

/**
 * Contains and present information about a option to select for threshold. These options
 * are from 1 - 10 where 1 is the safest zone and 10 is a very dangerous zone.
 */
public class ThresholdOptionFragment extends android.support.v4.app.Fragment {

    private TextView mThresholdTextView;
    private TextView mSelectedView;
    private static final String THRESHOLD = "THRESHOLD";
    private static final String SELECTED = "SELECTED";
    private int mThreshold;
    private boolean mIsSelected;


    @Override
    /**
     * Obtain bundled parameters for initialization.
     */
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mThreshold = getArguments().getInt(THRESHOLD);
        mIsSelected = getArguments().getBoolean(SELECTED);
    }

    /**
     * Create a new threshold option fragment from a threshold level and its selection status.
     * @param threshold The threshold for this option (number between 1-10).
     * @param isSelected True if this option fragment is the selected preference.
     * @return An option fragment with the threshold and selection status bundled in its arguments.
     */
    public static ThresholdOptionFragment forThreshold(int threshold, boolean isSelected) {
        ThresholdOptionFragment fragment = new ThresholdOptionFragment();
        Bundle args = new Bundle();
        args.putInt(THRESHOLD,threshold);
        args.putBoolean(SELECTED,isSelected);
        fragment.setArguments(args);
        return fragment;
    }

    @Nullable
    @Override
    /**
     * Creates the view for the threshold option. Makes the selected marker appear if and only if
     * this is the selected user preference.
     */
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_threshold, container, false);
        mThresholdTextView = (TextView) rootView.findViewById(R.id.threshold);
        mSelectedView = (TextView) rootView.findViewById(R.id.isSelected);
        mThresholdTextView.setText(Integer.toString(mThreshold));
        if(mIsSelected) {
            mSelectedView.setVisibility(View.VISIBLE);
        } else {
            mSelectedView.setVisibility(View.GONE);
        }
        return rootView;
    }

    /**
     * Get the threshold value of this fragment.
     *
     * @return A valuew between 1-9, where 1 is the lowest threshold and 9 is the highest threshold.
     */
    public int getThreshold() {
        return mThreshold;
    }

}
