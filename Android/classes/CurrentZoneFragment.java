package com.nvbyte.kya;

import android.app.Fragment;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;

/**
 * Fragment that contains information about the current zone level.
 */
public class CurrentZoneFragment extends Fragment {

    private ProgressBar mLoading;
    private View mBackgroundView;
    private TextView mAreaRatingTextView;

    @Nullable
    @Override
    /**
     * Creates the view for the  zone fragment. Launches a query to the server to fetch current
     * location data using HTTP request.
     */
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return super.onCreateView(inflater, container, savedInstanceState);
    }

    /**
     * Makes the fragment fetch latest zone data  from the server.
     */
    public void refresh() {

    }
}
