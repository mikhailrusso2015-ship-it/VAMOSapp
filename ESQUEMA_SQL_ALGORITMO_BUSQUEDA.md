# Esquema de Base de Datos - VAMOS App

## 1. Diagrama ER (Entidad-Relación)

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    Users    │       │  Vehicles   │       │    Trips    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │──┐    │ id (PK)     │       │ id (PK)     │
│ email       │  │    │ user_id (FK)│──┐    │ driver_id(FK)│──┐
│ password    │  │    │ brand       │  │    │ vehicle_id(FK)│ │
│ first_name  │  │    │ model       │  │    │ origin_lat   │ │
│ last_name   │  │    │ plate       │  │    │ origin_lng   │ │
│ phone       │  │    │ color       │  │    │ origin_addr  │ │
│ role        │  │    │ capacity    │  │    │ dest_lat     │ │
│ kyc_status  │  │    │ verified    │  │    │ dest_lng     │ │
│ is_active   │  │    │ created_at  │  │    │ dest_addr    │ │
│ created_at  │  │    │ updated_at  │──┘    │ departure_tm│ │
│ updated_at  │──┘    └─────────────┘       │ seats_total │ │
└─────────────┘                             │ seats_avail │ │
                                             │ price       │ │
                                             │ currency    │ │
┌─────────────┐  1:N  ┌─────────────┐        │ status      │─┐
│  Bookings   │◄──────│    Trips    │        │ created_at  │ │
├─────────────┤       └─────────────┘        │ updated_at  │─┘
│ id (PK)     │                              └─────────────┘
│ trip_id (FK)│──┐                                      
│ passenger_id│ │                    ┌─────────────┐
│ seats_req   │ │       ┌────────────│  Payments   │
│ total_price │ │       │            ├─────────────┤
│ currency    │ │       │ N:1        │ id (PK)     │
│ status      │─┼───────┤            │ booking_id(FK)│
│ created_at  │ │       │            │ amount      │       
│ updated_at  │─┘       │            │ currency    │
└─────────────┘         │            │ payment_type│
                       │            │ proof_url   │
                       │            │ status      │
                       │            │ verified_by │
                       │            │ verified_at │
                       │            │ created_at  │
                       │            │ updated_at  │
                       └────────────┘
```

---

## 2. Script SQL (PostgreSQL)

```sql
-- ============================================
-- VAMOS APP - ESQUEMA DE BASE DE DATOS
-- Motor: PostgreSQL con PostGIS
-- ============================================

-- ------------------------------------------------
-- EXTENSIONES REQUERIDAS
-- ------------------------------------------------

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ------------------------------------------------
-- 1. TABLA: USERS (Usuarios)
-- ------------------------------------------------

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    phone           VARCHAR(20) NOT NULL,
    profile_picture VARCHAR(500),
    role            VARCHAR(20) NOT NULL DEFAULT 'passenger' 
                    CHECK (role IN ('passenger', 'driver', 'both')),
    kyc_status      VARCHAR(20) NOT NULL DEFAULT 'not_started'
                    CHECK (kyc_status IN (
                        'not_started', 
                        'pending', 
                        'verified', 
                        'rejected'
                    )),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    last_login      TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índice para búsquedas por email
CREATE INDEX idx_users_email ON users(email);

-- Índice para búsquedas por rol
CREATE INDEX idx_users_role ON users(role);

-- Índice para búsquedas por KYC
CREATE INDEX idx_users_kyc ON users(kyc_status);

-- ------------------------------------------------
-- 2. TABLA: VEHICLES (Vehículos)
-- ------------------------------------------------

CREATE TABLE vehicles (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) 
                    ON DELETE CASCADE,
    brand           VARCHAR(50) NOT NULL,
    model           VARCHAR(50) NOT NULL,
    year            INTEGER NOT NULL 
                    CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW()) + 1),
    plate           VARCHAR(20) NOT NULL UNIQUE,
    color           VARCHAR(30) NOT NULL,
    seats           INTEGER NOT NULL DEFAULT 4 
                    CHECK (seats >= 1 AND seats <= 8),
    photo_front     VARCHAR(500),
    photo_back      VARCHAR(500),
    photo_interior  VARCHAR(500),
    documents       JSONB DEFAULT '{}',
    is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
    is_primary      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índice para búsquedas por usuario (conductor)
CREATE INDEX idx_vehicles_user ON vehicles(user_id);

-- Índice para búsquedas de vehículos verificados
CREATE INDEX idx_vehicles_verified ON vehicles(is_verified);

-- ------------------------------------------------
-- 3. TABLA: TRIPS (Viajes)
-- ------------------------------------------------

-- ENUM: Trip Status
DO $$ 
BEGIN
    CREATE TYPE trip_status AS ENUM (
        'draft',
        'published',
        'in_progress',
        'completed',
        'cancelled',
        'expired'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ENUM: Trip Visibility
DO $$ 
BEGIN
    CREATE TYPE trip_visibility AS ENUM (
        'public',
        'private',
        'invite_only'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE trips (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id       UUID NOT NULL REFERENCES users(id)
                    ON DELETE CASCADE,
    vehicle_id      UUID NOT NULL REFERENCES vehicles(id)
                    ON DELETE RESTRICT,
    
    -- Origen (punto de recogida)
    origin_address  VARCHAR(500) NOT NULL,
    origin_lat      DECIMAL(10, 8) NOT NULL,
    origin_lng      DECIMAL(11, 8) NOT NULL,
    origin_city     VARCHAR(100) NOT NULL,
    origin_ref      VARCHAR(255),
    
    -- Destino
    dest_address    VARCHAR(500) NOT NULL,
    dest_lat        DECIMAL(10, 8) NOT NULL,
    dest_lng        DECIMAL(11, 8) NOT NULL,
    dest_city       VARCHAR(100) NOT NULL,
    dest_ref        VARCHAR(255),
    
    -- Ruta alternativa (paradas intermedias)
    waypoints       JSONB DEFAULT '[]',
    
    -- Horario
    departure_date  DATE NOT NULL,
    departure_time  TIME NOT NULL,
    arrival_estimate TIMESTAMP WITH TIME ZONE,
    
    -- Asientos
    seats_total     INTEGER NOT NULL DEFAULT 4 
                    CHECK (seats_total >= 1 AND seats_total <= 8),
    seats_available INTEGER NOT NULL DEFAULT 4 
                    CHECK (seats_available >= 0 AND seats_available <= seats_total),
    
    -- Precio
    price_per_seat  DECIMAL(12, 2) NOT NULL,
    currency        VARCHAR(3) NOT NULL DEFAULT 'USD'
                    CHECK (currency IN ('USD', 'VES')),
    price_type      VARCHAR(20) NOT NULL DEFAULT 'fixed'
                    CHECK (price_type IN ('fixed', 'negotiable')),
    
    -- Estado y metadata
    status          trip_status NOT NULL DEFAULT 'draft',
    visibility      trip_visibility NOT NULL DEFAULT 'public',
    
    -- Restricciones
    women_only      BOOLEAN NOT NULL DEFAULT FALSE,
    verified_only   BOOLEAN NOT NULL DEFAULT FALSE,
    pets_allowed    BOOLEAN NOT NULL DEFAULT FALSE,
    smokers_allowed BOOLEAN NOT NULL DEFAULT TRUE,
    weather_condition VARCHAR(20) DEFAULT 'any'
                    CHECK (weather_condition IN ('any', 'dry_only')),
    
    -- Notas
    observations    TEXT,
    
    -- Geometría PostGIS (para búsquedas espaciales)
    route_geom      GEOMETRY(LINESTRING, 4326),
    
    -- Timestamps
    published_at    TIMESTAMP WITH TIME ZONE,
    started_at      TIMESTAMP WITH TIME ZONE,
    completed_at    TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índices espaciales PostGIS
CREATE INDEX idx_trips_origin_gist ON trips USING GIST (origin_geom);
CREATE INDEX idx_trips_dest_gist ON trips USING GIST (dest_geom);
CREATE INDEX idx_trips_route_gist ON trips USING GIST (route_geom);

-- Índices para búsquedas frecuentes
CREATE INDEX idx_trips_driver ON trips(driver_id);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_departure ON trips(departure_date, departure_time);
CREATE INDEX idx_trips_seats_available ON trips(seats_available) 
WHERE status = 'published';

-- Índice compuesto para búsqueda de viajes
CREATE INDEX idx_trips_search ON trips(status, departure_date, seats_available)
WHERE status = 'published';

-- ------------------------------------------------
-- 4. TABLA: BOOKINGS (Reservas)
-- ------------------------------------------------

-- ENUM: Booking Status
DO $$ 
BEGIN
    CREATE TYPE booking_status AS ENUM (
        'pending',
        'approved',
        'rejected',
        'payment_validation',
        'paid',
        'waiting',
        'in_progress',
        'completed',
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ENUM: Payment Status
DO $$ 
BEGIN
    CREATE TYPE payment_status AS ENUM (
        'not_started',
        'pending_validation',
        'validated',
        'rejected',
        'not_applicable'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE bookings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id         UUID NOT NULL REFERENCES trips(id)
                    ON DELETE CASCADE,
    passenger_id    UUID NOT NULL REFERENCES users(id)
                    ON DELETE CASCADE,
    
    -- Detalles de la reserva
    seats_requested INTEGER NOT NULL DEFAULT 1 
                    CHECK (seats_requested >= 1 AND seats_requested <= 8),
    total_price     DECIMAL(12, 2) NOT NULL,
    currency        VARCHAR(3) NOT NULL,
    
    -- Estados
    status          booking_status NOT NULL DEFAULT 'pending',
    payment_status  payment_status NOT NULL DEFAULT 'not_started',
    
    -- Ubicación de recogida (opcional)
    pickup_address  VARCHAR(500),
    pickup_lat      DECIMAL(10, 8),
    pickup_lng      DECIMAL(11, 8),
    
    -- Notas
    passenger_note  TEXT,
    driver_note     TEXT,
    
    -- Código de verificación (4 dígitos)
    verify_code     VARCHAR(4),
    
    -- Información de pago
    payment_type    VARCHAR(20),
    payment_proof   VARCHAR(500),
    payment_amount  DECIMAL(12, 2),
    payment_date    TIMESTAMP WITH TIME ZONE,
    payment_ref     VARCHAR(100),
    payment_notes   TEXT,
    
    -- Validación
    validated_by    UUID REFERENCES users(id),
    validated_at    TIMESTAMP WITH TIME ZONE,
    
    -- Intentos de pago
    payment_attempts INTEGER NOT NULL DEFAULT 0,
    last_attempt_at   TIMESTAMP WITH TIME ZONE,
    
    -- Rechazo
    rejection_reason TEXT,
    rejected_at     TIMESTAMP WITH TIME ZONE,
    rejected_by     UUID REFERENCES users(id),
    
    -- Cancelación
    cancelled_at    TIMESTAMP WITH TIME ZONE,
    cancelled_by    UUID REFERENCES users(id),
    cancel_reason   TEXT,
    
    -- Completado
    completed_at    TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    approved_at     TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índices para búsquedas frecuentes
CREATE INDEX idx_bookings_trip ON bookings(trip_id);
CREATE INDEX idx_bookings_passenger ON bookings(passenger_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);

-- Índice único: un pasajero no puede tener múltiples reservas activas en el mismo viaje
CREATE UNIQUE INDEX idx_bookings_trip_passenger_active 
ON bookings(trip_id, passenger_id) 
WHERE status IN ('pending', 'approved', 'payment_validation', 'paid', 'waiting');

-- ------------------------------------------------
-- 5. TABLA: PAYMENTS (Pagos)
-- ------------------------------------------------

-- ENUM: Payment Type
DO $$ 
BEGIN
    CREATE TYPE payment_method AS ENUM (
        'zelle',
        'pago_movil',
        'cash',
        'transfer'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE payments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id      UUID NOT NULL REFERENCES bookings(id)
                    ON DELETE CASCADE,
    
    -- Monto
    amount          DECIMAL(12, 2) NOT NULL,
    currency        VARCHAR(3) NOT NULL,
    
    -- Método
    payment_method  payment_method NOT NULL,
    
    -- Comprobante
    proof_image    VARCHAR(500),
    
    -- Datos del pago (según método)
    payment_data    JSONB DEFAULT '{}',
    
    -- Estado de validación
    status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                    CHECK (status IN (
                        'pending', 
                        'validated', 
                        'rejected',
                        'cancelled'
                    )),
    
    -- Validación
    validated_by   UUID REFERENCES users(id),
    validated_at    TIMESTAMP WITH TIME ZONE,
    validation_note TEXT,
    
    -- Timestamps
    paid_at         TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ------------------------------------------------
-- 6. TABLA: DRIVER_PAYMENT_INFO (Info de Pago del Conductor)
-- ------------------------------------------------

CREATE TABLE driver_payment_info (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id)
                    ON DELETE CASCADE,
    
    -- Zelle
    zelle_email     VARCHAR(255),
    
    -- Pago Móvil
    pago_movil_bank VARCHAR(50),
    pago_movil_phone VARCHAR(20),
    
    -- Transferencia
    transfer_bank   VARCHAR(50),
    transfer_account VARCHAR(50),
    transfer_rif    VARCHAR(20),
    
    -- Preferencias
    preferred_method payment_method DEFAULT 'zelle',
    
    -- Timestamps
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_driver_payment_user ON driver_payment_info(user_id);

-- ------------------------------------------------
-- 7. TABLA: USER_PREFERENCES (Preferencias de Usuario)
-- ------------------------------------------------

CREATE TABLE user_preferences (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id)
                    ON DELETE CASCADE,
    
    -- Notificaciones
    notify_booking  BOOLEAN DEFAULT TRUE,
    notify_payment  BOOLEAN DEFAULT TRUE,
    notify_trip     BOOLEAN DEFAULT TRUE,
    notify_promo    BOOLEAN DEFAULT FALSE,
    
    -- Preferencias de viaje
    prefer_women_only BOOLEAN DEFAULT FALSE,
    prefer_verified  BOOLEAN DEFAULT TRUE,
    prefer_pets      BOOLEAN DEFAULT FALSE,
    
    -- Ubicaciones guardadas
    saved_locations JSONB DEFAULT '[]',
    
    -- Timestamps
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_user_prefs_user ON user_preferences(user_id);

-- ------------------------------------------------
-- 8. TRIGGERS PARA UPDATED_AT
-- ------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar a todas las tablas
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at 
    BEFORE UPDATE ON vehicles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at 
    BEFORE UPDATE ON trips 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------
-- 9. VISTAS ÚTILES
-- ------------------------------------------------

-- Vista: Viajes disponibles con info del conductor
CREATE OR REPLACE VIEW v_available_trips AS
SELECT 
    t.id,
    t.departure_date,
    t.departure_time,
    t.origin_address,
    t.origin_city,
    t.dest_address,
    t.dest_city,
    t.seats_available,
    t.price_per_seat,
    t.currency,
    t.status,
    u.first_name AS driver_first_name,
    u.last_name AS driver_last_name,
    u.profile_picture AS driver_picture,
    v.brand,
    v.model,
    v.plate,
    v.color,
    ST_Distance(
        ST_MakePoint(t.origin_lat, t.origin_lng)::geography,
        ST_MakePoint(t.origin_lat, t.origin_lng)::geography
    ) AS route_distance
FROM trips t
JOIN users u ON t.driver_id = u.id
JOIN vehicles v ON t.vehicle_id = v.id
WHERE t.status = 'published'
AND t.departure_date >= CURRENT_DATE
AND t.seats_available > 0
AND u.is_active = TRUE
AND u.kyc_status = 'verified';

-- Vista: Reservas con detalles
CREATE OR REPLACE VIEW v_booking_details AS
SELECT 
    b.id,
    b.status AS booking_status,
    b.payment_status,
    t.origin_city,
    t.dest_city,
    t.departure_date,
    t.departure_time,
    u_pass.first_name AS passenger_first_name,
    u_pass.last_name AS passenger_last_name,
    u_driver.first_name AS driver_first_name,
    u_driver.last_name AS driver_last_name,
    b.seats_requested,
    b.total_price,
    b.currency,
    b.created_at
FROM bookings b
JOIN trips t ON b.trip_id = t.id
JOIN users u_pass ON b.passenger_id = u_pass.id
JOIN users u_driver ON t.driver_id = u_driver.id;
```

---

## 3. Enumeraciones (ENUMs) Definidas

### 3.1 Trip Status (Estado del Viaje)

```sql
-- ENUM: trip_status
CREATE TYPE trip_status AS ENUM (
    'draft',        -- Borrador (conductor creando)
    'published',    -- Publicado (disponible para reservas)
    'in_progress',  -- En curso (viaje iniciado)
    'completed',    -- Completado (viaje terminado)
    'cancelled',    -- Cancelado (cancelado por conductor)
    'expired'      -- Expirado (sin actividad, fecha pasó)
);
```

**Transiciones válidas:**
```
draft → published
published → in_progress
published → cancelled
published → expired
in_progress → completed
in_progress → cancelled
```

### 3.2 Booking Status (Estado de la Reserva)

```sql
-- ENUM: booking_status
CREATE TYPE booking_status AS ENUM (
    'pending',             -- Pendiente (esperando aprobación del conductor)
    'approved',           -- Aprobada (conductor aprobó, esperando pago)
    'rejected',           -- Rechazada (conductor rechazado)
    'payment_validation', -- Validación de pago (comprobante subido)
    'paid',               -- Pagado (pago confirmado)
    'waiting',            -- En espera (esperando inicio del viaje)
    'in_progress',        -- En viaje
    'completed',          -- Completada
    'cancelled'           -- Cancelada
);
```

**Transiciones válidas:**
```
pending → approved         (conductor aprueba)
pending → rejected         (conductor rechaza)
pending → cancelled        (pasajero cancela)
approved → payment_validation  (pasajero sube comprobante)
approved → cancelled       (pasajero cancela)
payment_validation → paid  (conductor valida pago)
payment_validation → approved (conductor rechaza pago)
paid → waiting            (esperando inicio)
waiting → in_progress     (viaje inicia)
in_progress → completed  (viaje termina)
* → cancelled             (cancelación emergency)
```

### 3.3 Payment Status (Estado del Pago)

```sql
-- ENUM: payment_status
CREATE TYPE payment_status AS ENUM (
    'not_started',       -- Sin iniciar
    'pending_validation', -- Pendiente de validación
    'validated',         -- Validado
    'rejected',          -- Rechazado
    'not_applicable'    -- No aplica (ej: efectivo)
);
```

---

## 4. Algoritmo de Búsqueda de Viajes

### 4.1 Lógica de Matching (Node.js/TypeScript)

```typescript
/**
 * ============================================
 * ALGORITMO DE BÚSQUEDA DE VIAJES - VAMOS APP
 * ============================================
 * 
 * El pasajero ingresa:
 * - Ciudad de origen
 * - Ciudad de destino
 * - Fecha deseada
 * - Número de asientos
 * 
 * El sistema debe encontrar viajes donde:
 * 1. La ruta del conductor pase cerca del origen del pasajero
 * 2. La ruta del conductor pase cerca del destino del pasajero
 * 3. Hayan asientos disponibles
 * 4. La fecha coincida
 */

// ============================================
// TIPOS
// ============================================

interface GeoPoint {
    lat: number;
    lng: number;
}

interface SearchFilters {
    origin: GeoPoint;
    destination: GeoPoint;
    date: Date;
    passengers: number;
    maxOriginDistanceKm?: number;  // Distancia máx del origen del pasajero al punto de recogida
    maxDestDistanceKm?: number;    // Distancia máx del destino del pasajero al punto de llegada
    maxPrice?: number;
    currency?: 'USD' | 'VES';
    womenOnly?: boolean;
    verifiedOnly?: boolean;
}

interface TripMatch {
    trip: Trip;
    originDistance: number;      // Distancia desde origen del pasajero al origen del viaje
    destDistance: number;       // Distancia desde destino del pasajero al destino del viaje
    routeScore: number;         // Score de qué tan alineada está la ruta
    priceTotal: number;
}

// ============================================
// FUNCIONES UTILITARIAS
// ============================================

/**
 * Calcular distancia entre dos puntos usando Haversine
 * Retorna distancia en kilómetros
 */
function calculateHaversineDistance(
    point1: GeoPoint, 
    point2: GeoPoint
): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = toRad(point2.lat - point1.lat);
    const dLng = toRad(point2.lng - point1.lng);
    
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
}

function toRad(deg: number): number {
    return deg * (Math.PI / 180);
}

/**
 * Calcular distancia usando PostGIS (más preciso para búsquedas DB)
 */
async function findNearbyTripsWithPostGIS(
    filters: SearchFilters,
    pool: any
): Promise<TripMatch[]> {
    
    const maxOriginDist = filters.maxOriginDistanceKm || 5; // 5km por defecto
    const maxDestDist = filters.maxDestDistanceKm || 10;     // 10km por defecto
    
    // Query usando PostGIS
    const query = `
        WITH passenger_points AS (
            SELECT 
                ST_MakePoint($1, $2)::geography AS origin_point,
                ST_MakePoint($3, $4)::geography AS dest_point
        )
        SELECT 
            t.*,
            u.first_name AS driver_first_name,
            u.last_name AS driver_last_name,
            u.profile_picture AS driver_picture,
            v.brand,
            v.model,
            v.plate,
            v.color,
            ST_Distance(
                ST_MakePoint(t.origin_lat, t.origin_lng)::geography,
                pp.origin_point
            ) / 1000 AS origin_distance_km,
            ST_Distance(
                ST_MakePoint(t.dest_lat, t.dest_lng)::geography,
                pp.dest_point
            ) / 1000 AS dest_distance_km,
            (t.price_per_seat * $5) AS total_price
        FROM trips t
        JOIN users u ON t.driver_id = u.id
        JOIN vehicles v ON t.vehicle_id = v.id
        CROSS JOIN passenger_points pp
        WHERE t.status = 'published'
        AND t.departure_date = $6
        AND t.seats_available >= $5
        AND t.departure_time >= NOW()::time
        AND ST_Distance(
            ST_MakePoint(t.origin_lat, t.origin_lng)::geography,
            pp.origin_point
        ) <= ($7 * 1000)  -- Convertir km a metros
        AND ST_Distance(
            ST_MakePoint(t.dest_lat, t.dest_lng)::geography,
            pp.dest_point
        ) <= ($8 * 1000)
        AND ($9::boolean IS NULL OR t.women_only = $9::boolean)
        AND ($10::boolean IS NULL OR t.verified_only = $9::boolean)
        AND ($11::float IS NULL OR t.price_per_seat <= $11::float)
        ORDER BY 
            origin_distance_km ASC,
            dest_distance_km ASC,
            t.departure_time ASC
        LIMIT 50;
    `;
    
    const params = [
        filters.origin.lng,  // PostGIS usa (lng, lat)
        filters.origin.lat,
        filters.destination.lng,
        filters.destination.lat,
        filters.passengers,
        filters.date,
        maxOriginDist,
        maxDestDist,
        filters.womenOnly,
        filters.verifiedOnly,
        filters.maxPrice
    ];
    
    return pool.query(query, params);
}

/**
 * Algoritmo de scoring para ranking de resultados
 * Considera qué tan "alineada" está la ruta del conductor
 * con los puntos deseados del pasajero
 */
function calculateRouteScore(
    originDistance: number,
    destDistance: number,
    trip: Trip
): number {
    
    // Parámetros de weighting
    const ORIGIN_WEIGHT = 0.6;  // El origen es más importante
    const DEST_WEIGHT = 0.4;
    
    // Normalizar distancias (0-1, donde 0 es perfecto)
    const originScore = Math.max(0, 1 - (originDistance / 10)); // 10km = score 0
    const destScore = Math.max(0, 1 - (destDistance / 15));       // 15km = score 0
    
    // Bonus: si el origen/destino del pasajero está EN la ruta del conductor
    // (Esto requeriría análisis de la línea de ruta del viaje)
    let routeBonus = 0;
    
    // Calcular score final (0-100)
    const score = (
        (originScore * ORIGIN_WEIGHT + destScore * DEST_WEIGHT + routeBonus) * 100
    );
    
    return Math.round(score * 10) / 10;
}

/**
 * Función principal de búsqueda
 */
async function searchTrips(
    filters: SearchFilters
): Promise<TripMatch[]> {
    
    // 1. Buscar trips cercanos usando PostGIS
    let trips = await findNearbyTripsWithPostGIS(filters, databasePool);
    
    // 2. Si no hay PostGIS, usar Haversine (fallback)
    if (trips.length === 0) {
        trips = await findTripsWithHaversine(filters);
    }
    
    // 3. Calcular scores y filtrar resultados
    const matches: TripMatch[] = trips.map(trip => {
        const originDistance = calculateHaversineDistance(
            filters.origin,
            { lat: trip.origin_lat, lng: trip.origin_lng }
        );
        
        const destDistance = calculateHaversineDistance(
            filters.destination,
            { lat: trip.dest_lat, lng: trip.dest_lng }
        );
        
        const routeScore = calculateRouteScore(originDistance, destDistance, trip);
        
        return {
            trip,
            originDistance,
            destDistance,
            routeScore,
            priceTotal: trip.price_per_seat * filters.passengers
        };
    });
    
    // 4. Ordenar por score (mejor match primero)
    matches.sort((a, b) => b.routeScore - a.routeScore);
    
    // 5. Filtrar por distancia máxima (hard filter)
    const finalResults = matches.filter(match => 
        match.originDistance <= (filters.maxOriginDistanceKm || 5) &&
        match.destDistance <= (filters.maxDestDistanceKm || 10)
    );
    
    return finalResults;
}

/**
 * Búsqueda con Haversine (sin PostGIS)
 * Útil para desarrollo o como fallback
 */
async function findTripsWithHaversine(
    filters: SearchFilters
): Promise<Trip[]> {
    
    // Obtener todos los trips publicados en la fecha
    const allTrips = await db.trips.find({
        status: 'published',
        departure_date: filters.date,
        seats_available: { $gte: filters.passengers },
        departure_time: { $gte: new Date() }
    });
    
    // Filtrar por distancia
    return allTrips.filter(trip => {
        const originDist = calculateHaversineDistance(
            filters.origin,
            { lat: trip.origin_lat, lng: trip.origin_lng }
        );
        
        const destDist = calculateHaversineDistance(
            filters.destination,
            { lat: trip.dest_lat, lng: trip.dest_lng }
        );
        
        return originDist <= (filters.maxOriginDistanceKm || 5) &&
               destDist <= (filters.maxDestDistanceKm || 10);
    });
}

// ============================================
// EJEMPLO DE USO
// ============================================

const resultados = await searchTrips({
    origin: { lat: 10.4806, lng: -66.9036 },  // Caracas
    destination: { lat: 10.1626, lng: -68.0079 },  // Valencia
    date: new Date('2026-03-20'),
    passengers: 2,
    maxOriginDistanceKm: 5,
    maxDestDistanceKm: 10,
    maxPrice: 25,
    currency: 'USD',
    womenOnly: false,
    verifiedOnly: true
});

console.log('Viajes encontrados:', resultados.length);
resultados.forEach((match, index) => {
    console.log(`
    ${index + 1}. ${match.trip.origin_city} → ${match.trip.dest_city}
       Conductor: ${match.trip.driver_first_name} ${match.trip.driver_last_name}
       Precio: ${match.priceTotal} ${match.trip.currency}
       Distancia origen: ${match.originDistance.toFixed(1)} km
       Distancia destino: ${match.destDistance.toFixed(1)} km
       Score: ${match.routeScore}/100
    `);
});
```

### 4.2 SQL Puro (Alternativa sin PostGIS)

```sql
-- ============================================
-- BÚSQUEDA DE VIAJES - SQL PURO
-- ============================================

-- Función para calcular distancia (Haversine en SQL)
CREATE OR REPLACE FUNCTION haversine_distance(
    lat1 DECIMAL, lon1 DECIMAL,
    lat2 DECIMAL, lon2 DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
    R CONSTANT DECIMAL := 6371;  -- Radio de la Tierra en km
    dLat DECIMAL;
    dLon DECIMAL;
    a DECIMAL;
    c DECIMAL;
BEGIN
    dLat := RADIANS(lat2 - lat1);
    dLon := RADIANS(lon2 - lon1);
    
    a := SIN(dLat/2) * SIN(dLat/2) + 
         COS(RADIANS(lat1)) * COS(RADIANS(lat2)) * 
         SIN(dLon/2) * SIN(dLon/2);
    
    c := 2 * ATAN2(SQRT(a), SQRT(1-a));
    
    RETURN R * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Query de búsqueda
SELECT 
    t.id,
    t.origin_address,
    t.dest_address,
    t.origin_city,
    t.dest_city,
    t.departure_date,
    t.departure_time,
    t.seats_available,
    t.price_per_seat,
    t.currency,
    u.first_name AS driver_name,
    v.brand,
    v.model,
    v.plate,
    haversine_distance(t.origin_lat, t.origin_lng, 10.4806, -66.9036) AS origin_distance_km,
    haversine_distance(t.dest_lat, t.dest_lng, 10.1626, -68.0079) AS dest_distance_km,
    (t.price_per_seat * 2) AS total_price
FROM trips t
JOIN users u ON t.driver_id = u.id
JOIN vehicles v ON t.vehicle_id = v.id
WHERE t.status = 'published'
AND t.departure_date = '2026-03-20'
AND t.seats_available >= 2
AND u.kyc_status = 'verified'
-- Filtrar por distancia máxima (5km origen, 10km destino)
AND haversine_distance(t.origin_lat, t.origin_lng, 10.4806, -66.9036) <= 5
AND haversine_distance(t.dest_lat, t.dest_lng, 10.1626, -68.0079) <= 10
ORDER BY 
    haversine_distance(t.origin_lat, t.origin_lng, 10.4806, -66.9036) ASC,
    t.departure_time ASC
LIMIT 20;
```

### 4.3 Flujo del Algoritmo

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ALGORITMO DE BÚSQUEDA                            │
└─────────────────────────────────────────────────────────────────────┘

1. INPUT DEL PASAJERO
   ├── Origen (lat, lng)
   ├── Destino (lat, lng)
   ├── Fecha
   ├── # Asientos
   └── Filtros opcionales (precio, mujeres, verificados)

2. BÚSQUEDA EN BASE DE DATOS
   ├── Estado = 'published'
   ├── Fecha = fecha solicitada
   ├── Asientos disponibles >= solicitados
   ├── Fecha >= hoy
   └── Hora salida >= hora actual

3. FILTRADO ESPACIAL (PostGIS o Haversine)
   ├── Distancia(origen_pasajero, origen_viaje) <= 5km
   └── Distancia(destino_pasajero, destino_viaje) <= 10km

4. CÁLCULO DE SCORE
   ├── originScore = 1 - (distanciaOrigen / 10)  [0 = lejos, 1 = exacto]
   ├── destScore   = 1 - (distanciaDestino / 15)
   ├── routeBonus  = +0.1 si pasa por puntos intermedios
   └── score = (originScore × 0.6 + destScore × 0.4 + bonus) × 100

5. ORDENAMIENTO
   ├── Primary:   Score de ruta (desc)
   ├── Secondary: Distancia origen (asc)
   └── Tertiary:  Hora de salida (asc)

6. OUTPUT
   └── Lista de TripMatch ordenados por relevancia
```

---

## 5. Índices Espaciales PostGIS Recomendados

```sql
-- Crear columna de geometría para búsquedas rápidas
ALTER TABLE trips ADD COLUMN IF NOT EXISTS origin_geom GEOMETRY(Point, 4326);
ALTER TABLE trips ADD COLUMN IF NOT EXISTS dest_geom GEOMETRY(Point, 4326);

-- Poblar geometrías
UPDATE trips SET 
    origin_geom = ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326),
    dest_geom = ST_SetSRID(ST_MakePoint(dest_lng, dest_lat), 4326);

-- Crear índices GIST
CREATE INDEX idx_trips_origin_geom_gist ON trips USING GIST (origin_geom);
CREATE INDEX idx_trips_dest_geom_gist ON trips USING GIST (dest_geom);

-- Búsqueda con índice espacial (más rápido)
SELECT *
FROM trips
WHERE status = 'published'
AND ST_DWithin(
    origin_geom,
    ST_MakePoint(-66.9036, 10.4806)::geography,
    5000  -- 5km en metros
)
AND ST_DWithin(
    dest_geom,
    ST_MakePoint(-68.0079, 10.1626)::geography,
    10000  -- 10km en metros
);
```

---

## Resumen

| Tabla | Claves Foráneas | Índices Clave |
|-------|-----------------|---------------|
| users | - | email, role, kyc_status |
| vehicles | user_id | user_id, is_verified |
| trips | driver_id, vehicle_id | status, departure_date, spatial (PostGIS) |
| bookings | trip_id, passenger_id | trip_id, passenger_id, status |
| payments | booking_id | booking_id, status |

¿Necesitas que agregue algo más, como triggers de validación o funciones específicas?
