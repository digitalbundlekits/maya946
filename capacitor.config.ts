import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.miramatka.app',    // Your app's unique package ID
  appName: 'Mira Matka',         // Your app's display name
  webDir: 'build',               // Directory of your compiled web assets
  bundledWebRuntime: false,      // Typically false for Capacitor (no bundled runtime)
  plugins: {
    // Example OneSignal plugin config
    OneSignal: {
      appId: 'dea056db-3b4a-4333-b209-8c1e3c5776ee',          // from OneSignal dashboard
      googleProjectNumber: '389013846645' // numeric, from Firebase project
    }
  }
};

export default config;
