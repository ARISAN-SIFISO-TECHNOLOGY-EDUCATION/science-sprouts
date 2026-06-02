# Age-Verification Laws — Compliance Note

**Date:** 2 June 2026
**Applies to:** Science Sprouts (`com.sifiso.sciencesprouts`) and Math Adventure RPG
**Status:** No action required to launch. No Age Signals API integration needed at this time.

> Not legal advice. This is a practical summary of Google's official guidance, kept
> on record for Play Console declarations. Confirm the statute / consult counsel if
> the apps ever add data collection, ads, in-app purchases, accounts, or social features.

## Context

A wave of US state "App Store Accountability" laws (Texas **SB 2420**, Utah, Louisiana)
plus Brazil's Digital ECA push **age verification and parental consent to the app-store
level**. Google/Apple verify a user's age and obtain parental consent **before a minor
downloads an app** — that is the store's responsibility, not the developer's. The store
can then hand developers an **age bracket signal** via the **Play Age Signals API** so
apps that need to can provide age-appropriate experiences.

## Why our apps are the low-risk case

Both apps are **child-directed / Designed for Families** and:

- collect **no data** (offline; no accounts, no analytics, no network calls)
- have **no ads**, **no in-app purchases**, **no social / user-generated content**

The laws target the opposite kind of app (data collection, ads, purchases, social,
mature content aimed at minors). There is nothing in our apps to gate.

## Obligations — and which apply to us

| Obligation (per Google docs) | Applies? |
|---|---|
| Integrate the **Play Age Signals API** | **Optional** — *"Google Play doesn't mandate the use of these features."* The store does the age check + parental consent at download. |
| Assign an **age rating to in-app *products*** (separate from content rating) | **No** — zero in-app products / purchases. |
| **Age-signal data-use restriction** (from 1 Jan 2026: signal data usable *only* for age-appropriate experiences in the requesting app — never ads, marketing, profiling, analytics; misuse → API access revoked + app takedown) | **N/A** — only relevant if we integrate the API, which we do not. |
| Accurate **Data safety**, **content rating**, **target-audience** declarations | **Yes — already satisfied.** "No data collected" + Designed for Families is the strong posture. |

Google explicitly leaves to the developer the determination of *"whether and how to use
these features to meet your obligations."* The one question Google's docs do **not**
answer is whether the statute itself imposes any duty on a no-data kids' app beyond what
the store handles — practical exposure is minimal, but that is the item to confirm with
counsel if certainty is needed.

## Timeline (relevant because the apps are global)

| Jurisdiction | Effective |
|---|---|
| Texas (SB 2420) | In effect; Age Signals rolling out "in coming weeks" (per Google email, 2 Jun 2026). Some Help Center pages still reference the earlier, now-stayed injunction. |
| Brazil (Digital ECA) | ~17 March 2026 |
| Utah | ~May 2026 |
| Louisiana | ~July 2026 |

All use the **same** Age Signals mechanism, so a single future integration would cover
every jurisdiction.

## If integration is ever required

The Play Age Signals API is an **Android-native** call. In these Capacitor apps that
means a small native plugin that reads the age bracket and passes it to the web layer.
With no features to restrict, it would be plumbing only — not a redesign.

## Decision (2 Jun 2026)

- **Do not block the Science Sprouts launch** on this.
- **Do not integrate** the Age Signals API now (not mandated; nothing to gate).
- Keep all Play Console declarations truthful (already the case).
- Re-evaluate if Google or a jurisdiction flips the requirement to **mandatory for
  child-directed apps**, or if either app later adds data/ads/purchases.

## Sources

- Changes to Google Play for upcoming app store bills — https://support.google.com/googleplay/android-developer/answer/16569691
- Play Age Signals overview — https://developer.android.com/google/play/age-signals/overview
- Use Play Age Signals API (beta) — https://developer.android.com/google/play/age-signals/use-age-signals-api
- Notify Google Play of significant changes — https://developer.android.com/google/play/age-signals/notify-significant-changes
