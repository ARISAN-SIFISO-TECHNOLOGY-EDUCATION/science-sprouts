# Play Store Launch Checklist — Science Sprouts

App ID: `com.sifiso.sciencesprouts` · First release: `versionName 1.0` / `versionCode 1`

Work top to bottom. ✅ = done in code, ⬜ = needs you.

---

## 1. Build is ready ✅

- ✅ Ages 3–12 content complete (10 bands, 100+ topics)
- ✅ `npm run build` green, `npx cap sync` copied web assets into `android/`
- ✅ `versionCode 1` / `versionName "1.0"` in `android/app/build.gradle` (correct for a first upload)
- ✅ Verified: no network calls, no analytics/ads SDKs → "No data collected" is truthful

## 2. Create your upload keystore ⬜ (you must do this — keep the password secret)

Run this **yourself** in a terminal (it prompts for passwords; do NOT commit the file).
In Claude Code you can prefix with `!` to run it in-session, or use your own terminal:

```bash
keytool -genkey -v -keystore science-sprouts-upload.jks \
  -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

- Store `science-sprouts-upload.jks` somewhere safe AND backed up. **If you lose it
  you can never update the app** (unless enrolled in Play App Signing, which is the default —
  Google holds the app signing key, you hold this upload key; a lost upload key can be reset
  via support, but treat it as precious anyway).
- Save the keystore password + key password in your password manager.
- ⚠️ Already git-ignored? Confirm `*.jks` and `keystore.properties` are in `.gitignore`.

## 3. Wire signing into Gradle ⬜

Create `android/keystore.properties` (git-ignored):

```properties
storeFile=../../science-sprouts-upload.jks
storePassword=YOUR_STORE_PASSWORD
keyAlias=upload
keyPassword=YOUR_KEY_PASSWORD
```

Then in `android/app/build.gradle`, add a `signingConfigs` block and reference it
from `buildTypes.release` (the build guide section below has the exact snippet),
**or** skip this and sign interactively in Android Studio (step 4b).

## 4. Build the signed AAB ⬜

**Option A — Android Studio (easiest first time):**
1. `npx cap open android`
2. Build → Generate Signed Bundle / APK → **Android App Bundle**
3. Choose your `.jks`, enter passwords, alias `upload`
4. Build variant: **release** → finish
5. AAB lands in `android/app/release/app-release.aab`

**Option B — command line (after step 3):**
```bash
cd android && ./gradlew bundleRelease
# → android/app/build/outputs/bundle/release/app-release.aab
```

## 5. Play Console — create the app ⬜

1. Play Console → Create app → name **Science Sprouts**, App, Free, declarations
2. **App content** (left nav) — complete every red item:
   - Privacy policy URL (see step 6)
   - Data safety → **No data collected** (see PLAY_STORE_LISTING.md)
   - Content rating → fill IARC questionnaire (all No/None → Everyone)
   - Target audience → ages 3–5, 6–8, 9–12 → **Designed for Families** (Yes)
   - Ads → **No ads**
   - Government app → No; News app → No

## 6. Host the privacy policy ⬜ (Play requires a public URL)

Easiest: GitHub Pages from this repo.
1. Repo → Settings → Pages → Source: `main` / `/docs` folder → Save
2. Policy will be live at:
   `https://arisan-sifiso-technology-education.github.io/science-sprouts/PRIVACY_POLICY`
   (GitHub renders `docs/PRIVACY_POLICY.md`). Confirm it loads, then paste that URL
   into the Data safety + App content privacy-policy fields.
   - Alternative: paste the text into a free host (e.g. a GitHub Gist "raw" page).

## 7. Store listing ⬜

- Paste app name, short + full description from `PLAY_STORE_LISTING.md`
- Upload icon (512×512), feature graphic (1024×500), 2–8 phone screenshots
- Category: Education

## 8. Upload to a Closed testing track ⬜

1. Testing → **Closed testing** → create a track → upload `app-release.aab`
2. Add your **20+ testers** (email list or Google Group)
3. Roll out to the track; share the opt-in link with testers
4. Google's requirement: **20 testers opted in for 14 continuous days** before you
   can promote to Production. This is the gate the whole "one complete app" strategy
   is built around — so launch the full Ages 3–12 build here, once.

## 9. After 14 days ⬜

- Promote the same AAB from Closed testing → Production
- Submit for review

---

## Appendix — `build.gradle` signing snippet (for step 3, Option B)

```gradle
// near the top of android/app/build.gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release   // add this line
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

## Future updates (not now)

Each new release: bump `versionCode` (+1) and `versionName` in
`android/app/build.gradle`, then `npm run build && npx cap sync`, rebuild AAB, upload.
