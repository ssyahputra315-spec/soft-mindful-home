import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.dhamma_reflection",
  appName: "Dhamma Reflection",
  // Capacitor packages a STATIC web bundle into the native app.
  // Point this at the directory containing your built index.html + assets.
  // See README-CAPACITOR.md for how to produce a static build from this
  // TanStack Start project.
  webDir: "dist/client",
  android: {
    allowMixedContent: false,
    backgroundColor: "#F5F1E8",
  },
  server: {
    androidScheme: "https",
  },
};

export default config;