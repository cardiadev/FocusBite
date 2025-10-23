# Sistema de Fechas para Meal Prep Tasks

## Cambio Implementado

Las **Prep Tasks** ahora se guardan con **fechas específicas** en lugar de días de la semana genéricos.

## Antes vs Después

### ❌ Antes (Incorrecto)
```typescript
// Guardaba solo el día de la semana
{
  title: "Prep chicken",
  dayOfWeek: "wednesday"  // Se repetía cada miércoles
}
```

### ✅ Después (Correcto)
```typescript
// Guarda la fecha específica
{
  title: "Prep chicken",
  scheduledDate: "2025-01-22"  // Fecha específica: 22 de enero, 2025
}
```

## Ventajas del Nuevo Sistema

1. **Fechas específicas** - Las tareas están asociadas a un día concreto
2. **No se repiten** - Una tarea del 22 de enero no aparece el 29 de enero
3. **Histórico** - Puedes ver qué tareas hiciste en semanas pasadas
4. **Navegación** - Puedes navegar entre semanas y ver tareas específicas

## Implementación Técnica

### 1. Tipo Actualizado (`types/index.ts`)

```typescript
export interface PrepTask {
  id: string;
  title: string;
  servings: number;
  prepTime: number;
  isCompleted: boolean;
  scheduledDate?: string; // ✅ NUEVO: Fecha en formato YYYY-MM-DD
  dayOfWeek?: DayOfWeek;   // Deprecated
  // ... otros campos
}
```

### 2. Helper de Formato (`meal-prep.tsx`)

```typescript
const formatDateToISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
```

**Ejemplo:**
- Input: `new Date('2025-01-22')`
- Output: `"2025-01-22"`

### 3. Filtrado por Fecha

```typescript
const getTasksForDay = (dayIndex: number) => {
  const selectedDate = weekDates[dayIndex];
  const dateStr = formatDateToISO(selectedDate);
  return tasks.filter((task) => task.scheduledDate === dateStr);
};
```

**Cómo funciona:**
1. Usuario selecciona "Miércoles 22"
2. Se obtiene la fecha completa: `2025-01-22`
3. Se filtran solo las tareas con `scheduledDate === "2025-01-22"`

### 4. Guardar con Fecha

```typescript
const handleAddTask = async () => {
  const selectedDate = weekDates[selectedDay];
  const scheduledDate = formatDateToISO(selectedDate);
  
  await createTask({
    title: taskTitle,
    servings: parseInt(taskServings) || 4,
    prepTime: parseInt(taskPrepTime) || 30,
    isCompleted: false,
    scheduledDate: scheduledDate,  // ✅ Fecha específica
  });
};
```

## Flujo Completo

### Crear Tarea

1. Usuario está en la semana del 19-25 de enero, 2025
2. Selecciona **Miércoles 22**
3. Presiona el botón `+` para agregar tarea
4. Ingresa: "Marinar pollo - 4 porciones - 30 min"
5. Presiona "Agregar"

**Resultado en la base de datos:**
```json
{
  "id": "task-123",
  "title": "Marinar pollo",
  "servings": 4,
  "prepTime": 30,
  "isCompleted": false,
  "scheduledDate": "2025-01-22",
  "createdAt": "2025-01-19T10:30:00Z",
  "updatedAt": "2025-01-19T10:30:00Z"
}
```

### Ver Tareas

1. Usuario navega a la semana del 19-25 de enero
2. Selecciona **Miércoles 22**
3. Ve la tarea "Marinar pollo"

4. Usuario navega a la semana del 26 de enero - 1 de febrero
5. Selecciona **Miércoles 29**
6. **NO ve** la tarea "Marinar pollo" (porque es del día 22, no del 29)

## Contador de Tareas por Día

Cada día muestra cuántas tareas tiene programadas:

```typescript
const getTasksCountForDay = (dayIndex: number) => {
  return getTasksForDay(dayIndex).length;
};
```

**Ejemplo visual:**
```
Sun  Mon  Tue  Wed  Thu  Fri  Sat
19   20   21   22   23   24   25
0    2    1    3    0    1    0
     ↑    ↑    ↑         ↑
```

## Formato de Fecha

**Formato usado:** `YYYY-MM-DD` (ISO 8601)

**Ejemplos:**
- `"2025-01-22"` - 22 de enero, 2025
- `"2025-12-31"` - 31 de diciembre, 2025
- `"2026-02-14"` - 14 de febrero, 2026

**Ventajas del formato ISO:**
- ✅ Ordenamiento alfabético = ordenamiento cronológico
- ✅ Estándar internacional
- ✅ Compatible con bases de datos
- ✅ Fácil de comparar

## Migración de Datos

### Tareas Antiguas (sin scheduledDate)

Las tareas creadas antes de este cambio:
- ❌ No tienen `scheduledDate`
- ❌ No aparecerán en ningún día
- ✅ Solución: Eliminarlas o agregar manualmente el campo

### Tareas Nuevas

Todas las tareas creadas después de este cambio:
- ✅ Tienen `scheduledDate`
- ✅ Aparecen en el día correcto
- ✅ Se mantienen en su fecha específica

## Archivos Modificados

1. **`/types/index.ts`**
   - Agregado campo `scheduledDate?: string`
   - Marcado `dayOfWeek` como deprecated

2. **`/app/(tabs)/meal-prep.tsx`**
   - Agregado helper `formatDateToISO()`
   - Actualizado `getTasksForDay()` para filtrar por fecha
   - Actualizado `handleAddTask()` para guardar fecha específica

## Testing

### Caso 1: Crear tarea en día específico
```
1. Ir a Meal Prep
2. Seleccionar "Jueves 23"
3. Agregar tarea "Cocinar arroz"
4. ✅ Tarea aparece solo el Jueves 23
5. ✅ NO aparece en otros jueves
```

### Caso 2: Navegar entre semanas
```
1. Semana actual: 19-25 enero
2. Agregar tarea el Miércoles 22
3. Navegar a semana siguiente: 26 enero - 1 febrero
4. ✅ Tarea NO aparece en Miércoles 29
5. Volver a semana anterior: 19-25 enero
6. ✅ Tarea SÍ aparece en Miércoles 22
```

### Caso 3: Contador de tareas
```
1. Agregar 2 tareas el Lunes 20
2. Agregar 1 tarea el Miércoles 22
3. ✅ Lunes muestra "2 meals"
4. ✅ Miércoles muestra "1 meal"
5. ✅ Otros días muestran "0 meals"
```

## Próximos Pasos (Futuras Mejoras)

1. **Navegación entre semanas** - Botones para ir a semana anterior/siguiente
2. **Vista mensual** - Ver todas las tareas del mes
3. **Copiar tareas** - Duplicar tareas de una semana a otra
4. **Plantillas** - Crear plantillas de tareas recurrentes
5. **Recordatorios** - Notificaciones para tareas del día

## Resumen

✅ Las tareas ahora se guardan con **fechas específicas** (YYYY-MM-DD)  
✅ Cada tarea está asociada a **un día concreto**  
✅ Las tareas **no se repiten** automáticamente  
✅ Puedes **navegar entre semanas** y ver tareas históricas  
✅ El sistema es **escalable** para futuras mejoras  
