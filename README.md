## 1. Crear el proyecto

Usamos la plantilla `blank-typescript` fijada al **SDK 57**, para que todos tengan
exactamente las mismas versiones que la app de referencia.

```bash
npx create-expo-app@latest rick-and-morty-explorer --template blank-typescript@sdk-57
cd rick-and-morty-explorer
```

## 2. Instalar la dependencia extra

La app usa `react-native-safe-area-context` para respetar el notch y la barra de gestos.
Se instala con `expo install` (no con `npm install`), que elige la versión compatible
con el SDK:

```bash
npx expo install react-native-safe-area-context
```