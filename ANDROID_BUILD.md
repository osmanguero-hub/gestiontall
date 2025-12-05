# GESTIONTALL - Android Build Instructions

## Requisitos Previos

1. **Android Studio** instalado (https://developer.android.com/studio)
2. **JDK 17 o superior** instalado
3. **Android SDK** configurado (API 33 o superior recomendado)

## Comandos para Generar APK

### Opción 1: Abrir en Android Studio (Recomendado)

```bash
# Desde la carpeta del proyecto:
npx cap open android
```

Esto abrirá el proyecto en Android Studio donde puedes:
- Ejecutar en emulador
- Ejecutar en dispositivo físico conectado
- Generar APK firmado (Build > Build Bundle/APK > Build APK)

### Opción 2: Build desde Terminal

```bash
# Ir a la carpeta android
cd android

# Generar APK de debug
./gradlew assembleDebug

# El APK estará en: android/app/build/outputs/apk/debug/app-debug.apk
```

## Actualizar la App

Después de hacer cambios en el código:

```bash
# 1. Reconstruir el bundle web
npm run build

# 2. Sincronizar con Android
npx cap sync android

# 3. Abrir Android Studio (opcional)
npx cap open android
```

## Generar APK de Release

1. Abrir proyecto en Android Studio
2. Build > Generate Signed Bundle/APK
3. Seleccionar APK
4. Crear o usar keystore existente
5. Seleccionar "release" como build variant
6. El APK firmado estará listo para distribución

## Notas

- La carpeta `android/` contiene el proyecto Android nativo
- La carpeta `dist/` contiene la app web compilada
- Capacitor sincroniza `dist/` con `android/app/src/main/assets/public/`
