package com.nvbyte.kya;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import java.util.HashMap;

/**
 * Contains and present information about a option to select for survey response. These options
 * are from 1 - 10 where 1 is the perception of the safest zone and 10 is a very dangerous
 * perception for a zone.
 */
public class SurveyOptionFragment extends Fragment {

    private TextView mRatingTextView;
    private TextView mDescriptionTextView;
    private int mRating;
    private String mDescription;
    private static final HashMap<Integer, String> TAGS = new HashMap<>();
    private static final String RATING = "RATING";

    //Initializes Hashmap that translates a security rating with a security tag.
    static {
        TAGS.put(1, "Very Safe");
        TAGS.put(2, "Safe");
        TAGS.put(3, "Neutral");
        TAGS.put(4, "Sketchy");
        TAGS.put(5, "Risky");
        TAGS.put(6, "Unsafe");
        TAGS.put(7, "Very unsafe");
        TAGS.put(8, "Dangerous");
        TAGS.put(9, "Very Dangerous");
        TAGS.put(10, "Hell");
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mRating = getArguments().getInt(RATING);
        mDescription = TAGS.get(mRating);
    }

    /**
     * Creates a SurveyOptionFragment for a specific risk rating.
     * @param rating The risk level for this option.
     * @return A SurveyOptionFragment with the rating bundled in its arguments.
     */
    public static SurveyOptionFragment forRating(int rating) {
        SurveyOptionFragment fragment = new SurveyOptionFragment();
        Bundle args = new Bundle();
        args.putInt(RATING,rating);
        fragment.setArguments(args);
        return fragment;
    }

    @Nullable
    @Override
    /**
     * Creates the view for the fragment. This includes a label for the rating (1-10) and a matching
     * human readable translation (TAG).
     */
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_survey_option, container, false);
        mRatingTextView = (TextView) rootView.findViewById(R.id.level);
        mDescriptionTextView = (TextView) rootView.findViewById(R.id.description);
        mRatingTextView.setText(Integer.toString(mRating));
        mDescriptionTextView.setText(mDescription);
        return rootView;
    }

    /**
     * Get the rating for this particular survey option.
     *
     * @return An integer between 1-10 that represents the safety rating for a particular area.
     */
    public int getSafetyRating() {
        return mRating;
    }

}
