"""
Patch all Vamos HTML screens:
1. Replace every href="#" inside nav/footer with proper file links
2. Add a <script> block at the end of each page that:
   - Wires bottom-nav links → window.parent.postMessage
   - Wires back buttons → window.parent.postMessage
   - Wires CTA buttons → window.parent.postMessage
   - Also makes the page standalone-navigatable (window.location) when loaded directly
"""

import os, re

BASE = r"e:\MIS DOCUMENTOS\1. A PAGINAS WEB\VAMOSapp"

SCREENS = {
    'login':          'login___sign_up.html',
    'home':           'home__biling_e_venezuela.html',
    'home_ve':        'home__biling_e_venezuela.html',
    'dashboard':      'main_dashboard.html',
    'dashboard_ve':   'dashboard__biling_e_venezuela.html',
    'create_route':   'create_ride_-_route__biling_e.html',
    'create_schedule':'create_ride_-_schedule__biling_e.html',
    'create_pricing': 'create_ride_-_pricing__biling_e.html',
    'create_review':  'create_ride_-_review__biling_e.html',
    'matching':       'ride_matching__biling_e.html',
    'tracking':       'live_tracking__biling_e.html',
    'ride_review':    'ride_review__biling_e.html',
    'history':        'ride_history__biling_e.html',
    'profile':        'user_profile___settings__biling_e.html',
    'kyc':            'kyc_verification__biling_e_venezuela.html',
    'vehicles':       'vehicle_management__biling_e.html',
    'wallet':         'wallet__biling_e.html',
    'payments':       'payment_methods__biling_e_venezuela.html',
    'chat':           'chat_interface__biling_e.html',
    'notifications':  'notifications__biling_e.html',
    'refer':          'refer_a_friend__biling_e.html',
    'sos':            'sos_alert__biling_e_venezuela.html',
    'how':            'how_it_works__biling_e.html',
    'faq':            'faq___preguntas_frecuentes__biling_e.html',
}

NAV_SCRIPT = """
<script>
// ── Vamos In-Screen Navigation Patcher ──
(function(){
  var S = """ + str(SCREENS).replace("'", '"') + """;

  function navigate(target){
    // If inside SPA shell, tell parent
    if(window.parent !== window){
      window.parent.postMessage({nav: target}, '*');
      return;
    }
    // If opened standalone, navigate directly
    window.location.href = target;
  }

  function goBack(){
    if(window.parent !== window){
      window.parent.postMessage({back: true}, '*');
      return;
    }
    window.history.back();
  }

  function wireAll(){
    // ── Bottom Navigation ──
    var navEls = document.querySelectorAll('nav a, footer a');
    navEls.forEach(function(a){
      var txt = (a.textContent || '').toLowerCase();
      var icon = '';
      var ico = a.querySelector('[class*="material"]');
      if(ico) icon = ico.textContent.trim().toLowerCase();
      var c = txt + ' ' + icon;

      if(/home|inicio|explore/.test(c))                     { a.setAttribute('href','javascript:void(0)'); a.onclick = function(e){e.preventDefault();navigate(S.home);}; }
      else if(/search|buscar/.test(c))                      { a.setAttribute('href','javascript:void(0)'); a.onclick = function(e){e.preventDefault();navigate(S.dashboard);}; }
      else if(/ride|viaje|trip|route/.test(c))              { a.setAttribute('href','javascript:void(0)'); a.onclick = function(e){e.preventDefault();navigate(S.history);}; }
      else if(/wallet|billetera|payment|pago/.test(c))      { a.setAttribute('href','javascript:void(0)'); a.onclick = function(e){e.preventDefault();navigate(S.wallet);}; }
      else if(/profile|perfil|person|account/.test(c))      { a.setAttribute('href','javascript:void(0)'); a.onclick = function(e){e.preventDefault();navigate(S.profile);}; }
      else if(/notif/.test(c))                              { a.setAttribute('href','javascript:void(0)'); a.onclick = function(e){e.preventDefault();navigate(S.notifications);}; }
      else if(/chat|msg|message/.test(c))                   { a.setAttribute('href','javascript:void(0)'); a.onclick = function(e){e.preventDefault();navigate(S.chat);}; }
      else if(/settings|config|setting/.test(c))            { a.setAttribute('href','javascript:void(0)'); a.onclick = function(e){e.preventDefault();navigate(S.profile);}; }
    });

    // ── Back arrows ──
    document.querySelectorAll('button').forEach(function(btn){
      var ico = btn.querySelector('[class*="material"]');
      var ic = ico ? ico.textContent.trim() : '';
      if(ic === 'arrow_back' || ic === 'chevron_left' || ic === 'arrow_back_ios'){
        btn.onclick = function(e){ e.preventDefault(); e.stopPropagation(); goBack(); };
      }
    });

    // ── CTA Buttons ──
    document.querySelectorAll('button, a').forEach(function(el){
      var txt = (el.textContent||'').toLowerCase().trim();
      var ic = '';
      var ico = el.querySelector ? el.querySelector('[class*="material"]') : null;
      if(ico) ic = ico.textContent.trim().toLowerCase();
      var c = txt + ' ' + ic + ' ' + (el.className||'');

      // Login
      if(/^login$|^sign in$|^entrar$|^iniciar sesión$/.test(txt)){
        el.onclick=function(e){e.preventDefault();e.stopPropagation();navigate(S.home);};
      }
      // Sign up
      else if(/sign.up|registrar|crear cuenta/.test(txt)){
        el.onclick=function(e){e.preventDefault();e.stopPropagation();navigate(S.kyc);};
      }
      // Find a ride
      else if(/find.a.ride|buscar viaje/.test(txt)){
        el.onclick=function(e){e.preventDefault();e.stopPropagation();navigate(S.dashboard);};
      }
      // Offer a ride / create ride
      else if(/offer.a.ride|ofrecer|create.ride|crear viaje/.test(txt)){
        el.onclick=function(e){e.preventDefault();e.stopPropagation();navigate(S.create_route);};
      }
      // Next / Siguiente
      else if(/^next$|^siguiente$|next \/ siguiente/.test(txt)){
        var src = window.location.pathname.split('/').pop() || document.location.href.split('/').pop();
        var target = S.home;
        if(src.indexOf('route')>-1)         target = S.create_schedule;
        else if(src.indexOf('schedule')>-1) target = S.create_pricing;
        else if(src.indexOf('pric')>-1)     target = S.create_review;
        else if(src.indexOf('review')>-1 && src.indexOf('ride_review')===-1) target = S.matching;
        el.onclick=function(e){e.preventDefault();e.stopPropagation();navigate(target);};
      }
      // Confirm
      else if(/^confirm$|^confirmar$|confirm ride/.test(txt)){
        el.onclick=function(e){e.preventDefault();e.stopPropagation();navigate(S.matching);};
      }
      // Track / tracking
      else if(/track.ride|track|live.tracking|seguir/.test(txt)){
        el.onclick=function(e){e.preventDefault();e.stopPropagation();navigate(S.tracking);};
      }
      // Activate now (promo)
      else if(/activate.now|activar/.test(txt)){
        el.onclick=function(e){e.preventDefault();e.stopPropagation();navigate(S.payments);};
      }
      // Wallet / Pay
      else if(/wallet|billetera/.test(txt)){
        el.onclick=function(e){e.preventDefault();e.stopPropagation();navigate(S.wallet);};
      }
      // Add payment
      else if(/add.payment|agregar.pago|payment.method/.test(txt)){
        el.onclick=function(e){e.preventDefault();e.stopPropagation();navigate(S.payments);};
      }
      // Verify / KYC
      else if(/verify|verificar|complete.kyc/.test(txt)){
        el.onclick=function(e){e.preventDefault();e.stopPropagation();navigate(S.kyc);};
      }
      // Chat / Message driver
      else if(/message.driver|chat.driver|chat|mensajes/.test(txt)){
        el.onclick=function(e){e.preventDefault();e.stopPropagation();navigate(S.chat);};
      }
      // Notifications
      else if(/notifications|notificaciones/.test(txt)){
        el.onclick=function(e){e.preventDefault();e.stopPropagation();navigate(S.notifications);};
      }
      // Refer
      else if(/refer|invite|invitar/.test(txt)){
        el.onclick=function(e){e.preventDefault();e.stopPropagation();navigate(S.refer);};
      }
      // SOS
      else if(/^sos$/.test(txt) || ic === 'sos'){
        el.onclick=function(e){e.preventDefault();e.stopPropagation();navigate(S.sos);};
      }
      // How it works
      else if(/how.it.works|cómo.funciona/.test(txt)){
        el.onclick=function(e){e.preventDefault();e.stopPropagation();navigate(S.how);};
      }
      // FAQ
      else if(/faq|preguntas.frecuentes/.test(txt)){
        el.onclick=function(e){e.preventDefault();e.stopPropagation();navigate(S.faq);};
      }
      // See all / ver todos (nearby rides → dashboard)
      else if(/^see all$|^ver todo/.test(txt)){
        el.onclick=function(e){e.preventDefault();e.stopPropagation();navigate(S.dashboard);};
      }
      // Done / Finish
      else if(/^done$|^finish$|^finalizar$|^back to home$|^volver al inicio$/.test(txt)){
        el.onclick=function(e){e.preventDefault();e.stopPropagation();navigate(S.home);};
      }
      // Rate / Review
      else if(/rate|calificar|leave.review/.test(txt)){
        el.onclick=function(e){e.preventDefault();e.stopPropagation();navigate(S.ride_review);};
      }
    });

    // ── SOS Floating Red Button ──
    document.querySelectorAll('[class*="bg-red"], [class*="red-6"]').forEach(function(el){
      el.onclick = function(e){ e.preventDefault(); e.stopPropagation(); navigate(S.sos); };
    });

    // ── Notification bell in header ──
    document.querySelectorAll('header button').forEach(function(btn){
      var ic = btn.querySelector('[class*="material"]');
      if(ic && ic.textContent.trim() === 'notifications'){
        btn.onclick = function(e){ e.preventDefault(); e.stopPropagation(); navigate(S.notifications); };
      }
    });

    // ── Profile icon in header ──
    document.querySelectorAll('header [class*="rounded-full"]').forEach(function(el){
      if(el.tagName === 'DIV' || el.tagName === 'A'){
        el.style.cursor = 'pointer';
        el.onclick = function(e){ e.preventDefault(); e.stopPropagation(); navigate(S.profile); };
      }
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', wireAll);
  } else {
    wireAll();
  }
})();
</script>
"""

html_files = [f for f in os.listdir(BASE) if f.endswith('.html') and f != 'index.html']
patched = 0
for fname in html_files:
    fpath = os.path.join(BASE, fname)
    with open(fpath, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    # If already patched, remove old script first
    content = re.sub(r'<!-- VAMOS NAV PATCH -->.*?<!-- /VAMOS NAV PATCH -->', '', content, flags=re.DOTALL)

    # Inject nav script before </body>
    marked = '<!-- VAMOS NAV PATCH -->' + NAV_SCRIPT + '<!-- /VAMOS NAV PATCH -->'
    if '</body>' in content:
        content = content.replace('</body>', marked + '</body>')
    else:
        content += marked

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)
    patched += 1
    print(f"Patched: {fname}")

print(f"\nDone. Patched {patched} files.")
