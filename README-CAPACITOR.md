# Building Dhamma Reflection as an Android APK

This project ships with a Capacitor config (`capacitor.config.ts`) so you can
wrap the web app in a native Android shell and produce an APK.

## Stack

Plain Vite + React + TanStack Router (SPA, hash history). `vite build`
produces a static bundle in `dist/client/` containing `index.html` and
`assets/`. Capacitor packages that directory into the Android WebView. All
data lives in `localStorage` — no server, no network required at runtime.

## One-time setup (on your local machine)

You need: Node 20+, Java 21, Android Studio with the Android SDK.

```bash
# 1. Install dependencies
bun install

# 2. Build the web app
bun run build

# 3. Add the Android platform (creates ./android)
npx cap add android

# 4. Copy the web bundle into the native project
npx cap sync android
```

## Every time you change the web app

```bash
bun run build
npx cap sync android
```

## Open & build the APK in Android Studio

```bash
npx cap open android
```

In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
The APK is written to
`android/app/build/outputs/apk/debug/app-debug.apk`.

For a release/signed APK, set up a keystore and run
**Build → Generate Signed Bundle / APK**.

## App identity

Edit `capacitor.config.ts` to change:

- `appId` — reverse-DNS package name (e.g. `com.yourname.dhamma`)
- `appName` — display name on the device
- `android.backgroundColor` — splash/background color

After changing `appId`, delete the `android/` folder and re-run
`npx cap add android`.

## Notes

- All data stays on-device in `localStorage` — no network required.
- The `<meta name="theme-color">` already matches the sand background.
- `viewport-fit=cover` and `env(safe-area-inset-bottom)` are already wired
  into the bottom nav, so it respects the Android gesture bar.