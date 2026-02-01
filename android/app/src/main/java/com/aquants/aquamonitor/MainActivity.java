package com.aquants.aquamonitor;

import android.os.Bundle;
import android.view.View;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Disable edge-to-edge to prevent drawing under status bar
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);
    }
}
