package com.nvbyte.kya;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
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
    private final static String CURRENT_GEOZONE_EXTRA = "CURRENT_GEOZONE";

    /**
     * Creates a BaseNotificationFragment with a classification bundled in its params.
     * @param classification Number between 1-10 for the area that's being notified.
     * @param color Color of the background for this classification.
     * @return BaseNotificationFragment with number and color bundled in arguments.
     */
    public static BaseNotificationFragment build( int classification, int color, boolean higher) {
        Bundle args = new Bundle();
        args.putInt(CLASS_PARAM,classification);
        args.putInt(BACKGROUND_COLOR_PARAM,color);
        args.putBoolean("HIGHER",higher);
        BaseNotificationFragment fragment = new BaseNotificationFragment();
        fragment.setArguments(args);
        return fragment;
    }

    @Nullable
    @Override
    /**
     * Creates the notification view, with a classification and an associated color.
     */
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_base_notification, container, false);
        mBackgroundView = rootView.findViewById(R.id.notification_color);
        mClassificationTextView = (TextView) rootView.findViewById(R.id.notification_level);
        mBackgroundView.setBackgroundColor(getResources().getColor(getArguments().getInt(BACKGROUND_COLOR_PARAM)));
        mClassificationTextView.setText(""+getArguments().getInt(CLASS_PARAM));
        boolean higher = getArguments().getBoolean("HIGHER",true);
        if(!higher) {
            TextView tv = (TextView) rootView.findViewById(R.id.notification_message);
            tv.setText("Entering lower risk area.");
        }

        rootView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent orientationActivity = new Intent();
                orientationActivity.putExtra(CURRENT_GEOZONE_EXTRA,getActivity().getIntent().getExtras().getSerializable(CURRENT_GEOZONE_EXTRA));
                orientationActivity.putExtra("OLD_GEO",getActivity().getIntent().getExtras().getSerializable("OLD_GEO"));
                orientationActivity.setClass(getActivity(),OrientationActivity.class);
                orientationActivity.putExtra("CLASS",getArguments().getInt(CLASS_PARAM));
                startActivity(orientationActivity);
            }
        });


        return rootView;
    }
}
