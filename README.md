# Axtar.az Mobile

React Native mobile app built with Expo and TypeScript. The first delivery is the home screen, adapted from the current Axtar.az web experience: premium businesses, feed filters, real listing imagery, favorites, and mobile navigation.

## Run locally

```bash
npm install
npx expo install --fix
npm start
```

Scan the QR code with Expo Go, or use `npm run android` / `npm run ios` from a machine with the relevant simulator or device configured.

## Structure

```text
src/
  features/home/
    components/
    data/
    screens/
  theme/
```

Listing data and imagery currently come from Axtar.az's public website. API integration and the remaining app screens can be added after the home screen is reviewed.
