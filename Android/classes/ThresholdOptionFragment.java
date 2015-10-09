package com.nvbyte.kya;

import android.app.Fragment;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

/**
 * Contains and present information about a option to select for threshold. These options
 * are from 1 - 10 where 1 is the safest zone and 10 is a very dangerous zone.
 */
public class ThresholdOptionFragment extends Fragment {

    private TextView mThresholdTextView;


    //Creates a new threshold fragment for a particular threshold option.
    public static ThresholdOptionFragment forThreshold(int threshold) {
        return null;
    }

    @Nullable
    @Override
    /**
     * Creates the view for the threshold option.
     */
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return super.onCreateView(inflater, container, savedInstanceState);
    }

    /**
     * Get the threshold value of this fragment.
     *
     * @return A valuew between 1-9, where 1 is the lowest threshold and 9 is the highest threshold.
     */
    public int getThreshold() {
        return 0;
    }

}
