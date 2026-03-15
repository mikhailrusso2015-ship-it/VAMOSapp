-- SISTEMA DE BASE DE DATOS VAMOS V.3
-- Arquitectura para Unificación de Roles y Motor Financiero (Comisión 18%)

-- TABLA DE USUARIOS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    puntos_estrellas DECIMAL(3,2) DEFAULT 5.0,
    es_verificado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TABLA DE VIAJES (TRIPS)
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conductor_id UUID REFERENCES users(id),
    origen VARCHAR(100) NOT NULL,
    destino VARCHAR(100) NOT NULL,
    fecha_salida TIMESTAMP WITH TIME ZONE NOT NULL,
    asientos_totales INTEGER NOT NULL,
    asientos_disponibles INTEGER NOT NULL,
    precio_por_asiento_usd DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'disponible', -- disponible, en_curso, completado, cancelado
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TABLA DE RESERVAS (BOOKINGS)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    viaje_id UUID REFERENCES trips(id),
    pasajero_id UUID REFERENCES users(id),
    asientos_reservados INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pendiente', -- pendiente, confirmado, pagado, cancelado
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TABLA DE PAGOS Y MOTOR FINANCIERO (COMISIÓN 18%)
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reserva_id UUID REFERENCES bookings(id),
    monto_total_usd DECIMAL(10,2) NOT NULL,
    
    -- Cálculos automáticos de comisión (Motor Financiero)
    comision_plataforma_usd DECIMAL(10,2) GENERATED ALWAYS AS (monto_total_usd * 0.18) STORED,
    monto_conductor_usd DECIMAL(10,2) GENERATED ALWAYS AS (monto_total_usd * 0.82) STORED,
    
    metodo_pago VARCHAR(50) NOT NULL, -- Pago Móvil, Zelle, etc.
    referencia_bancaria VARCHAR(100),
    proyecto_id VARCHAR(50) DEFAULT 'vamosapp-490319',
    status_pago VARCHAR(20) DEFAULT 'procesando', -- procesando, completado, fallido
    fecha_pago TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- VISTA PARA BALANCE DE CONDUCTOR
CREATE VIEW driver_balances AS
SELECT 
    conductor_id,
    SUM(monto_conductor_usd) as balance_por_cobrar
FROM trips t
JOIN bookings b ON t.id = b.viaje_id
JOIN payments p ON b.id = p.reserva_id
WHERE p.status_pago = 'completado' AND t.status = 'completado'
GROUP BY conductor_id;
