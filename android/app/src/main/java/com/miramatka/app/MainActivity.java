package com.miramatka.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Any custom initialization for MainActivity can go here
        System.out.println("MainActivity onCreate called!");
    }
}
