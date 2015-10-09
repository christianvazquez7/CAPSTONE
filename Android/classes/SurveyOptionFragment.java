package com.nvbyte.kya;

import android.app.Fragment;
import android.os.Bundle;
import android.support.annotation.Nullable;
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
    private static final HashMap<Integer, String> TAGS = new HashMap<>();

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

    //Creates a new survey option from a particular survey rating.
    public static SurveyOptionFragment forRating(int rating) {
        return null;
    }

    @Nullable
    @Override
    /**
     * Creates the view for the fragment. This includes a label for the rating (1-10) and a matching
     * human readable translation (TAG).
     */
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return super.onCreateView(inflater, container, savedInstanceState);
    }

    /**
     * Get the rating for this particular survey option.
     *
     * @return An integer between 1-10 that represents the safety rating for a particular area.
     */
    public int getSafetyRating() {
        return 0;
    }

}
