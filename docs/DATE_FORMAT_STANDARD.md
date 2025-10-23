# Estándar de Formato de Fechas - FocusBite

## Formato Oficial

**Todas las fechas en la aplicación usan ISO 8601 completo con timestamp:**

```
2025-10-21T21:28:07.658Z
```

## Estructura del Formato

```
YYYY-MM-DDTHH:mm:ss.sssZ
│    │  │  │ │  │  │   └─ Zona horaria UTC (Z = Zulu time)
│    │  │  │ │  │  └───── Milisegundos (000-999)
│    │  │  │ │  └──────── Segundos (00-59)
│    │  │  │ └─────────── Minutos (00-59)
│    │  │  └────────────── Horas (00-23)
│    │  └───────────────── Día (01-31)
│    └──────────────────── Mes (01-12)
└───────────────────────── Año (4 dígitos)
```

## Ejemplos

```typescript
// Fecha y hora actual
"2025-10-21T21:28:07.658Z"

// Inicio del día (00:00:00)
"2025-10-21T00:00:00.000Z"

// Fin del día (23:59:59)
"2025-10-21T23:59:59.999Z"

// Fecha de creación
"2025-01-15T14:30:45.123Z"

// Fecha de actualización
"2025-01-15T16:45:22.987Z"
```

## Ventajas del Formato ISO 8601

### 1. **Estándar Internacional**
- Reconocido mundialmente
- Compatible con todas las bases de datos
- Soportado nativamente por JavaScript

### 2. **Ordenamiento Natural**
```typescript
const dates = [
  "2025-10-21T21:28:07.658Z",
  "2025-01-15T14:30:45.123Z",
  "2025-12-31T23:59:59.999Z"
];

dates.sort(); // Ordena correctamente sin conversión
// ["2025-01-15T14:30:45.123Z", "2025-10-21T21:28:07.658Z", "2025-12-31T23:59:59.999Z"]
```

### 3. **Zona Horaria UTC**
- Elimina problemas de zonas horarias
- Consistencia en servidores globales
- Fácil conversión a hora local

### 4. **Precisión**
- Incluye milisegundos
- Útil para logs y auditoría
- Permite ordenamiento preciso

## Utilidades Centralizadas

Todas las operaciones con fechas deben usar las utilidades en `/utils/dateHelpers.ts`:

### Crear Fechas

```typescript
import { formatDateToStartOfDay, getCurrentDateISO } from '@/utils/dateHelpers';

// Fecha actual con timestamp
const now = getCurrentDateISO();
// "2025-10-21T21:28:07.658Z"

// Inicio del día
const startOfDay = formatDateToStartOfDay(new Date());
// "2025-10-21T00:00:00.000Z"
```

### Comparar Fechas

```typescript
import { isSameDay, isPast, isFuture } from '@/utils/dateHelpers';

// Comparar si son el mismo día (ignora hora)
isSameDay("2025-10-21T10:00:00.000Z", "2025-10-21T22:00:00.000Z");
// true

// Verificar si es pasado
isPast("2024-01-01T00:00:00.000Z");
// true

// Verificar si es futuro
isFuture("2026-01-01T00:00:00.000Z");
// true
```

### Formatear para Display

```typescript
import { formatForDisplay, formatForShortDisplay } from '@/utils/dateHelpers';

// Formato largo
formatForDisplay("2025-10-21T21:28:07.658Z");
// "October 21, 2025"

// Formato corto
formatForShortDisplay("2025-10-21T21:28:07.658Z");
// "Oct 21, 2025"
```

### Operaciones con Fechas

```typescript
import { addDaysToISO, getDaysDifference } from '@/utils/dateHelpers';

// Agregar días
addDaysToISO("2025-10-21T00:00:00.000Z", 7);
// "2025-10-28T00:00:00.000Z"

// Calcular diferencia
getDaysDifference("2025-10-21T00:00:00.000Z", "2025-10-28T00:00:00.000Z");
// 7
```

## Implementación en la App

### 1. Tipos TypeScript

Todos los campos de fecha en los tipos usan `string` con comentario ISO 8601:

```typescript
export interface PrepTask {
  id: string;
  title: string;
  scheduledDate?: string; // ISO 8601: 2025-10-21T00:00:00.000Z
  completedAt?: string;   // ISO 8601: 2025-10-21T21:28:07.658Z
  createdAt: string;      // ISO 8601: 2025-10-21T21:28:07.658Z
  updatedAt: string;      // ISO 8601: 2025-10-21T21:28:07.658Z
}
```

### 2. Servicios

Los servicios crean fechas usando `new Date().toISOString()`:

```typescript
// En mealPrepPlanning.service.ts
async createTask(taskData: Omit<PrepTask, 'id' | 'createdAt' | 'updatedAt'>) {
  const now = new Date().toISOString(); // ISO 8601
  
  const newTask: PrepTask = {
    ...taskData,
    id: generateId('task'),
    createdAt: now,
    updatedAt: now,
  };
  
  // Guardar en AsyncStorage
}
```

### 3. Componentes

Los componentes usan las utilidades de `/utils/dateHelpers.ts`:

```typescript
// En meal-prep.tsx
import { formatDateToStartOfDay, isSameDay } from '@/utils/dateHelpers';

const handleAddTask = async () => {
  const selectedDate = weekDates[selectedDay];
  const scheduledDate = formatDateToStartOfDay(selectedDate);
  
  await createTask({
    title: taskTitle,
    scheduledDate: scheduledDate, // "2025-10-21T00:00:00.000Z"
    // ...
  });
};
```

## Casos de Uso Específicos

### Tareas Programadas (Prep Tasks)

```typescript
// Guardar tarea para un día específico
{
  title: "Marinar pollo",
  scheduledDate: "2025-10-21T00:00:00.000Z", // Inicio del día
  createdAt: "2025-10-19T14:30:45.123Z",     // Cuando se creó
  updatedAt: "2025-10-19T14:30:45.123Z"      // Última actualización
}
```

### Completar Tarea

```typescript
// Cuando se marca como completada
{
  isCompleted: true,
  completedAt: "2025-10-21T18:45:22.987Z", // Momento exacto de completar
  updatedAt: "2025-10-21T18:45:22.987Z"    // Se actualiza también
}
```

### Logs de Actividades

```typescript
// Registro de ejercicio
{
  type: "running",
  duration: 30,
  date: "2025-10-21T07:00:00.000Z",    // Hora del ejercicio
  createdAt: "2025-10-21T07:35:12.456Z", // Cuando se registró
}
```

### Notificaciones

```typescript
// Notificación programada
{
  title: "Meal prep reminder",
  scheduledFor: "2025-10-21T09:00:00.000Z", // Cuándo notificar
  createdAt: "2025-10-20T22:00:00.000Z"     // Cuándo se creó
}
```

## Migración de Datos

### Datos Antiguos sin Timestamp

Si tienes datos con formato `YYYY-MM-DD`:

```typescript
// Convertir a ISO 8601 completo
const oldDate = "2025-10-21";
const newDate = new Date(oldDate).toISOString();
// "2025-10-21T00:00:00.000Z"
```

### Script de Migración (Ejemplo)

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

async function migrateDates() {
  const tasks = await AsyncStorage.getItem('prep_tasks');
  if (!tasks) return;
  
  const parsedTasks = JSON.parse(tasks);
  
  const migratedTasks = parsedTasks.map(task => {
    // Si scheduledDate no tiene timestamp, agregarlo
    if (task.scheduledDate && !task.scheduledDate.includes('T')) {
      task.scheduledDate = new Date(task.scheduledDate).toISOString();
    }
    return task;
  });
  
  await AsyncStorage.setItem('prep_tasks', JSON.stringify(migratedTasks));
}
```

## Reglas de Oro

### ✅ HACER

1. **Siempre usar ISO 8601 completo**
   ```typescript
   const date = new Date().toISOString();
   ```

2. **Usar utilidades centralizadas**
   ```typescript
   import { formatDateToStartOfDay } from '@/utils/dateHelpers';
   ```

3. **Comparar fechas correctamente**
   ```typescript
   isSameDay(date1, date2); // Para comparar días
   ```

4. **Guardar en UTC**
   ```typescript
   // Siempre en UTC (Z al final)
   "2025-10-21T21:28:07.658Z"
   ```

### ❌ NO HACER

1. **No usar formatos personalizados**
   ```typescript
   // ❌ INCORRECTO
   const date = "21/10/2025";
   const date = "2025-10-21"; // Sin timestamp
   ```

2. **No crear helpers locales**
   ```typescript
   // ❌ INCORRECTO
   const formatDate = (d) => `${d.getFullYear()}-${d.getMonth()}`;
   
   // ✅ CORRECTO
   import { formatDateToISO } from '@/utils/dateHelpers';
   ```

3. **No comparar strings directamente para días**
   ```typescript
   // ❌ INCORRECTO
   if (date1 === date2) // Compara timestamp exacto
   
   // ✅ CORRECTO
   if (isSameDay(date1, date2)) // Compara solo el día
   ```

4. **No usar Date.parse() sin validación**
   ```typescript
   // ❌ INCORRECTO
   const date = new Date(userInput);
   
   // ✅ CORRECTO
   import { parseISODate } from '@/utils/dateHelpers';
   const date = parseISODate(userInput);
   ```

## Preparación para Base de Datos

Este formato es compatible con:

### PostgreSQL
```sql
CREATE TABLE prep_tasks (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  scheduled_date TIMESTAMPTZ, -- Acepta ISO 8601
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### MongoDB
```javascript
{
  _id: ObjectId("..."),
  title: "Marinar pollo",
  scheduledDate: ISODate("2025-10-21T00:00:00.000Z"), // Nativo
  createdAt: ISODate("2025-10-19T14:30:45.123Z")
}
```

### Firebase
```javascript
{
  title: "Marinar pollo",
  scheduledDate: "2025-10-21T00:00:00.000Z", // String ISO
  createdAt: firebase.firestore.Timestamp.now() // O ISO string
}
```

### Supabase
```sql
-- Acepta ISO 8601 directamente
INSERT INTO prep_tasks (scheduled_date)
VALUES ('2025-10-21T00:00:00.000Z');
```

## Testing

### Ejemplo de Test

```typescript
import { formatDateToStartOfDay, isSameDay } from '@/utils/dateHelpers';

describe('Date Helpers', () => {
  it('should format date to start of day', () => {
    const date = new Date('2025-10-21T15:30:00.000Z');
    const result = formatDateToStartOfDay(date);
    expect(result).toBe('2025-10-21T00:00:00.000Z');
  });
  
  it('should compare same day correctly', () => {
    const date1 = '2025-10-21T10:00:00.000Z';
    const date2 = '2025-10-21T22:00:00.000Z';
    expect(isSameDay(date1, date2)).toBe(true);
  });
});
```

## Resumen

✅ **Formato único:** `2025-10-21T21:28:07.658Z` (ISO 8601)  
✅ **Utilidades centralizadas:** `/utils/dateHelpers.ts`  
✅ **Tipos documentados:** Comentarios en interfaces  
✅ **Compatible con DB:** PostgreSQL, MongoDB, Firebase, Supabase  
✅ **Zona horaria:** Siempre UTC (Z)  
✅ **Precisión:** Milisegundos incluidos  

Este estándar garantiza consistencia en toda la aplicación y facilita la futura integración con bases de datos.
