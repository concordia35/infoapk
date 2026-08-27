ODD FELLOW INFOTAVLE – ANDROID APK PROJECT

Dette er en rigtig native Android-wrapper omkring infotavlen.

Funktion:
- Kører helt offline efter installation
- Ingen Chrome/PWA nødvendig
- Tvinger landscape
- Immersive fullscreen/kiosk-visning
- Holder skærmen vågen
- Hele infotavlen og de aktuelle billeder ligger inde i appen

HY300:
minSdk = Android 5.0 (API 21), så den bør passe til langt de fleste HY300 Android-varianter.

BYG APK VIA GITHUB ACTIONS:
1. Upload hele projektet til et GitHub repository.
2. Åbn fanen Actions.
3. Workflowet "Build Android APK" kører automatisk ved push til main.
4. Åbn workflow-run.
5. Download artifact "OddFellow-Infotavle-APK".
6. Pak ZIP-artifact ud; app-debug.apk kan sideloades på HY300.

NYE BILLEDER:
Billederne er bundlet i APK'en. Læg nye billeder i:
app/src/main/assets/www/slideshow/

Derefter skal APK'en bygges igen.
Denne model er valgt, fordi den er væsentligt mere driftssikker på billig Android-projektorhardware end browser/PWA/offline-cache.
