ODD FELLOW INFOTAVLE – ANDROID V2

NYT I V2
1. Automatisk APK-versionering
   - GitHub Actions bruger github.run_number som versionCode.
   - versionName bliver fx 1.0.12.
   - Nye APK'er kan derfor installeres oven på gamle uden versionskonflikt.

2. Billeder kan opdateres UDEN ny APK
   - Appen har altid sine indbyggede billeder som fallback.
   - Når enheden har internet, henter den:
     https://concordia35.github.io/infoapk/slideshow/billeder.json
   - Nye billeder downloades og gemmes lokalt i appens IndexedDB.
   - Når enheden bagefter er offline, bruges de gemte billeder.

3. GitHub opdaterer automatisk billeder.json
   - Upload kun billeder til repositoryets rodmappe:
     slideshow/
   - GitHub Action genererer billeder.json automatisk.

ANBEFALET ARBEJDSGANG FOR NYE BILLEDER
1. Upload nyt billede til:
   slideshow/
2. Vent ca. 1 minut på GitHub Action.
3. Tænd Wi-Fi på HY300.
4. Åbn infotavlen og lad den stå 10-20 sekunder.
5. Slå Wi-Fi fra igen.
6. De nye billeder bør nu fortsætte offline.

VIGTIGT
Remote URL er sat til:
https://concordia35.github.io/infoapk/slideshow/

Det forudsætter at repository'et / GitHub Pages-adressen er:
concordia35/infoapk

Hvis GitHub Pages bruger en anden sti, skal REMOTE_MANIFEST og REMOTE_BASE i:
app/src/main/assets/www/display.js
ændres.

APK BUILD
GitHub Actions -> Build Android APK.
Artifact-navnet inkluderer nu buildnummeret.
