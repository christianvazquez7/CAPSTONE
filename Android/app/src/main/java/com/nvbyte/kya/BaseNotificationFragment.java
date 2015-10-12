package com.nvbyte.kya;

import android.app.Fragment;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

/**
 * Fragment that contains information about the level classification of a zone. It is the base
 * notification when a positive delta or threshold condition is met.
 */
public class BaseNotificationFragment extends Fragment {

    private TextView mClassificationTextView;
    private View mBackgroundView;
    public static final String CLASS_PARAM = "CLASS";
    public static final String BACKGROUND_COLOR_PARAM = "COLOR";

    /**
     * Creates a BaseNotificationFragment with a classification bundled in its params.
     * @param classification Number between 1-10 for the area that's being notified.
     * @param color Color of the background for this classification.
     * @return BaseNotificationFragment with number and color bundled in arguments.
     */
    public static BaseNotificationFragment build( int classification, int color) {
        return null;
    }

    @Nullable
    @Override
    /**
     * Creates the notification view, with a classification and an associated color.
     */
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return super.onCreateView(inflater, container, savedInstanceState);
    }
}
