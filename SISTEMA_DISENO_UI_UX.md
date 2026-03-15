# Sistema de Diseño UI/UX - VAMOS App

## 1. Design Tokens

### 1.1 Paleta de Colores

```css
/* ============================================
   VAMOS APP - DESIGN TOKENS
   ============================================ */

/* Colores Primarios */
--color-primary: #EC5B13;          /* Naranja VAMOS - Principal */
--color-primary-light: #FF7B3A;    /* Naranja claro - Hover */
--color-primary-dark: #C44A0E;     /* Naranja oscuro - Active */
--color-primary-alpha: rgba(236, 91, 19, 0.15);  /* Fondo con alpha */

/* Colores de Fondo */
--color-bg-light: #F8F6F6;         /* Fondo claro */
--color-bg-dark: #040521;          /* Fondo oscuro / Space Blue */
--color-bg-card: #0A0C3D;          /* Tarjetas en modo oscuro */
--color-bg-elevated: #121442;      /* Elementos elevados */

/* Colores Semánticos - Estados */
--color-success: #10B981;          /* Verde - Exito */
--color-success-bg: rgba(16, 185, 129, 0.15);
--color-warning: #F59E0B;         /* Amarillo - Advertencia */
--color-warning-bg: rgba(245, 158, 11, 0.15);
--color-error: #EF4444;            /* Rojo - Error */
--color-error-bg: rgba(239, 68, 68, 0.15);
--color-info: #3B82F6;             /* Azul - Información */
--color-info-bg: rgba(59, 130, 246, 0.15);

/* Colores de Texto */
--color-text-primary: #1F2937;    /* Texto principal oscuro */
--color-text-secondary: #6B7280;   /* Texto secundario */
--color-text-muted: #9CA3AF;      /* Texto deshabilitado */
--color-text-inverse: #F9FAFB;    /* Texto sobre fondo oscuro */
--color-text-link: #2563EB;        /* Enlaces */

/* Colores de Borde */
--color-border-light: #E5E7EB;    /* Borde claro */
--color-border-dark: #374151;      /* Borde oscuro */
--color-border-focus: #EC5B13;     /* Borde en focus */

/* Colores de Gradiente */
--gradient-vamos: linear-gradient(145deg, #081D56, #040521);
--gradient-primary: linear-gradient(135deg, #EC5B13, #FF7B3A);
--gradient-card: linear-gradient(180deg, #0A0C3D 0%, #040521 100%);
```

### 1.2 Tipografía

```css
/* ============================================
   TIPOGRAFÍA
   ============================================ */

--font-family-base: 'Public Sans', -apple-system, BlinkMacSystemFont, sans-serif;
--font-family-display: 'Public Sans', sans-serif;

/* Tamaños de Fuente */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */

/* Pesos de Fuente */
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Alturas de Línea */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;

/* Espaciado entre letras */
--tracking-tight: -0.025em;
--tracking-normal: 0;
--tracking-wide: 0.025em;
```

### 1.3 Espaciado (Spacing Scale)

```css
/* ============================================
   ESPACIADO (8px base)
   ============================================ */

--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */

/* Border Radius */
--radius-sm: 0.25rem;    /* 4px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;       /* 16px */
--radius-2xl: 1.5rem;    /* 24px */
--radius-full: 9999px;   /* Circular */
```

### 1.4 Sombras (Neumorphic Design)

```css
/* ============================================
   SOMBRAS - NEUMÓRFICO
   ============================================ */

/* Sombras para modo claro */
--shadow-flat-light: 6px 6px 12px #D1D5DB, -6px -6px 12px #FFFFFF;
--shadow-pressed-light: inset 4px 4px 8px #D1D5DB, inset -4px -4px 8px #FFFFFF;
--shadow-float-light: 8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.8);

/* Sombras para modo oscuro (Space Blue) */
--shadow-flat-dark: 6px 6px 12px #020211, -6px -6px 12px #060831;
--shadow-pressed-dark: inset 4px 4px 8px #020211, inset -4px -4px 8px #060831;
--shadow-float-dark: 8px 8px 16px #020211, -8px -8px 16px #060831;

/* Sombras con color primario */
--shadow-primary: 0 4px 14px rgba(236, 91, 19, 0.25);
--shadow-primary-lg: 0 8px 25px rgba(236, 91, 19, 0.35);

/* Sombras de elevación */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
```

---

## 2. Componentes Base

### 2.1 Botones (Buttons)

```html
<!-- ============================================
     BOTONES - VARIANTES
     ============================================ -->

<!-- Botón Primario (Naranja) -->
<button class="btn btn-primary">
    <span class="btn-icon">arrow_forward</span>
    <span class="btn-text">Continuar</span>
</button>

<!-- Botón Secundario (Fondo Oscuro) -->
<button class="btn btn-secondary">
    <span class="btn-text">Atrás</span>
</button>

<!-- Botón Outline -->
<button class="btn btn-outline">
    <span class="btn-text">Cancelar</span>
</button>

<!-- Botón Ghost (Transparente) -->
<button class="btn btn-ghost">
    <span class="btn-icon">settings</span>
</button>

<!-- Botón Peligro (Rojo) -->
<button class="btn btn-danger">
    <span class="btn-icon">delete</span>
    <span class="btn-text">Eliminar</span>
</button>

<!-- Botón Éxito (Verde) -->
<button class="btn btn-success">
    <span class="btn-icon">check</span>
    <span class="btn-text">Confirmar</span>
</button>

<!-- Botón Flotante SOS -->
<button class="btn btn-sos">
    <span class="material-symbols-outlined">emergency</span>
</button>

<!-- Estados de Botón -->
<button class="btn btn-primary" disabled>Deshabilitado</button>
<button class="btn btn-primary loading">Cargando...</button>
```

```css
/* ============================================
   ESTILOS DE BOTONES
   ============================================ */

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-6);
    font-family: var(--font-family-base);
    font-size: var(--text-base);
    font-weight: var(--font-semibold);
    line-height: 1;
    border-radius: var(--radius-xl);
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-primary {
    background: var(--gradient-primary);
    color: white;
    box-shadow: var(--shadow-primary);
}

.btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-primary-lg);
}

.btn-primary:active:not(:disabled) {
    transform: translateY(0);
}

.btn-secondary {
    background: var(--color-bg-dark);
    color: var(--color-text-inverse);
    box-shadow: var(--shadow-flat-dark);
}

.btn-secondary:hover:not(:disabled) {
    background: var(--color-bg-elevated);
}

.btn-outline {
    background: transparent;
    color: var(--color-primary);
    border: 2px solid var(--color-primary);
}

.btn-ghost {
    background: transparent;
    color: var(--color-text-secondary);
}

.btn-danger {
    background: var(--color-error);
    color: white;
}

.btn-success {
    background: var(--color-success);
    color: white;
}

/* Botón Neumórfico Personalizado */
.btn-neumorphic {
    background: var(--color-bg-dark);
    color: var(--color-text-inverse);
    box-shadow: var(--shadow-flat-dark);
    border-radius: var(--radius-2xl);
}

.btn-neumorphic:hover:not(:disabled) {
    box-shadow: var(--shadow-float-dark);
}

.btn-neumorphic:active:not(:disabled) {
    box-shadow: var(--shadow-pressed-dark);
}

/* Botón Flotante SOS */
.btn-sos {
    position: fixed;
    bottom: var(--space-6);
    right: var(--space-6);
    width: 56px;
    height: 56px;
    border-radius: var(--radius-full);
    background: var(--color-error);
    color: white;
    box-shadow: var(--shadow-lg);
    z-index: 100;
    animation: pulse-sos 2s infinite;
}

@keyframes pulse-sos {
    0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
    50% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
}
```

### 2.2 Campos de Formulario (Inputs)

```html
<!-- ============================================
     INPUTS - VARIANTES
     ============================================ -->

<!-- Input Básico -->
<div class="input-group">
    <label class="input-label">Correo Electrónico</label>
    <input type="email" class="input" placeholder="tu@email.com">
    <span class="input-helper">Ejemplo: usuario@correo.com</span>
</div>

<!-- Input con Icono -->
<div class="input-group">
    <label class="input-label">Teléfono</label>
    <div class="input-with-icon">
        <span class="material-symbols-outlined input-icon">phone</span>
        <input type="tel" class="input" placeholder="+58 412 123 4567">
    </div>
</div>

<!-- Input con Error -->
<div class="input-group error">
    <label class="input-label">Contraseña</label>
    <input type="password" class="input" value="123">
    <span class="input-error">La contraseña debe tener al menos 8 caracteres</span>
</div>

<!-- Input Deshabilitado -->
<div class="input-group">
    <label class="input-label">Ciudad</label>
    <input type="text" class="input" value="Caracas" disabled>
</div>

<!-- Textarea -->
<div class="input-group">
    <label class="input-label">Observaciones</label>
    <textarea class="input textarea" rows="3" placeholder="Agrega alguna observación..."></textarea>
</div>

<!-- Select -->
<div class="input-group">
    <label class="input-label">Método de Pago</label>
    <div class="select-wrapper">
        <select class="input select">
            <option value="">Selecciona una opción</option>
            <option value="zelle">Zelle</option>
            <option value="pago_movil">Pago Móvil</option>
            <option value="efectivo">Efectivo</option>
        </select>
        <span class="select-arrow material-symbols-outlined">expand_more</span>
    </div>
</div>

<!-- Toggle Switch -->
<div class="toggle-group">
    <label class="toggle-label">
        <span class="toggle-text">Aceptar mascotas</span>
        <input type="checkbox" class="toggle-input">
        <span class="toggle-switch"></span>
    </label>
</div>

<!-- Radio Buttons -->
<div class="radio-group">
    <label class="radio-label">
        <input type="radio" name="gender" value="female" class="radio-input">
        <span class="radio-circle"></span>
        <span>Solo mujeres</span>
    </label>
    <label class="radio-label">
        <input type="radio" name="gender" value="male" class="radio-input">
        <span class="radio-circle"></span>
        <span>Solo hombres</span>
    </label>
    <label class="radio-label">
        <input type="radio" name="gender" value="any" class="radio-input" checked>
        <span class="radio-circle"></span>
        <span>Cualquiera</span>
    </label>
</div>

<!-- Checkbox -->
<div class="checkbox-group">
    <label class="checkbox-label">
        <input type="checkbox" class="checkbox-input">
        <span class="checkbox-box">
            <span class="material-symbols-outlined check-icon">check</span>
        </span>
        <span>Acepto los términos y condiciones</span>
    </label>
</div>
```

```css
/* ============================================
   ESTILOS DE INPUTS
   ============================================ */

.input-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
}

.input-label {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--color-text-primary);
}

.input {
    padding: var(--space-3) var(--space-4);
    font-family: var(--font-family-base);
    font-size: var(--text-base);
    color: var(--color-text-primary);
    background: var(--color-bg-light);
    border: 2px solid transparent;
    border-radius: var(--radius-lg);
    transition: all 0.2s ease;
}

.input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-alpha);
}

.input::placeholder {
    color: var(--color-text-muted);
}

.input.error {
    border-color: var(--color-error);
}

.input:disabled {
    background: var(--color-bg-light);
    opacity: 0.6;
    cursor: not-allowed;
}

.input-helper {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
}

.input-error {
    font-size: var(--text-xs);
    color: var(--color-error);
}

/* Input con Icono */
.input-with-icon {
    position: relative;
}

.input-icon {
    position: absolute;
    left: var(--space-3);
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-muted);
    font-size: 20px;
}

.input-with-icon .input {
    padding-left: var(--space-10);
}

/* Textarea */
.textarea {
    resize: vertical;
    min-height: 80px;
}

/* Select */
.select-wrapper {
    position: relative;
}

.select {
    appearance: none;
    padding-right: var(--space-10);
    cursor: pointer;
}

.select-arrow {
    position: absolute;
    right: var(--space-3);
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--color-text-muted);
}

/* Toggle Switch */
.toggle-input {
    display: none;
}

.toggle-switch {
    width: 48px;
    height: 28px;
    background: var(--color-border-light);
    border-radius: var(--radius-full);
    position: relative;
    cursor: pointer;
    transition: background 0.2s ease;
}

.toggle-switch::after {
    content: '';
    position: absolute;
    width: 22px;
    height: 22px;
    background: white;
    border-radius: 50%;
    top: 3px;
    left: 3px;
    transition: transform 0.2s ease;
    box-shadow: var(--shadow-sm);
}

.toggle-input:checked + .toggle-switch {
    background: var(--color-primary);
}

.toggle-input:checked + .toggle-switch::after {
    transform: translateX(20px);
}

/* Radio Button */
.radio-input {
    display: none;
}

.radio-circle {
    width: 20px;
    height: 20px;
    border: 2px solid var(--color-border-light);
    border-radius: 50%;
    position: relative;
    cursor: pointer;
    transition: border-color 0.2s ease;
}

.radio-circle::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background: var(--color-primary);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.2s ease;
}

.radio-input:checked + .radio-circle {
    border-color: var(--color-primary);
}

.radio-input:checked + .radio-circle::after {
    transform: translate(-50%, -50%) scale(1);
}

/* Checkbox */
.checkbox-input {
    display: none;
}

.checkbox-box {
    width: 22px;
    height: 22px;
    border: 2px solid var(--color-border-light);
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.check-icon {
    font-size: 16px;
    color: white;
    opacity: 0;
    transform: scale(0);
    transition: all 0.2s ease;
}

.checkbox-input:checked + .checkbox-box {
    background: var(--color-primary);
    border-color: var(--color-primary);
}

.checkbox-input:checked + .checkbox-box .check-icon {
    opacity: 1;
    transform: scale(1);
}
```

### 2.3 Tarjetas (Cards)

```html
<!-- ============================================
     TARJETAS - VARIANTES
     ============================================ -->

<!-- Card Neumórfica Oscura -->
<div class="card card-dark neu-flat">
    <div class="card-header">
        <h3 class="card-title">Toyota Corolla</h3>
        <span class="card-badge">Verificado</span>
    </div>
    <div class="card-body">
        <p class="card-subtitle">AB-123-CD • 4 Asientos</p>
        <div class="card-meta">
            <span class="meta-item">
                <span class="material-symbols-outlined">calendar_today</span>
                2024
            </span>
            <span class="meta-item">
                <span class="material-symbols-outlined">palette</span>
                Blanco
            </span>
        </div>
    </div>
    <div class="card-footer">
        <button class="btn btn-ghost btn-sm">Editar</button>
    </div>
</div>

<!-- Card de Viaje (Trip Card) -->
<div class="trip-card">
    <div class="trip-card-header">
        <div class="driver-avatar">
            <img src="/avatar.jpg" alt="Conductor">
            <span class="avatar-badge">4.8★</span>
        </div>
        <div class="driver-info">
            <h4 class="driver-name">Juan Pérez</h4>
            <p class="trip-route">
                <span class="route-point origin">
                    <span class="material-symbols-outlined">trip_origin</span>
                    Caracas
                </span>
                <span class="route-line"></span>
                <span class="route-point destination">
                    <span class="material-symbols-outlined">place</span>
                    Valencia
                </span>
            </p>
        </div>
    </div>
    <div class="trip-card-body">
        <div class="trip-details">
            <div class="detail-item">
                <span class="material-symbols-outlined">schedule</span>
                <span>08:30 AM</span>
            </div>
            <div class="detail-item">
                <span class="material-symbols-outlined">event</span>
                <span>Mar 15</span>
            </div>
            <div class="detail-item">
                <span class="material-symbols-outlined">airline_seat_recline_normal</span>
                <span>3 disponibles</span>
            </div>
        </div>
        <div class="trip-price">
            <span class="price-amount">$15</span>
            <span class="price-currency">USD</span>
            <span class="price-type">por asiento</span>
        </div>
    </div>
    <div class="trip-card-footer">
        <button class="btn btn-primary">Reservar</button>
    </div>
</div>

<!-- Card de Reserva (Booking Card) -->
<div class="booking-card status-pending">
    <div class="booking-status-badge">
        <span class="status-icon">hourglass_empty</span>
        <span class="status-text">Pendiente de Aprobación</span>
    </div>
    <div class="booking-content">
        <h4>Caracas → Maracay</h4>
        <p>2 asientos • $30 USD</p>
    </div>
    <div class="booking-actions">
        <button class="btn btn-outline btn-sm">Ver Detalles</button>
    </div>
</div>

<!-- Card de Pago (Payment Card) -->
<div class="payment-method-card selected">
    <div class="payment-icon">
        <span class="material-symbols-outlined">account_balance</span>
    </div>
    <div class="payment-info">
        <h4>Zelle</h4>
        <p>usuario@email.com</p>
    </div>
    <span class="payment-check material-symbols-outlined">check_circle</span>
</div>
```

```css
/* ============================================
   ESTILOS DE TARJETAS
   ============================================ */

.card {
    background: var(--color-bg-dark);
    border-radius: var(--radius-2xl);
    padding: var(--space-4);
    color: var(--color-text-inverse);
    transition: all 0.2s ease;
}

.card-dark {
    box-shadow: var(--shadow-flat-dark);
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-3);
}

.card-title {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
}

.card-badge {
    font-size: var(--text-xs);
    padding: var(--space-1) var(--space-2);
    background: var(--color-success-bg);
    color: var(--color-success);
    border-radius: var(--radius-full);
    font-weight: var(--font-medium);
}

.card-subtitle {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    margin-bottom: var(--space-2);
}

.card-meta {
    display: flex;
    gap: var(--space-4);
}

.meta-item {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
}

.meta-item .material-symbols-outlined {
    font-size: 14px;
}

/* Trip Card */
.trip-card {
    background: var(--color-bg-dark);
    border-radius: var(--radius-2xl);
    padding: var(--space-4);
    box-shadow: var(--shadow-flat-dark);
    transition: transform 0.2s ease;
}

.trip-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-float-dark);
}

.trip-card-header {
    display: flex;
    gap: var(--space-3);
    margin-bottom: var(--space-3);
}

.driver-avatar {
    position: relative;
    width: 48px;
    height: 48px;
    flex-shrink: 0;
}

.driver-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.avatar-badge {
    position: absolute;
    bottom: -4px;
    right: -4px;
    background: var(--color-success);
    color: white;
    font-size: 10px;
    font-weight: var(--font-bold);
    padding: 2px 6px;
    border-radius: var(--radius-full);
}

.driver-name {
    font-size: var(--text-base);
    font-weight: var(--font-semibold);
    margin-bottom: var(--space-1);
}

.trip-route {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
}

.route-point {
    display: flex;
    align-items: center;
    gap: var(--space-1);
}

.route-point .material-symbols-outlined {
    font-size: 14px;
    color: var(--color-primary);
}

.route-point.origin .material-symbols-outlined {
    color: var(--color-success);
}

.route-line {
    flex: 1;
    height: 1px;
    background: var(--color-border-dark);
    min-width: 20px;
}

.trip-details {
    display: flex;
    gap: var(--space-4);
    margin-bottom: var(--space-3);
}

.detail-item {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
}

.detail-item .material-symbols-outlined {
    font-size: 16px;
}

.trip-price {
    text-align: right;
}

.price-amount {
    font-size: var(--text-2xl);
    font-weight: var(--font-bold);
    color: var(--color-primary);
}

.price-currency {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
}

.price-type {
    display: block;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
}

/* Booking Card */
.booking-card {
    background: var(--color-bg-dark);
    border-radius: var(--radius-xl);
    padding: var(--space-4);
    border-left: 4px solid var(--color-border-dark);
}

.booking-card.status-pending {
    border-left-color: var(--color-warning);
}

.booking-card.status-approved {
    border-left-color: var(--color-success);
}

.booking-card.status-rejected,
.booking-card.status-cancelled {
    border-left-color: var(--color-error);
}

.booking-status-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-full);
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    margin-bottom: var(--space-2);
}

.status-pending .booking-status-badge {
    background: var(--color-warning-bg);
    color: var(--color-warning);
}

.status-approved .booking-status-badge {
    background: var(--color-success-bg);
    color: var(--color-success);
}

/* Payment Method Card */
.payment-method-card {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    background: var(--color-bg-dark);
    border-radius: var(--radius-xl);
    padding: var(--space-4);
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;
}

.payment-method-card:hover {
    border-color: var(--color-border-dark);
}

.payment-method-card.selected {
    border-color: var(--color-primary);
    background: var(--color-primary-alpha);
}

.payment-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-lg);
    background: var(--color-bg-elevated);
    display: flex;
    align-items: center;
    justify-content: center;
}

.payment-icon .material-symbols-outlined {
    font-size: 24px;
    color: var(--color-primary);
}

.payment-info {
    flex: 1;
}

.payment-info h4 {
    font-size: var(--text-base);
    font-weight: var(--font-semibold);
    margin-bottom: var(--space-1);
}

.payment-info p {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
}

.payment-check {
    color: var(--color-primary);
    font-size: 24px;
}
```

---

## 3. Patrones de Layout

### 3.1 Estructura Mobile-First

```html
<!-- ============================================
     LAYOUT BASE - MOBILE FIRST
     ============================================ -->

<!-- Contenedor Principal -->
<div class="app-container">
    
    <!-- Header Fijo -->
    <header class="app-header">
        <button class="header-back">
            <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 class="header-title">Crear Viaje</h1>
        <button class="header-action">
            <span class="material-symbols-outlined">notifications</span>
        </button>
    </header>
    
    <!-- Contenido Principal -->
    <main class="app-content">
        <div class="page-container">
            <!-- Progress Indicator -->
            <div class="progress-indicator">
                <div class="progress-step active">
                    <span class="step-number">1</span>
                    <span class="step-label">Ruta</span>
                </div>
                <div class="progress-line"></div>
                <div class="progress-step active">
                    <span class="step-number">2</span>
                    <span class="step-label">Horario</span>
                </div>
                <div class="progress-line"></div>
                <div class="progress-step">
                    <span class="step-number">3</span>
                    <span class="step-label">Precio</span>
                </div>
                <div class="progress-line"></div>
                <div class="progress-step">
                    <span class="step-number">4</span>
                    <span class="step-label">Revisar</span>
                </div>
            </div>
            
            <!-- Contenido de la Página -->
            <div class="page-section">
                <h2 class="section-title">¿A dónde vas?</h2>
                <!-- Componentes del formulario -->
            </div>
        </div>
    </main>
    
    <!-- Footer / Navigation -->
    <footer class="app-footer">
        <nav class="bottom-nav">
            <a href="#" class="nav-item active">
                <span class="material-symbols-outlined nav-icon">home</span>
                <span class="nav-label">Inicio</span>
            </a>
            <a href="#" class="nav-item">
                <span class="material-symbols-outlined nav-icon">search</span>
                <span class="nav-label">Buscar</span>
            </a>
            <a href="#" class="nav-item nav-item-add">
                <span class="material-symbols-outlined">add_circle</span>
            </a>
            <a href="#" class="nav-item">
                <span class="material-symbols-outlined nav-icon">history</span>
                <span class="nav-label">Viajes</span>
            </a>
            <a href="#" class="nav-item">
                <span class="material-symbols-outlined nav-icon">person</span>
                <span class="nav-label">Perfil</span>
            </a>
        </nav>
    </footer>
    
    <!-- Botón SOS Flotante -->
    <button class="btn-sos">
        <span class="material-symbols-outlined">emergency</span>
    </button>
    
</div>
```

```css
/* ============================================
   ESTILOS DE LAYOUT
   ============================================ */

.app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    max-width: 480px;
    margin: 0 auto;
    background: var(--color-bg-dark);
}

/* Header */
.app-header {
    position: sticky;
    top: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) var(--space-4);
    background: var(--color-bg-dark);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-back,
.header-action {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: var(--color-text-inverse);
    cursor: pointer;
    border-radius: var(--radius-lg);
}

.header-title {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--color-text-inverse);
}

/* Contenido Principal */
.app-content {
    flex: 1;
    padding-bottom: var(--space-20); /* Espacio para bottom nav */
}

.page-container {
    padding: var(--space-4);
}

/* Progress Indicator */
.progress-indicator {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-6);
}

.progress-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
}

.step-number {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--color-bg-elevated);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    transition: all 0.2s ease;
}

.progress-step.active .step-number {
    background: var(--color-primary);
    color: white;
}

.progress-step.completed .step-number {
    background: var(--color-success);
    color: white;
}

.step-label {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
}

.progress-step.active .step-label {
    color: var(--color-primary);
}

.progress-line {
    flex: 1;
    height: 2px;
    background: var(--color-border-dark);
    margin: 0 var(--space-2);
    margin-bottom: var(--space-5);
}

/* Bottom Navigation */
.app-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: 480px;
    margin: 0 auto;
    background: var(--color-bg-dark);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: var(--space-2) 0;
    padding-bottom: env(safe-area-inset-bottom, var(--space-2));
}

.bottom-nav {
    display: flex;
    align-items: center;
    justify-content: space-around;
}

.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-2);
    color: var(--color-text-muted);
    text-decoration: none;
    font-size: var(--text-xs);
    transition: color 0.2s ease;
    min-width: 60px;
}

.nav-item.active {
    color: var(--color-primary);
}

.nav-icon {
    font-size: 24px;
}

.nav-item-add {
    width: 56px;
    height: 56px;
    background: var(--color-primary);
    border-radius: 50%;
    margin-top: -20px;
    box-shadow: var(--shadow-primary);
    color: white;
}

.nav-item-add .material-symbols-outlined {
    font-size: 32px;
}
```

---

## 4. Estados y Feedback

### 4.1 Estados de Carga (Loading)

```html
<!-- Skeleton Loader -->
<div class="skeleton-card">
    <div class="skeleton skeleton-avatar"></div>
    <div class="skeleton-content">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
    </div>
</div>

<!-- Spinner -->
<div class="spinner-container">
    <div class="spinner"></div>
    <p class="spinner-text">Cargando...</p>
</div>

<!-- Shimmer Effect -->
<div class="shimmer-card">
    <div class="shimmer-content"></div>
</div>
```

```css
/* Skeleton */
.skeleton {
    background: linear-gradient(
        90deg,
        var(--color-bg-elevated) 25%,
        var(--color-bg-card) 50%,
        var(--color-bg-elevated) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: var(--radius-lg);
}

@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

.skeleton-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
}

.skeleton-title {
    height: 20px;
    width: 70%;
    margin-bottom: var(--space-2);
}

.skeleton-text {
    height: 14px;
    width: 50%;
}

/* Spinner */
.spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--color-border-dark);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.spinner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
}
```

### 4.2 Toast Notifications

```html
<!-- Toast Success -->
<div class="toast toast-success">
    <span class="toast-icon material-symbols-outlined">check_circle</span>
    <div class="toast-content">
        <h4 class="toast-title">¡Pago Confirmado!</h4>
        <p class="toast-message">Tu reserva ha sido confirmada.</p>
    </div>
    <button class="toast-close">
        <span class="material-symbols-outlined">close</span>
    </button>
</div>

<!-- Toast Error -->
<div class="toast toast-error">
    <span class="toast-icon material-symbols-outlined">error</span>
    <div class="toast-content">
        <h4 class="toast-title">Error de Conexión</h4>
        <p class="toast-message">No se pudo procesar tu solicitud.</p>
    </div>
    <button class="toast-close">
        <span class="material-symbols-outlined">close</span>
    </button>
</div>

<!-- Toast Warning -->
<div class="toast toast-warning">
    <span class="toast-icon material-symbols-outlined">warning</span>
    <div class="toast-content">
        <h4 class="toast-title">Reserva Pendiente</h4>
        <p class="toast-message">Tienes 24h para confirmar el pago.</p>
    </div>
</div>
```

```css
/* Toast */
.toast {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    padding: var(--space-4);
    background: var(--color-bg-card);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    max-width: 360px;
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.toast-icon {
    font-size: 24px;
    flex-shrink: 0;
}

.toast-success .toast-icon { color: var(--color-success); }
.toast-error .toast-icon { color: var(--color-error); }
.toast-warning .toast-icon { color: var(--color-warning); }

.toast-content {
    flex: 1;
}

.toast-title {
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    margin-bottom: var(--space-1);
}

.toast-message {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
}

.toast-close {
    background: transparent;
    border: none;
    color: var(--color-text-muted);
    cursor: pointer;
    padding: 0;
}
```

### 4.3 Modales

```html
<!-- Modal Base -->
<div class="modal-overlay">
    <div class="modal">
        <div class="modal-header">
            <h3 class="modal-title">Confirmar Reserva</h3>
            <button class="modal-close">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        <div class="modal-body">
            <p>¿Estás seguro de que deseas aprobar esta reserva?</p>
        </div>
        <div class="modal-footer">
            <button class="btn btn-ghost">Cancelar</button>
            <button class="btn btn-primary">Confirmar</button>
        </div>
    </div>
</div>

<!-- Modal de Pago -->
<div class="modal-payment">
    <div class="payment-qr">
        <!-- QR Code -->
    </div>
    <div class="payment-details">
        <h4>Monto a Pagar</h4>
        <p class="payment-amount">$30.00 USD</p>
    </div>
    <div class="payment-methods">
        <div class="payment-method-option">
            <span class="material-symbols-outlined">smartphone</span>
            <span>Zelle</span>
        </div>
    </div>
</div>
```

```css
/* Modal */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: var(--space-4);
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.modal {
    background: var(--color-bg-dark);
    border-radius: var(--radius-2xl);
    width: 100%;
    max-width: 400px;
    max-height: 90vh;
    overflow-y: auto;
    animation: scaleIn 0.2s ease;
}

@keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-title {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
}

.modal-close {
    background: transparent;
    border: none;
    color: var(--color-text-muted);
    cursor: pointer;
    padding: var(--space-2);
}

.modal-body {
    padding: var(--space-4);
}

.modal-footer {
    display: flex;
    gap: var(--space-3);
    padding: var(--space-4);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-footer .btn {
    flex: 1;
}
```

---

## 5. Componentes de Negocio

### 5.1 Estado de Reserva

```html
<!-- Estados de Reserva -->

<!-- Pending (Pendiente) -->
<div class="status-badge status-pending">
    <span class="material-symbols-outlined">hourglass_empty</span>
    <span>Pendiente</span>
</div>

<!-- Approved (Aprobada) -->
<div class="status-badge status-approved">
    <span class="material-symbols-outlined">check_circle</span>
    <span>Aprobada</span>
</div>

<!-- Payment Validation (Validando Pago) -->
<div class="status-badge status-payment">
    <span class="material-symbols-outlined">verified</span>
    <span>Validando Pago</span>
</div>

<!-- Paid (Pagada) -->
<div class="status-badge status-paid">
    <span class="material-symbols-outlined">payments</span>
    <span>Pagada</span>
</div>

<!-- In Progress (En Viaje) -->
<div class="status-badge status-progress">
    <span class="material-symbols-outlined">directions_car</span>
    <span>En Viaje</span>
</div>

<!-- Completed (Completada) -->
<div class="status-badge status-completed">
    <span class="material-symbols-outlined">task_alt</span>
    <span>Completada</span>
</div>

<!-- Cancelled (Cancelada) -->
<div class="status-badge status-cancelled">
    <span class="material-symbols-outlined">cancel</span>
    <span>Cancelada</span>
</div>
```

```css
/* Status Badges */
.status-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-full);
    font-size: var(--text-xs);
    font-weight: var(--font-semibold);
}

.status-badge .material-symbols-outlined {
    font-size: 16px;
}

.status-pending {
    background: var(--color-warning-bg);
    color: var(--color-warning);
}

.status-approved {
    background: var(--color-info-bg);
    color: var(--color-info);
}

.status-payment {
    background: rgba(139, 92, 246, 0.15);
    color: #8B5CF6;
}

.status-paid,
.status-completed {
    background: var(--color-success-bg);
    color: var(--color-success);
}

.status-cancelled {
    background: var(--color-error-bg);
    color: var(--color-error);
}

.status-progress {
    background: rgba(99, 102, 241, 0.15);
    color: #6366F1;
}
```

### 5.2 Stepper de Creación de Viaje

```html
<!-- Stepper de 4 Pasos -->
<div class="create-trip-stepper">
    <!-- Paso 1: Ruta -->
    <div class="stepper-step completed">
        <div class="stepper-indicator">
            <span class="material-symbols-outlined">check</span>
        </div>
        <div class="stepper-content">
            <span class="stepper-label">Ruta</span>
            <span class="stepper-sublabel">Caracas → Valencia</span>
        </div>
    </div>
    
    <!-- Paso 2: Horario -->
    <div class="stepper-step active">
        <div class="stepper-indicator">2</div>
        <div class="stepper-content">
            <span class="stepper-label">Horario</span>
            <span class="stepper-sublabel">Mañana 8:00 AM</span>
        </div>
    </div>
    
    <!-- Paso 3: Precio -->
    <div class="stepper-step">
        <div class="stepper-indicator">3</div>
        <div class="stepper-content">
            <span class="stepper-label">Precio</span>
        </div>
    </div>
    
    <!-- Paso 4: Revisar -->
    <div class="stepper-step">
        <div class="stepper-indicator">4</div>
        <div class="stepper-content">
            <span class="stepper-label">Revisar</span>
        </div>
    </div>
</div>
```

```css
/* Stepper */
.create-trip-stepper {
    display: flex;
    flex-direction: column;
    gap: 0;
}

.stepper-step {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    padding: var(--space-3) 0;
    position: relative;
}

.stepper-step:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 19px;
    top: 52px;
    bottom: -8px;
    width: 2px;
    background: var(--color-border-dark);
}

.stepper-step.completed:not(:last-child)::after {
    background: var(--color-success);
}

.stepper-indicator {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-elevated);
    color: var(--color-text-muted);
    font-weight: var(--font-semibold);
    flex-shrink: 0;
    position: relative;
    z-index: 1;
}

.stepper-step.completed .stepper-indicator {
    background: var(--color-success);
    color: white;
}

.stepper-step.active .stepper-indicator {
    background: var(--color-primary);
    color: white;
}

.stepper-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    padding-top: var(--space-2);
}

.stepper-label {
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    color: var(--color-text-inverse);
}

.stepper-sublabel {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
}
```

---

## 6. Responsive Breakpoints

```css
/* ============================================
   BREAKPOINTS
   ============================================ */

/* Mobile (default) */
:root {
    --container-max: 480px;
}

/* Tablet */
@media (min-width: 768px) {
    :root {
        --container-max: 720px;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    :root {
        --container-max: 960px;
    }
    
    /* Layout de 2 columnas para desktop */
    .app-layout {
        display: grid;
        grid-template-columns: 280px 1fr;
    }
}

/* Large Desktop */
@media (min-width: 1280px) {
    :root {
        --container-max: 1200px;
    }
}
```

---

## Resumen de Componentes

| Categoría | Componentes |
|-----------|-------------|
| **Botones** | Primary, Secondary, Outline, Ghost, Danger, Success, SOS Flotante |
| **Inputs** | Text, Email, Tel, Password, Select, Textarea, Toggle, Radio, Checkbox |
| **Tarjetas** | Card Dark, Trip Card, Booking Card, Payment Card |
| **Layout** | Header, Footer/Nav, Page Container, Progress Indicator |
| **Feedback** | Toast (Success/Error/Warning), Modal, Skeleton, Spinner |
| **Estados** | Badges de estado, Stepper, Progress Bar |
| **Negocio** | Trip Card, Booking Card, Payment Method Card |

¿Necesitas que agregue algún componente específico o que expanda alguna sección?
