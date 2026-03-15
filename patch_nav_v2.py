"""
VAMOSapp - Full Comprehensive Patcher v2
=========================================
1. Translate ALL English text → Spanish across all screens
2. Replace English/gringo names with Latin names  
3. Wire EVERY button/link by DOM position + class matching (not just text)
4. Language toggle: default ES, EN optional
5. Remove bilingual "/en English" text, show only Spanish
"""

import os, re

BASE = r"e:\MIS DOCUMENTOS\1. A PAGINAS WEB\VAMOSapp"

# ── Screen map ──────────────────────────────────────────────────────────────
S = {
    'login':           'login___sign_up.html',
    'home':            'home__biling_e_venezuela.html',
    'dashboard':       'main_dashboard.html',
    'dashboard_ve':    'dashboard__biling_e_venezuela.html',
    'create_route':    'create_ride_-_route__biling_e.html',
    'create_schedule': 'create_ride_-_schedule__biling_e.html',
    'create_pricing':  'create_ride_-_pricing__biling_e.html',
    'create_review':   'create_ride_-_review__biling_e.html',
    'matching':        'ride_matching__biling_e.html',
    'tracking':        'live_tracking__biling_e.html',
    'ride_review':     'ride_review__biling_e.html',
    'history':         'ride_history__biling_e.html',
    'profile':         'user_profile___settings__biling_e.html',
    'kyc':             'kyc_verification__biling_e_venezuela.html',
    'vehicles':        'vehicle_management__biling_e.html',
    'wallet':          'wallet__biling_e.html',
    'payments':        'payment_methods__biling_e_venezuela.html',
    'chat':            'chat_interface__biling_e.html',
    'notifications':   'notifications__biling_e.html',
    'refer':           'refer_a_friend__biling_e.html',
    'sos':             'sos_alert__biling_e_venezuela.html',
    'how':             'how_it_works__biling_e.html',
    'faq':             'faq___preguntas_frecuentes__biling_e.html',
}

# ── English → Spanish text replacements ────────────────────────────────────
# Order matters: longer phrases first to avoid partial replacement
TRANSLATIONS = [
    # App labels
    ('Vamos - Premium Carpooling', 'Vamos - Carpooling Premium'),
    ('Vamos - Passenger Dashboard', 'Vamos - Panel de Pasajero'),
    ('Elevate Your Commute', 'Eleva tu Trayecto'),
    ('Premium carpooling for the modern professional.', 'Carpooling premium para el profesional moderno.'),
    ('Ready for your next journey?', '¿Listo para tu próximo viaje?'),
    
    # Buttons / Actions
    ('Find a Ride', 'Buscar un Viaje'),
    ('Offer a Ride', 'Ofrecer un Viaje'),
    ('Search for premium routes', 'Rutas premium disponibles'),
    ('Share your journey and save', 'Comparte tu ruta y ahorra'),
    ('Activate Now', 'Activar Ahora'),
    ('View All', 'Ver Todos'),
    ('See all', 'Ver todos'),
    ('See All', 'Ver Todos'),
    ('Available nearby', 'Disponibles cerca'),
    ('Available Now', 'Disponible Ahora'),
    ('Login\n', 'Iniciar Sesión\n'),
    ('Login\r', 'Iniciar Sesión\r'),
    ('>Login<', '>Iniciar Sesión<'),
    ("Don't have an account?", '¿No tienes cuenta?'),
    ('Sign Up', 'Registrarse'),
    ('Forgot?', '¿Olvidaste?'),
    ('Phone Number', 'Número de Teléfono'),
    ('Password', 'Contraseña'),
    ('Secure OTP verification via Twilio', 'Verificación OTP segura'),
    ('Where are we going?', '¿A dónde vamos?'),
    
    # Navigation labels
    ('Home', 'Inicio'),
    ('Search', 'Buscar'),
    ('Rides', 'Viajes'),
    ('Profile', 'Perfil'),
    ('Explore', 'Explorar'),
    ('My Trips', 'Mis Viajes'),
    ('Wallet', 'Billetera'),
    ('Settings', 'Configuración'),
    ('Chat', 'Mensajes'),
    ('Notifications', 'Notificaciones'),
    
    # Ride flow
    ('Set Route / Establecer Ruta', 'Establecer Ruta'),
    ('Set Route', 'Establecer Ruta'),
    ('Step 1 of 4', 'Paso 1 de 4'),
    ('Step 2 of 4', 'Paso 2 de 4'),
    ('Step 3 of 4', 'Paso 3 de 4'),
    ('Step 4 of 4', 'Paso 4 de 4'),
    ('Origin / Origen', 'Origen'),
    ('Destination / Destino', 'Destino'),
    ('Start location', 'Lugar de inicio'),
    ('Where to?', '¿A dónde?'),
    ('Add Stopover / Agregar Parada', 'Agregar Parada'),
    ('Route Preview', 'Vista Previa de Ruta'),
    ('Total Distance', 'Distancia Total'),
    ('Next / Siguiente', 'Siguiente'),
    ('Next', 'Siguiente'),
    ('Confirm', 'Confirmar'),
    ('Confirm Ride', 'Confirmar Viaje'),
    ('Schedule / Horario', 'Horario'),
    ('Departure Date / Fecha de Salida', 'Fecha de Salida'),
    ('Departure Time / Hora de Salida', 'Hora de Salida'),
    ('Seats Available / Asientos', 'Asientos Disponibles'),
    ('Recurring Trip?', '¿Viaje Recurrente?'),
    ('Price per Seat / Precio por Asiento', 'Precio por Asiento'),
    ('Suggested price', 'Precio sugerido'),
    ('Set your price', 'Establecer precio'),
    ('Review & Confirm / Revisar', 'Revisar y Confirmar'),
    ('Offer Ride', 'Publicar Viaje'),
    ('Finding your driver...', 'Buscando tu conductor...'),
    ('Ride Matching', 'Buscando Conductor'),
    ('Live Tracking', 'Seguimiento en Vivo'),
    ('Track Ride', 'Seguir Viaje'),
    ('Rate your ride', 'Califica tu viaje'),
    ('Leave a review', 'Dejar una reseña'),
    ('Done', 'Finalizar'),
    ('Back to Home', 'Volver al Inicio'),
    ('Finish', 'Finalizar'),
    ('Submit Review', 'Enviar Reseña'),
    ('Submit', 'Enviar'),
    
    # Ride/Trip content
    ('Downtown to Tech Hub', 'Altamira a Las Mercedes'),
    ('Departs in 15 mins', 'Sale en 15 min'),
    ('Departs in', 'Sale en'),
    ('Available Seats', 'Asientos Disponibles'),
    ('Weekend Offer', 'Oferta de Fin de Semana'),
    ('Get 20% off your first night ride', 'Obtén 20% off en tu primer viaje nocturno'),
    ('2 MIN AWAY', '2 MIN'),
    ('5 MIN AWAY', '5 MIN'),
    
    # Trust badges
    ('Verified Users', 'Usuarios Verificados'),
    ('Secure Pay', 'Pago Seguro'),
    ('Carbon Low', 'Bajo Carbono'),
    ('VERIFIED', 'VERIFICADO'),
    
    # Profile screen
    ('Personal Information', 'Información Personal'),
    ('My Vehicles / Mis Vehículos', 'Mis Vehículos'),
    ('My Vehicles', 'Mis Vehículos'),
    ('Verification Status', 'Estado de Verificación'),
    ('VERIFIED / VERIFICADO', 'VERIFICADO'),
    ('Payment Methods\n', 'Métodos de Pago\n'),
    ('Payment Methods\r', 'Métodos de Pago\r'),
    ('Payment Methods<', 'Métodos de Pago<'),
    ('App Settings / Configuración', 'Configuración de la App'),
    ('App Settings', 'Configuración de la App'),
    ('Language, Notifications, Dark Mode', 'Idioma, Notificaciones, Modo Oscuro'),
    ('Help & Support', 'Ayuda y Soporte'),
    ('Help Center', 'Centro de Ayuda'),
    ('Verified Member', 'Miembro Verificado'),
    ('Verified Member / Miembro Verificado', 'Miembro Verificado'),
    ('Refer a Friend', 'Referir un Amigo'),
    ('Refer & Earn', 'Refiere y Gana'),
    ('Log Out', 'Cerrar Sesión'),
    ('Logout', 'Cerrar Sesión'),
    ('Edit Profile', 'Editar Perfil'),
    
    # KYC
    ('Identity Verification', 'Verificación de Identidad'),
    ('Upload ID', 'Subir Cédula'),
    ('Upload Document', 'Subir Documento'),
    ('Take Selfie', 'Tomar Selfie'),
    ('Submit Verification', 'Enviar Verificación'),
    ('Pending Review', 'En Revisión'),
    ('Upload your ID', 'Sube tu cédula de identidad'),
    
    # Wallet
    ('Add Money', 'Agregar Saldo'),
    ('Withdraw', 'Retirar'),
    ('Send Money', 'Enviar Dinero'),
    ('Transaction History', 'Historial de Transacciones'),
    ('Recent Transactions', 'Transacciones Recientes'),
    ('Add Payment Method', 'Agregar Método de Pago'),
    ('Add Card', 'Agregar Tarjeta'),
    ('Debit/Credit Card', 'Tarjeta de Débito/Crédito'),
    ('Mobile Wallet', 'Billetera Móvil'),
    
    # Chat
    ('Message', 'Mensaje'),
    ('Type a message...', 'Escribe un mensaje...'),
    
    # SOS
    ('Emergency Alert', 'Alerta de Emergencia'),
    ('Send SOS', 'Enviar SOS'),
    ('Cancel', 'Cancelar'),
    ('Call Police', 'Llamar a la Policía'),
    ('Share Location', 'Compartir Ubicación'),
    
    # Notifications
    ('Mark all as read', 'Marcar todo como leído'),
    ('No notifications', 'Sin notificaciones'),
    ('New ride request', 'Nueva solicitud de viaje'),
    
    # Vehicle management
    ('Add Vehicle', 'Agregar Vehículo'),
    ('My Vehicles', 'Mis Vehículos'),
    ('License Plate', 'Placa'),
    ('Vehicle Type', 'Tipo de Vehículo'),
    ('Vehicle Year', 'Año del Vehículo'),
    ('Save', 'Guardar'),
    ('Delete', 'Eliminar'),
    ('Edit', 'Editar'),
    
    # How it works
    ('How It Works', 'Cómo Funciona'),
    ('Get Started', 'Comenzar'),
    ('Learn More', 'Saber Más'),
    
    # FAQ
    ('Frequently Asked Questions', 'Preguntas Frecuentes'),
    ('Still have questions?', '¿Aún tienes preguntas?'),
    ('Contact Support', 'Contactar Soporte'),
    
    # Refer
    ('Invite Friends', 'Invitar Amigos'),
    ('Share your code', 'Comparte tu código'),
    ('Copy Code', 'Copiar Código'),
    ('Share', 'Compartir'),
    ('Earn rewards', 'Gana recompensas'),
    
    # History
    ('Ride History', 'Historial de Viajes'),
    ('Completed', 'Completado'),
    ('Cancelled', 'Cancelado'),
    ('Pending', 'Pendiente'),
    ('In Progress', 'En progreso'),
    ('Rate Driver', 'Calificar Conductor'),
    ('Book Again', 'Viajar de Nuevo'),
    
    # Dashboard
    ('Standard', 'Estándar'),
    ('Eco', 'Eco'),
    ('Carpool', 'Compartido'),
    ('Luxury', 'Lujo'),
    
    # Generic
    ('No results found', 'Sin resultados'),
    ('Loading...', 'Cargando...'),
    ('Back', 'Atrás'),
]

# ── English/Gringo name → Latin name replacements ──────────────────────────
NAME_REPLACEMENTS = [
    # Main Drivers / Passengers  
    ('Alex Johnson', 'Alejandro Medina'),
    ('Sarah Williams', 'Sofía Rodríguez'),
    ('Michael Scott', 'Miguel Torres'),
    ('John Doe', 'José García'),
    ('Jane Doe', 'María García'),
    ('David Chen', 'Daniel Chávez'),
    ('Emily Davis', 'Emilia Díaz'),
    ('Robert Smith', 'Roberto Suárez'),
    ('Lisa Rodriguez', 'Lisandra Romero'),
    ('James Wilson', 'Javier Vargas'),
    ('Maria Alejandra G.', 'María Alejandra G.'),  # keep, already Latin
    ('Carlos M.', 'Carlos M.'),  # keep
    ('Pedro R.', 'Pedro R.'),   # keep
    # Toyota stays, it's a brand
    ('Alex J.', 'Alejandro M.'),
    ('Sarah W.', 'Sofía R.'),
    ('Mike C.', 'Miguel C.'),
    # City references - keep Caracas
]

# ── Per-file specific button wiring ─────────────────────────────────────────
# Each entry: file → list of (css_selector, destination_key)
# These are injected as targeted onclick handlers by index or class
FILE_NAV_RULES = {
    'home__biling_e_venezuela.html': [
        # 1st big button = Buscar Viaje
        ('main button:nth-child(1)', 'dashboard'),
        # 2nd big button = Ofrecer Viaje  
        ('main button:nth-child(2)', 'create_route'),
        # "Ver todos" link
        ('a[href="#"]', 'dashboard'),
    ],
    'index.html': [],  # SPA shell, don't touch
    'main_dashboard.html': [
        # Search bar area → create route
        ('.neu-pressed input', None),
        # Driver card 1 → tracking
        ('.neu-flat:nth-of-type(3)', 'matching'),
        ('.neu-flat:nth-of-type(4)', 'matching'),
        # "Activate Now" promo button → payments
        ('.bg-primary.text-white.px-4', 'payments'),
        # View All
        ('.text-primary.text-sm.font-semibold', 'history'),
    ],
    'dashboard__biling_e_venezuela.html': [
        ('.text-primary.font-semibold', 'history'),
    ],
    'login___sign_up.html': [
        # Login button
        ('button.w-full', 'home'),
        # Sign up link
        ('a.text-primary.font-bold', 'kyc'),
    ],
    'create_ride_-_route__biling_e.html': [
        # Next button
        ('.neumorphic-button-primary', 'create_schedule'),
        ('button.flex-\\[2\\]', 'create_schedule'),
    ],
    'create_ride_-_schedule__biling_e.html': [
        ('.neumorphic-button-primary', 'create_pricing'),
    ],
    'create_ride_-_pricing__biling_e.html': [
        ('.neumorphic-button-primary', 'create_review'),
    ],
    'create_ride_-_review__biling_e.html': [
        ('.neumorphic-button-primary', 'matching'),
        ('button[class*="primary"]', 'matching'),
    ],
    'ride_matching__biling_e.html': [
        # Accept / Track button → tracking
        ('button[class*="primary"]', 'tracking'),
        ('.bg-primary', 'tracking'),
    ],
    'live_tracking__biling_e.html': [
        # Chat with driver
        ('button[class*="chat"], button[class*="message"]', 'chat'),
        # SOS floating
        ('[class*="bg-red"]', 'sos'),
        # Complete/rate ride
        ('.bg-primary', 'ride_review'),
    ],
    'ride_review__biling_e.html': [
        # Submit review → home
        ('button[class*="primary"]', 'home'),
        ('.bg-primary', 'home'),
    ],
    'ride_history__biling_e.html': [
        # Rate driver for each card  
        ('button[class*="primary"]', 'ride_review'),
    ],
    'user_profile___settings__biling_e.html': [
        # Personal Info row
        ('a[href="#"]:nth-of-type(1)', 'kyc'),
        # My Vehicles row
        ('a[href="#"]:nth-of-type(2)', 'vehicles'),
        # Payment Methods row
        ('a[href="#"]:nth-of-type(3)', 'payments'),
        # Refer a Friend
        ('a[href="#"]:nth-of-type(4)', 'refer'),
        # Help
        ('a[href="#"]:nth-of-type(5)', 'how'),
        # Log out – goes to login
        ('button[class*="red"], .text-red', 'login'),
    ],
    'wallet__biling_e.html': [
        # Add Money
        ('button[class*="primary"], .bg-primary', 'payments'),
        # Withdraw
        ('button:nth-of-type(2)', 'payments'),
        # Send
        ('button:nth-of-type(3)', 'payments'),
    ],
    'payment_methods__biling_e_venezuela.html': [
        ('button[class*="primary"], .bg-primary', 'wallet'),
    ],
    'chat_interface__biling_e.html': [
        # Send button
        ('button[class*="primary"], button[class*="send"], [class*="send"]', 'chat'),
    ],
    'notifications__biling_e.html': [],
    'sos_alert__biling_e_venezuela.html': [
        # Cancel → back home
        ('button[class*="outline"], [class*="border-primary"]', 'home'),
    ],
    'how_it_works__biling_e.html': [
        # Get started
        ('button[class*="primary"], .bg-primary', 'home'),
    ],
    'faq___preguntas_frecuentes__biling_e.html': [
        # Contact support
        ('button[class*="primary"], .bg-primary', 'chat'),
    ],
    'refer_a_friend__biling_e.html': [
        ('button[class*="primary"], .bg-primary', 'refer'),
    ],
    'kyc_verification__biling_e_venezuela.html': [
        ('button[class*="primary"], .bg-primary', 'profile'),
    ],
    'vehicle_management__biling_e.html': [
        ('button[class*="primary"], .bg-primary', 'vehicles'),
    ],
}

# ── Complete navigation injection script ────────────────────────────────────
NAV_SCRIPT_TEMPLATE = r"""
<script id="vamos-nav-v2">
(function(){
  var PAGE = "##PAGE##";
  var S = ##SCREENS##;

  function go(key){ var t = S[key]||key; if(window.parent!==window){ window.parent.postMessage({nav:t},'*'); } else { window.location.href=t; } }
  function back(){ if(window.parent!==window){ window.parent.postMessage({back:true},'*'); } else { window.history.back(); } }

  function wire(){
    // ─── 1. Back buttons ───────────────────────────────────────
    document.querySelectorAll('button').forEach(function(b){
      var ic = b.querySelector('[class*="material"]');
      if(ic && /arrow_back|chevron_left|arrow_back_ios/.test(ic.textContent.trim())){
        b.style.cursor='pointer';
        b.onclick=function(e){e.stopPropagation();back();};
      }
    });

    // ─── 2. SOS floating red button ────────────────────────────
    document.querySelectorAll('[class*="bg-red-"], [class*="red-600"]').forEach(function(el){
      el.style.cursor='pointer';
      el.onclick=function(e){e.stopPropagation();go('sos');};
    });

    // ─── 3. Notification bell in header ────────────────────────
    document.querySelectorAll('header button, header [role="button"]').forEach(function(b){
      var ic = b.querySelector('[class*="material"]');
      if(ic && ic.textContent.trim()==='notifications'){
        b.style.cursor='pointer';
        b.onclick=function(e){e.stopPropagation();go('notifications');};
      }
    });

    // ─── 4. Profile avatar in header ──────────────────────────
    document.querySelectorAll('header img[alt*="rofile"], header img[alt*="User"]').forEach(function(img){
      var wrap = img.parentElement;
      if(wrap){ wrap.style.cursor='pointer'; wrap.onclick=function(e){e.stopPropagation();go('profile');}; }
    });

    // ─── 5. Bottom navigation by icon ─────────────────────────
    var navMap = {
      'home':'home','explore':'home','inicio':'home',
      'search':'dashboard','buscar':'dashboard','near_me':'dashboard',
      'directions_car':'history','route':'history','viajes':'history',
      'payments':'wallet','billetera':'wallet','account_balance_wallet':'wallet',
      'person':'profile','perfil':'profile','account_circle':'profile',
      'notifications':'notifications',
      'chat':'chat','message':'chat','forum':'chat',
      'settings':'profile','tune':'profile',
      'add_circle':'create_route','add':'create_route',
    };
    document.querySelectorAll('nav a, nav button, [class*="bottom"] a').forEach(function(el){
      var ico = el.querySelector('[class*="material"]');
      var txt = (el.textContent||'').trim().toLowerCase().replace(/\s+/g,' ');
      var icon = ico ? ico.textContent.trim() : '';
      var key = navMap[icon] || navMap[txt];
      if(!key){
        // fuzzy match on label text
        if(/inicio|home/.test(txt)) key='home';
        else if(/buscar|search/.test(txt)) key='dashboard';
        else if(/viajes|rides|trips/.test(txt)) key='history';
        else if(/billetera|wallet/.test(txt)) key='wallet';
        else if(/perfil|profile/.test(txt)) key='profile';
        else if(/notif/.test(txt)) key='notifications';
        else if(/mensajes|chat/.test(txt)) key='chat';
        else if(/configur|settings/.test(txt)) key='profile';
        else if(/crear|create|add/.test(txt)) key='create_route';
        else if(/explorar|explore/.test(txt)) key='home';
        else if(/historial|history/.test(txt)) key='history';
      }
      if(key){
        el.setAttribute('href','javascript:void(0)');
        el.style.cursor='pointer';
        (function(k){ el.onclick=function(e){e.preventDefault();e.stopPropagation();go(k);}; })(key);
      }
    });

    // ─── 6. Per-page specific button rules ─────────────────────
    var rules = ##RULES##;
    rules.forEach(function(r){
      try {
        document.querySelectorAll(r[0]).forEach(function(el){
          if(r[1]===null) return; // input fields etc., skip
          el.style.cursor='pointer';
          (function(k){ el.onclick=function(e){e.stopPropagation();go(k);}; })(r[1]);
        });
      } catch(x){}
    });

    // ─── 7. Generic CTA button wiring by text ─────────────────
    var textMap = [
      [/^(buscar un viaje|buscar viaje|find a ride)$/i, 'dashboard'],
      [/^(ofrecer un viaje|ofrecer viaje|offer a ride|crear viaje)$/i, 'create_route'],
      [/^(iniciar sesi[oó]n|login|sign in|entrar)$/i, 'home'],
      [/^(registrarse|sign up|crear cuenta)$/i, 'kyc'],
      [/^(siguiente|next)$/i, (function(){ 
        if(PAGE.indexOf('route')>-1)    return 'create_schedule';
        if(PAGE.indexOf('schedule')>-1) return 'create_pricing';
        if(PAGE.indexOf('pric')>-1)     return 'create_review';
        if(PAGE.indexOf('review')>-1 && PAGE.indexOf('ride_review')===-1) return 'matching';
        return 'home';
      })()],
      [/^(confirmar|confirmar viaje|confirm ride|confirm)$/i, 'matching'],
      [/^(seguir viaje|track ride|track|seguir)$/i, 'tracking'],
      [/^(calificar|rate|calificar conductor|rate driver)$/i, 'ride_review'],
      [/^(finalizar|done|finish|enviar rese[nñ]a|submit review)$/i, 'home'],
      [/^(ver todos|see all|ver todo)$/i, 'dashboard'],
      [/^(activar ahora|activate now)$/i, 'payments'],
      [/^(agregar saldo|add money)$/i, 'payments'],
      [/^(retirar|withdraw)$/i, 'payments'],
      [/^(enviar dinero|send money)$/i, 'payments'],
      [/^(agregar m[eé]todo de pago|add payment method|add card)$/i, 'payments'],
      [/^(billetera|wallet)$/i, 'wallet'],
      [/^(verificar|verify|completar kyc)$/i, 'kyc'],
      [/^(historial|ride history|ver historial)$/i, 'history'],
      [/^(mis veh[ií]culos|my vehicles|agregar veh[ií]culo|add vehicle)$/i, 'vehicles'],
      [/^(cerrar sesi[oó]n|log out|logout)$/i, 'login'],
      [/^(editar perfil|edit profile)$/i, 'profile'],
      [/^(alerta sos|send sos|enviar sos)$/i, 'sos'],
      [/^(compartir ubicaci[oó]n|share location)$/i, 'sos'],
      [/^(compartir|share)$/i, 'refer'],
      [/^(copiar c[oó]digo|copy code)$/i, 'refer'],
      [/^(referir un amigo|refer a friend|invitar amigos|invite friends)$/i, 'refer'],
      [/^(mensajes|chat)$/i, 'chat'],
      [/^(notificaciones|notifications)$/i, 'notifications'],
      [/^(c[oó]mo funciona|how it works|comenzar|get started)$/i, 'how'],
      [/^(preguntas frecuentes|faq)$/i, 'faq'],
      [/^(contactar soporte|contact support)$/i, 'chat'],
      [/^(volver al inicio|back to home)$/i, 'home'],
      [/^(cancelar|cancel)$/i, 'home'],
      [/^(guardar|save)$/i, 'profile'],
      [/^(publicar viaje|offer ride)$/i, 'matching'],
      [/^(viajar de nuevo|book again)$/i, 'dashboard'],
      [/información personal/i, 'profile'],
      [/mis vehículos/i, 'vehicles'],
      [/estado de verificaci/i, 'kyc'],
      [/métodos de pago/i, 'payments'],
      [/configuración de la app/i, 'profile'],
      [/ayuda y soporte/i, 'how'],
      [/referir un amigo/i, 'refer'],
      [/marcar todo como le[ií]do/i, 'notifications'],
      [/mensaje a conductor/i, 'chat'],
    ];

    document.querySelectorAll('button, a').forEach(function(el){
      // Skip nav elements already handled
      if(el.closest('nav')) return;
      var txt = (el.textContent||'').trim().replace(/\s+/g,' ');
      for(var i=0;i<textMap.length;i++){
        if(textMap[i][0].test(txt)){
          var k = textMap[i][1];
          el.setAttribute('href','javascript:void(0)');
          el.style.cursor='pointer';
          (function(key){ el.onclick=function(e){e.preventDefault();e.stopPropagation();go(key);}; })(k);
          break;
        }
      }
    });

    // ─── 8. Language toggle: ES|EN button ─────────────────────
    document.querySelectorAll('button').forEach(function(b){
      var t = (b.textContent||'').trim();
      if(t==='ES | EN' || (t.indexOf('ES')>-1 && t.indexOf('EN')>-1)){
        b.onclick=function(e){
          e.stopPropagation();
          alert('Opciones de idioma: actualmente Español');
        };
      }
    });

    // ─── 9. "Viajes Cercanos" card → dashboard ──────────────────
    document.querySelectorAll('[class*="neumorph-card"], [class*="neu-flat"]').forEach(function(card){
      var isNav = card.closest('nav') || card.closest('header');
      if(isNav) return;
      var txt = (card.textContent||'').toLowerCase();
      if(txt.indexOf('altamira')>-1 || txt.indexOf('min away')>-1 || txt.indexOf('disponible ahora')>-1){
        card.style.cursor='pointer';
        card.onclick=function(e){
          if(e.target.tagName==='BUTTON' || e.target.tagName==='A') return;
          go('matching');
        };
      }
      if(txt.indexOf('alejandro medina')>-1 || txt.indexOf('sofía rodríguez')>-1){
        card.style.cursor='pointer';
        card.onclick=function(e){
          if(e.target.tagName==='BUTTON' || e.target.tagName==='A') return;
          go('matching');
        };
      }
    });
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',wire);
  } else { wire(); }
})();
</script>
"""

import json

def build_nav_script(filename):
    rules = FILE_NAV_RULES.get(filename, [])
    rules_json = json.dumps(rules)
    screens_json = json.dumps(S)
    script = NAV_SCRIPT_TEMPLATE
    script = script.replace('##PAGE##', filename)
    script = script.replace('##SCREENS##', screens_json)
    script = script.replace('##RULES##', rules_json)
    return script

def apply_translations(content):
    for en, es in TRANSLATIONS:
        content = content.replace(en, es)
    for eng_name, lat_name in NAME_REPLACEMENTS:
        content = content.replace(eng_name, lat_name)
    return content

def patch_file(fname):
    fpath = os.path.join(BASE, fname)
    with open(fpath, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    # 1. Remove old patches
    content = re.sub(r'<!-- VAMOS NAV PATCH -->.*?<!-- /VAMOS NAV PATCH -->', '', content, flags=re.DOTALL)
    content = re.sub(r'<script id="vamos-nav-v2">.*?</script>', '', content, flags=re.DOTALL)

    # 2. Translate (only if not index.html - the router shell)
    if fname != 'index.html' and fname != 'patch_nav_v2.py':
        content = apply_translations(content)

    # 3. Build and inject nav script
    nav_script = build_nav_script(fname)
    marker = '<!-- VAMOS-V2 -->' + nav_script + '<!-- /VAMOS-V2 -->'

    if '</body>' in content:
        content = content.replace('</body>', marker + '</body>', 1)
    else:
        content += marker

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)
    return True

# Skip list
SKIP = {'index.html', 'patch_nav_v2.py', 'patch_nav.py',
        'fase_1__arquitectura_y_configuraci_n_base_-_vamos_transparencia.html',
        'gu_a_de_integraci_n_a_producci_n.html'}

html_files = [f for f in os.listdir(BASE) if f.endswith('.html') and f not in SKIP]
patched = 0
for fname in sorted(html_files):
    try:
        patch_file(fname)
        print(f"✓ {fname}")
        patched += 1
    except Exception as e:
        print(f"✗ {fname}: {e}")

print(f"\nDone. {patched} files patched.")
