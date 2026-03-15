# Arquitectura de Lógica de Negocio - VAMOS App

## 1. Modelo de Dominio (Entities)

### 1.1 Entidad: Usuario

```
Usuario {
  id: string (UUID)
  email: string
  nombre: string
  apellido: string
  telefono: string
  foto_perfil: string (URL)
  rol: 'pasajero' | 'conductor' | 'ambos'
  verificacion_kyc: KYCStatus
  metodos_pago: MetodoPago[]
  wallet_balance: Moneda[]
  preferencias_notificaciones: NotificacionPrefs
  fecha_registro: timestamp
  ultimo_login: timestamp
  estado: 'activo' | 'suspendido' | 'baneado'
}

type KYCStatus = 'no_iniciado' | 'pendiente' | 'verificado' | 'rechazado'

type MetodoPago = {
  id: string
  tipo: 'zelle' | 'pago_movil' | 'efectivo' | 'transferencia'
  datos: {
    banco?: string
    telefono?: string
    email?: string
    nombre_cuenta?: string
  }
  verificado: boolean
}
```

### 1.2 Entidad: Vehiculo

```
Vehiculo {
  id: string (UUID)
  conductor_id: string (FK Usuario)
  marca: string
  modelo: string
  ano: number
  placa: string
  color: string
  capacidad_asientos: number (1-8)
  foto_frente: string (URL)
  foto_atras: string (URL)
  foto_interior: string (URL)
  documentos: {
    soat: string (URL)
    licencia: string (URL)
    propiedad: string (URL)
  }
  verificado: boolean
  es_principal: boolean
}
```

### 1.3 Entidad: Viaje (Trip)

```
Viaje {
  id: string (UUID)
  conductor_id: string (FK Usuario)
  vehiculo_id: string (FK Vehiculo)
  
  origen: Ubicacion
  destino: Ubicacion
  ruta_alternativa?: Ubicacion[]  // Paradas intermedias
  
  fecha_salida: timestamp
  hora_salida: string (HH:mm)
  hora_llegada_estimada?: timestamp
  
  asientos_totales: number
  asientos_disponibles: number
  precio_por_asiento: Precio
  
  estado: ViajeStatus
  visibilidad: 'publico' | 'privado' | 'solo_invitados'
  
  restricciones: {
    solo_mujeres: boolean
    solo_verificados: boolean
    acepta_mascotas: boolean
    acepta_fumadores: boolean
  }
  
  observaciones: string
  condiciones_clima: 'cualquiera' | 'solo_seco'
  
  fecha_creacion: timestamp
  fecha_publicacion: timestamp?
  
  matchings: Matching[]  // Reservas aceptadas
}

type Ubicacion = {
  direccion: string
  latitud: number
  longitud: number
  referencia?: string
  ciudad: string
}

type ViajeStatus = 
  | 'borrador'           // Conductor creando
  | 'publicado'          // Disponible para reservas
  | 'en_curso'          // Viaje iniciado
  | 'completado'         // Viaje terminado
  | 'cancelado'          // Cancelado por conductor
  | 'expirado'           // Sin reservas, fecha pasó

type Precio = {
  monto: number
  moneda: 'VES' | 'USD'
  tipo_tarifa: 'fija' | 'negociable'
}
```

### 1.4 Entidad: Reserva (Reservation)

```
Reserva {
  id: string (UUID)
  viaje_id: string (FK Viaje)
  pasajero_id: string (FK Usuario)
  
  asientos_solicitados: number
  precio_total: Precio
  
  estado: ReservaStatus
  estado_pago: PagoStatus
  
  intentos_pago: number
  ultimo_intento_pago: timestamp?
  
  pasajero_ubicacion?: Ubicacion  // Punto de recogida opcional
  
  nota_conductor?: string
  nota_pasajero?: string
  
  codigo_verificacion: string (4 dígitos)
  
  evidencia_pago: EvidenciaPago?
  
  fecha_solicitud: timestamp
  fecha_aprobacion?: timestamp
  fecha_confirmacion_pago?: timestamp
  fecha_cancelacion?: timestamp
}

type ReservaStatus = 
  | 'pendiente'              // Esperando aprobación del conductor
  | 'aprobada'               // Aprobada, esperando pago
  | 'validacion_pago'        // Pasajero subió comprobante
  | 'pago_confirmado'        // Pago verificado
  | 'en_espera'              // Esperando inicio del viaje
  | 'en_viaje'               // En curso
  | 'completada'             // Viaje terminado
  | 'cancelada'              // Cancelada
  | 'rechazada'              // Rechazada por conductor

type PagoStatus = 
  | 'sin_iniciar'
  | 'pendiente_validacion'
  | 'validado'
  | 'rechazado'
  | 'no_aplicable'

type EvidenciaPago = {
  tipo_pago: 'zelle' | 'pago_movil' | 'efectivo' | 'transferencia'
  comprobante_url: string (URL)
  monto: number
  moneda: 'VES' | 'USD'
  fecha_pago: timestamp
  referencia?: string
  notas?: string
  validado_por?: string (conductor_id)
  fecha_validacion?: timestamp
}
```

---

## 2. Máquina de Estados: Reserva

```
┌─────────────┐
│   INICIO    │
└──────┬──────┘
       │ Pasajero solicita reserva
       ▼
┌─────────────────────┐
│     PENDIENTE       │◄─────────────────────┐
│ (Esperando aprobación)                    │
└──────────┬──────────┘                      │
           │                                 │
     ┌─────┴─────┐                           │
     │           │                           │
     ▼           ▼                           │
┌─────────┐ ┌──────────┐                     │
│ APROBADA│ │RECHAZADA │                     │
└────┬────┘ └──────────┘                     │
     │                                        │
     │ Pasajero sube                         │
     │ comprobante                           │
     ▼                                        │
┌─────────────────────┐                       │
│VALIDACIÓN PAGO     │                       │
│ (Comprobante subido)                       │
└──────────┬──────────┘                       │
           │                                  │
      ┌────┴────┐                             │
      │         │                             │
      ▼         ▼                             │
┌───────────┐ ┌──────────┐                    │
│  VALIDADO │ │RECHAZADO │────────────────────┘
└─────┬─────┘ └──────────┘
      │
      │ Viaje inicia
      ▼
┌─────────────┐    ┌─────────────┐
│  EN_VIAJE   │───►│ COMPLETADA  │
└─────────────┘    └─────────────┘
```

### Transiciones de Estado

| Estado Actual | Evento | Estado Siguiente | Acción |
|---------------|--------|------------------|--------|
| PENDIENTE | Conductor aprueba | APROBADA | Notificar al pasajero, mostrar instrucciones de pago |
| PENDIENTE | Conductor rechaza | RECHAZADA | Notificar al pasajero, liberar asientos |
| PENDIENTE | Expirar (24h) | RECHAZADA | Notificar al pasajero |
| APROBADA | Pasajero sube comprobante | VALIDACION_PAGO | Notificar al conductor |
| VALIDACION_PAGO | Conductor valida | PAGO_CONFIRMADO | Confirmar reserva, decrementar asientos |
| VALIDACION_PAGO | Conductor rechaza | APROBADA | Notificar al pasajero, puede reintentar |
| PAGO_CONFIRMADO | Viaje inicia | EN_VIAJE | Notificar a ambos |
| EN_VIAJE | Viaje termina | COMPLETADA | Finalizar, activar rating |
| CUALQUIER | Cancelación | CANCELADA | Notificaciones, liberar asientos |

---

## 3. Servicios de Lógica de Negocio

### 3.1 Servicio: Gestor de Viajes (TripManager)

```typescript
class TripManager {
  
  // Crear nuevo viaje (Driver)
  async crearViaje(datos: CreateViajeDTO): Promise<Viaje>
  
  // Publicar viaje (cambiar de borrador a publicado)
  async publicarViaje(viajeId: string): Promise<Viaje>
  
  // Cancelar viaje (solo si no hay reservas confirmadas)
  async cancelarViaje(viajeId: string, motivo: string): Promise<Viaje>
  
  // Editar viaje (solo si no hay reservas confirmadas)
  async editarViaje(viajeId: string, datos: Partial<Viaje>): Promise<Viaje>
  
  // Buscar viajes disponibles
  async buscarViajes(filtros: BusquedaViajesDTO): Promise<Viaje[]>
  
  // Obtener viaje por ID
  async obtenerViaje(viajeId: string): Promise<Viaje>
  
  // Obtener viajes del conductor
  async obtenerViajesConductor(conductorId: string): Promise<Viaje[]>
  
  // Iniciar viaje (cuando llega hora de salida)
  async iniciarViaje(viajeId: string): Promise<Viaje>
  
  // Finalizar viaje
  async finalizarViaje(viajeId: string): Promise<Viaje>
}
```

### 3.2 Servicio: Gestor de Reservas (ReservationManager)

```typescript
class ReservationManager {
  
  // Solicitar reserva (Pasajero)
  async solicitarReserva(datos: SolicitudReservaDTO): Promise<Reserva>
  
  // Aprobar reserva (Conductor)
  async aprobarReserva(reservaId: string): Promise<Reserva>
  
  // Rechazar reserva (Conductor)
  async rechazarReserva(reservaId: string, motivo: string): Promise<Reserva>
  
  // Subir comprobante de pago (Pasajero)
  async subirComprobante(reservaId: string, evidencia: EvidenciaPago): Promise<Reserva>
  
  // Validar pago (Conductor)
  async validarPago(reservaId: string, esValido: boolean, notas?: string): Promise<Reserva>
  
  // Cancelar reserva (Pasajero o Conductor)
  async cancelarReserva(reservaId: string, motivo: string, canceladoPor: 'pasajero' | 'conductor'): Promise<Reserva>
  
  // Confirmar asistencia (Conductor marca que pasajero abordó)
  async confirmarAsistencia(reservaId: string): Promise<Reserva>
  
  // Obtener reserva por ID
  async obtenerReserva(reservaId: string): Promise<Reserva>
  
  // Obtener reservas de un viaje (Conductor)
  async obtenerReservasViaje(viajeId: string): Promise<Reserva[]>
  
  // Obtener reservas del pasajero
  async obtenerReservasPasajero(pasajeroId: string): Promise<Reserva[]>
  
  // Reintentar pago (si fue rechazado)
  async reintentarPago(reservaId: string): Promise<Reserva>
}
```

### 3.3 Servicio: Validador de Pagos (PaymentValidator)

```typescript
class PaymentValidator {
  
  // Validar evidencia de pago manualmente
  async validarEvidencia(
    reservaId: string,
    validacion: {
      esValido: boolean
      notas?: string
      validadoPor: string  // conductor_id
    }
  ): Promise<ValidacionResult>
  
  // Tipos de pago soportados
  readonly TIPOS_PAGO_SOPORTADOS = ['zelle', 'pago_movil', 'efectivo', 'transferencia'] as const
  
  // Monedas soportadas
  readonly MONEDAS_SOPORTADAS = ['VES', 'USD'] as const
  
  // Validar que monto coincida con precio del viaje
  validarMonto(monto: number, precio: Precio): boolean
  
  // Generar instrucciones de pago según tipo
  obtenerInstruccionesPago(tipoPago: TipoPago): InstruccionesPago
}
```

### 3.4 Servicio: Notificaciones (NotificationService)

```typescript
class NotificationService {
  
  // Notificar al conductor de nueva solicitud
  async notificarNuevaReserva(conductorId: string, reserva: Reserva): Promise<void>
  
  // Notificar al pasajero de aprobación
  async notificarReservaAprobada(pasajeroId: string, reserva: Reserva): Promise<void>
  
  // Notificar al pasajero de rechazo
  async notificarReservaRechazada(pasajeroId: string, reserva: Reserva, motivo: string): Promise<void>
  
  // Notificar al conductor de nuevo comprobante
  async notificarNuevoComprobante(conductorId: string, reserva: Reserva): Promise<void>
  
  // Notificar al pasajero de pago confirmado
  async notificarPagoConfirmado(pasajeroId: string, reserva: Reserva): Promise<void>
  
  // Notificar al pasajero de pago rechazado
  async notificarPagoRechazado(pasajeroId: string, reserva: Reserva, motivo: string): Promise<void>
  
  // Notificar recordatorio de pago
  async notificarRecordatorioPago(pasajeroId: string, reserva: Reserva): Promise<void>
  
  // Notificar inicio de viaje
  async notificarInicioViaje(usuarios: string[], viaje: Viaje): Promise<void>
  
  // Notificar viaje completado
  async notificarViajeCompletado(usuarios: string[], viaje: Viaje): Promise<void>
}
```

---

## 4. Flujo de Datos: Crear Viaje

```
┌──────────────────────────────────────────────────────────────────────┐
│                    FLUJO: CREAR VIAJE (CONDUCTOR)                   │
└──────────────────────────────────────────────────────────────────────┘

1. UI: Conductor completa formulario multi-paso
   ├── Paso 1: Ruta (Origen → Destino)
   ├── Paso 2: Horario y Vehículo
   ├── Paso 3: Precio por asiento
   └── Paso 4: Revisión y Publicar

2. API: POST /api/viajes
   └── Request: { 
        origen, destino, fecha_salida, hora_salida,
        asientos_totales, vehiculo_id, precio,
        restricciones, observaciones 
      }

3. Service: TripManager.crearViaje()
   ├── Validar datos requeridos
   ├── Validar vehículo pertenece al conductor
   ├── Validar asientos > 0
   ├── Crear registro en BD (estado: 'borrador')
   └── Retornar Viaje

4. UI: Mostrar pantalla de éxito
   └── Botón "Publicar" → API PATCH /api/viajes/:id/publicar

5. API: PATCH /api/viajes/:id/publicar
   └── Cambiar estado a 'publicado'

6. Service: Notificar a pasajeros (futuro)
```

---

## 5. Flujo de Datos: Solicitar Reserva

```
┌──────────────────────────────────────────────────────────────────────┐
│                 FLUJO: SOLICITAR RESERVA (PASAJERO)                  │
└──────────────────────────────────────────────────────────────────────┘

1. UI: Pasajero busca y selecciona viaje
   ├── Ver detalles del viaje
   ├── Seleccionar número de asientos
   └── Click "Solicitar Reserva"

2. API: POST /api/reservas
   └── Request: { 
        viaje_id, asientos_solicitados, 
        pasajero_ubicacion?, nota? 
      }

3. Service: ReservationManager.solicitarReserva()
   ├── Obtener viaje y validar:
   │   ├── Viaje existe y está 'publicado'
   │   ├── Asientos solicitados <= asientos_disponibles
   │   ├── Usuario no es el conductor
   │   ├── No tiene reserva activa en este viaje
   │   └── No tiene reserva pendiente en este viaje
   ├── Crear reserva (estado: 'pendiente')
   ├── Decrementar asientos_disponibles temporalmente
   └── Retornar Reserva

4. Service: NotificationService.notificarNuevaReserva()
   └── Enviar push notification al conductor

5. UI: Mostrar "Reserva Pendiente de Aprobación"
   └── Mostrar código de reserva, instrucciones

6. (Paralelo) Timeout 24h
   └── Si no hay respuesta → auto-rechazar, liberar asientos
```

---

## 6. Flujo de Datos: Validación de Pago

```
┌──────────────────────────────────────────────────────────────────────┐
│               FLUJO: VALIDACIÓN DE PAGO (MULTIMONEDA)                │
└──────────────────────────────────────────────────────────────────────┘

1. UI (Post-aprobación): Pasajero ve instrucciones de pago
   ├── Mostrar precio total
   ├── Mostrar métodos de pago disponibles del conductor:
   │   ├── Zelle: email
   │   ├── Pago Móvil: banco + teléfono
   │   ├── Efectivo: al abordar
   │   └── Transferencia: datos bancarios
   └── Botón "Subir Comprobante"

2. UI: Pasajero completa formulario de pago
   ├── Seleccionar tipo de pago
   ├── Ingresar monto (debe coincidir)
   ├── Subir imagen del comprobante
   ├── Agregar referencia (opcional)
   └── Notas (opcional)

3. API: POST /api/reservas/:id/comprobante
   └── Request: FormData (evidencia_pago)

4. Service: ReservationManager.subirComprobante()
   ├── Guardar imagen en storage
   ├── Actualizar reserva (estado: 'validacion_pago', estado_pago: 'pendiente_validacion')
   └── Retornar Reserva actualizada

5. Service: NotificationService.notificarNuevoComprobante()
   └── Enviar notificación al conductor

6. UI: Panel del Conductor
   ├── Ver lista de comprobantes pendientes
   ├── Ver detalle de cada reserva
   └── Opciones: "Validar" o "Rechazar"

7. API: PATCH /api/reservas/:id/validar-pago
   └── Request: { esValido: boolean, notas? }

8. Service: ReservationManager.validarPago()
   ├── Si esValido = true:
   │   ├── Estado → 'pago_confirmado'
   │   ├── EstadoPago → 'validado'
   │   ├── Guardar validacion_por, fecha_validacion
   │   └── Notificar al pasajero
   └── Si esValido = false:
       ├── Estado → 'aprobada' (puede reintentar)
       ├── EstadoPago → 'rechazado'
       ├── Guardar motivo
       └── Notificar al pasajero con motivo
```

---

## 7. Reglas de Negocio Detalladas

### 7.1 Gestión de Asientos

| Escenario | Acción |
|-----------|--------|
| Reserva aprobada | Decrementar `asientos_disponibles` en Viaje |
| Reserva cancelada/rechazada | Incrementar `asientos_disponibles` |
| Múltiples reservas pendientes | Validar que suma no exceda disponibles |
| Reserva pagada | Mantener asientos reservados |
| Viaje cancelado | Liberar todas las reservas, notificar |

### 7.2 Límites de Tiempo

| Proceso | Límite | Acción al Expirar |
|---------|--------|-------------------|
| Reserva pendiente | 24 horas | Auto-rechazar, liberar asientos |
| Comprobante sin subir | 24 horas (post-aprobación) | Cancelar reserva, liberar asientos |
| Pago pendiente validación | 48 horas | Recordatorio al conductor |
| Reintento de pago | 3 intentos máximo | Bloquear reserva |

### 7.3 Validaciones de Precio

```
Precio = asientos_solicitados * precio_por_asiento

// El monto debe ser exacto (tolerancia: 0.01 VES/USD)
validarMonto(monto, precio):
  return Math.abs(monto - precio.monto) < 0.01

// Si el conductor cobra en USD, el pasajero debe pagar en USD
// Conversión NO automática - el pasajero asume riesgo de cambio
```

### 7.4 Estados de Viaje con Reservas

```
borrador              → Sin restricciones, editable
publicado             → Acepta reservas
en_curso              → No acepta nuevas reservas
completado            → Historial
cancelado             → Libera todas las reservas
expirado              → Sin actividad, liberapuestos
```

---

## 8. Esquema de Base de Datos (Firebase Firestore)

```
/usuarios/{usuario_id}
  └── {datos_usuario}

/vehiculos/{vehiculo_id}
  └── {datos_vehiculo}

/viajes/{viaje_id}
  └── {
        conductor_id,
        vehiculo_id,
        origen,
        destino,
        fecha_salida,
        hora_salida,
        asientos_totales,
        asientos_disponibles,
        precio_por_asiento,
        estado,
        ...
      }

/reservas/{reserva_id}
  └── {
        viaje_id,
        pasajero_id,
        asientos_solicitados,
        precio_total,
        estado,
        estado_pago,
        evidencia_pago,
        codigo_verificacion,
        ...
      }

/reservas_por_viaje/{viaje_id}/reservas/{reserva_id}
  └── (índice para consultas rápidas)

/reservas_por_usuario/{usuario_id}/reservas/{reserva_id}
  └── (índice para historial de usuario)
```

---

## 9. Casos de Uso Críticos

### UC-001: Pasajero solicita reserva exitosamente

1. Pasajero busca viaje Caracas → Valencia
2. Selecciona viaje con 3 asientos disponibles
3. Solicita 2 asientos
4. Sistema valida disponibilidad
5. Crea reserva en estado PENDIENTE
6. Decrementa asientos disponibles (3 → 1)
7. Notifica al conductor
8. UI muestra "Esperando aprobación"

### UC-002: Conductor aprueba reserva

1. Conductor recibe notificación
2. Entra al panel de reservas
3. Ve reserva pendiente con detalles
4. Click "Aprobar"
5. Estado → APROBADA
6. Notifica al pasajero
7. Muestra instructions de pago

### UC-003: Pasajero sube comprobante Zelle

1. Pasajero ve instructions de pago
2. Realiza pago Zelle al email del conductor
3. Sube captura del pago
4. Sistema guarda evidencia
5. Estado → VALIDACION_PAGO
6. Notifica al conductor

### UC-004: Conductor valida pago

1. Conductor revisa comprobante
2. Confirma en su banco que recibió
3. Click "Validar" en la app
4. Estado → PAGO_CONFIRMADO
5. Notifica al pasajero
6. Asientos confirmados

### UC-005: Conductor rechaza comprobante

1. Conductor revisa comprobante
2. Detecta inconsistencia (monto wrong)
3. Click "Rechazar" + motivo
4. Estado → APROBADA (puede reintentar)
5. Notifica al pasajero con motivo
6. Pasajero puede subir nuevo comprobante

---

## 10. API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/viajes | Crear nuevo viaje |
| GET | /api/viajes | Buscar viajes (filtros) |
| GET | /api/viajes/:id | Obtener viaje |
| PATCH | /api/viajes/:id | Editar viaje |
| PATCH | /api/viajes/:id/publicar | Publicar viaje |
| PATCH | /api/viajes/:id/cancelar | Cancelar viaje |
| POST | /api/reservas | Solicitar reserva |
| GET | /api/reservas/:id | Obtener reserva |
| PATCH | /api/reservas/:id/aprobar | Aprobar reserva |
| PATCH | /api/reservas/:id/rechazar | Rechazar reserva |
| POST | /api/reservas/:id/comprobante | Subir comprobante |
| PATCH | /api/reservas/:id/validar-pago | Validar pago |
| PATCH | /api/reservas/:id/cancelar | Cancelar reserva |
| GET | /api/conductor/reservas-pendientes | Reservas pendientes |

---

## 11. Consideraciones de Seguridad

1. **Validación de conductor**: Solo el conductor del viaje puede aprobar/rechazar reservas
2. **Validación de pasajero**: Solo el pasajero puede subir comprobantes a su reserva
3. **Verificación de monto**: Validar exactitud del pago
4. **Código de verificación**: 4 dígitos para confirmar en el punto de encuentro
5. **Historial inmutable**: No permitir修改 reservas completadas
6. **Rate limiting**: Limitar solicitudes de reserva para prevenir abuso

---

## 12. Métricas de Negocio (KPIs)

| Métrica | Descripción |
|---------|-------------|
| Tasa de aprobación | Reservas aprobadas / Total solicitudes |
| Tiempo de aprobación | Promedio de tiempo desde solicitud hasta aprobación |
| Tasa de pago confirmado | Reservas pagadas / Reservas aprobadas |
| Tiempo de validación | Promedio de tiempo desde comprobante hasta validación |
| Tasa de cancelación | Reservas canceladas / Total reservas |
| Asientos promedio | Asientos vendidos por viaje |
