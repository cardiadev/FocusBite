# 🎬 Splash Screen con Gradiente Animado

## ✅ Ya está configurado!

Tu splash screen incluye:
- ✅ Fondo con gradiente animado (#9785EB como color principal)
- ✅ Animación de posición del gradiente (8 segundos por ciclo) - similar al efecto CSS background-position
- ✅ Sin bordes visibles ni franjas durante la animación
- ✅ Animación Lottie personalizable en el centro
- ✅ Fade out suave después de 3 segundos
- ✅ Transición suave a la interfaz principal

---

## ⚡ Pasos Rápidos para Personalizar

### 1️⃣ Agregar tu animación Lottie

**Archivo:** `assets/animations/splash.json`

1. Abre el archivo
2. Borra TODO el contenido
3. Pega tu código JSON de Lottie
4. Guarda y recarga la app (presiona `r`)

---

## 🎨 Personalización del Gradiente

**Archivo:** `components/AnimatedSplash.tsx`

### Cambiar colores del gradiente

**Líneas 89-94:**
```typescript
colors={[
  '#9785EB', // Tu color principal
  '#B39DDB', // Segundo color (más claro)
  '#7E57C2', // Tercer color (más oscuro)
  '#9785EB', // Vuelve al principal
]}
```

**Ejemplos de paletas:**

**Morado elegante (actual):**
```typescript
['#9785EB', '#B39DDB', '#7E57C2', '#9785EB']
```

**Azul oceánico:**
```typescript
['#667eea', '#764ba2', '#f093fb', '#667eea']
```

**Sunset:**
```typescript
['#ff6b6b', '#feca57', '#48dbfb', '#ff6b6b']
```

**Verde menta:**
```typescript
['#56ab2f', '#a8e063', '#2ecc71', '#56ab2f']
```

### Cambiar velocidad de animación del gradiente

**Línea 32 (y línea 37):**
```typescript
duration: 4000,  // Milisegundos (ida y vuelta)
```

- `2000` = 2 segundos (muy rápido) ⚡
- `3000` = 3 segundos (rápido)
- `4000` = 4 segundos (balanceado) ⭐ Actual
- `6000` = 6 segundos (más suave)
- `8000` = 8 segundos (muy suave)

**Nota:** El ciclo completo dura el doble (ida + vuelta), así que 4000ms = 8 segundos de ciclo completo.

### Detener la animación del gradiente

Si prefieres un gradiente estático:

**Líneas 27-41** - Comenta el Animated.loop:
```typescript
// Animated.loop(
//   Animated.sequence([
//     ...
//   ])
// ).start();
```

Y **líneas 102-103** - Usa posiciones fijas:
```typescript
start={{ x: 0, y: 0 }}
end={{ x: 1, y: 1 }}
```

---

## ⏱️ Personalización de Duración

### Cambiar duración total del splash

**Línea 44:**
```typescript
}, 2500);  // Duración antes del fade out
```

Ejemplos:
- `2000` = 2s + 0.5s fade = **2.5s total**
- `2500` = 2.5s + 0.5s fade = **3s total** ⭐
- `3000` = 3s + 0.5s fade = **3.5s total**
- `4000` = 4s + 0.5s fade = **4.5s total**

### Cambiar velocidad del fade out

**Línea 47:**
```typescript
duration: 500,  // Milisegundos del fade
```

- `300` = Rápido
- `500` = Balanceado ⭐
- `800` = Suave
- `1000` = Muy suave

---

## 🖼️ Personalización de la Animación Lottie

### Cambiar tamaño

**Líneas 135-136:**
```typescript
animationContainer: {
  width: 300,   // Ancho en px
  height: 300,  // Alto en px
}
```

Ejemplos:
- **Pequeña:** `200x200`
- **Mediana:** `300x300` ⭐
- **Grande:** `400x400`
- **Extra grande:** `500x500`

### Hacer que se repita (loop)

**Línea 107:**
```typescript
loop={false}  // Cambia a true para repetir
```

### Cambiar modo de ajuste

**Línea 109:**
```typescript
resizeMode="contain"  // Opciones: contain, cover, center
```

- `contain` = Cabe completa (puede haber espacio) ⭐
- `cover` = Llena el espacio (puede cortarse)
- `center` = Tamaño original centrado

---

## 🎯 Ejemplos Completos

### Splash rápido y dinámico

```typescript
// Líneas 32 y 37
duration: 2000,  // Animación muy rápida (4s ciclo completo)

// Línea 44
}, 1500);  // Solo 2 segundos total

// Línea 47
duration: 300,  // Fade rápido
```

### Splash lento y elegante

```typescript
// Líneas 32 y 37
duration: 8000,  // Animación muy suave (16s ciclo completo)

// Línea 44
}, 4000);  // 4.5 segundos total

// Línea 47
duration: 1000,  // Fade muy suave
```

### Splash minimalista (sin animación)

```typescript
// Comentar líneas 27-41 (animación de gradiente)

// Usar gradiente estático simple en líneas 102-103:
start={{ x: 0, y: 0 }}
end={{ x: 1, y: 1 }}

// Reducir colores:
colors={['#9785EB', '#B39DDB']}
```

---

## 📍 Ubicación de Archivos

```
FocusBite/
├── assets/
│   └── animations/
│       └── splash.json              ← Tu animación Lottie JSON
├── components/
│   └── AnimatedSplash.tsx           ← Toda la configuración aquí
└── app/
    └── _layout.tsx                  ← Integración del splash
```

---

## 🐛 Troubleshooting

**El gradiente no se ve:**
- Verifica que `expo-linear-gradient` esté instalado
- Recarga la app completamente

**El gradiente no se anima:**
- Asegúrate de que `useNativeDriver: false` en líneas 33 y 38 (necesario para animar posiciones)
- Verifica que las interpolaciones estén correctas (líneas 65-83)
- Recarga la app completamente

**La animación Lottie no aparece:**
- Verifica que el JSON esté correcto en `assets/animations/splash.json`
- Asegúrate de que `lottie-react-native` esté instalado

**Colores se ven diferentes:**
- Los colores pueden verse ligeramente diferentes en iOS vs Android
- Prueba en ambas plataformas

**El splash dura demasiado/poco:**
- Ajusta el valor en línea 44
- Recuerda: valor + 500ms (fade) = duración total

---

## 💡 Tips Pro

1. **Gradientes sutiles:** Usa colores cercanos para transiciones suaves
2. **Contraste:** Asegúrate que tu animación Lottie contraste con el fondo
3. **Performance:** Gradientes simples (2-3 colores) funcionan mejor
4. **Testing:** Prueba en luz y oscuridad (modo día/noche del celular)
5. **Duración:** 2-3 segundos es ideal para no cansar al usuario

---

## 🎨 Encuentra Animaciones Lottie

- [LottieFiles](https://lottiefiles.com/) - Gratis
- [IconScout](https://iconscout.com/lottie-animations) - Premium
- Crea las tuyas en After Effects + Bodymovin plugin

---

**¿Preguntas?** Revisa el código en `components/AnimatedSplash.tsx` - está bien comentado!
