const CACHE_NAME = 'mi-cache-v3';
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/contactanos.html",
  "/oferta_educativa.html",
  "/plan.html",
  "/estilos.css",
  "/ofertae.css",
  "/plan.css",
  "/manifest.json",
  "/app.js",
  "/offline.html",
  "/imagenes/actitud.png",
  "/imagenes/beca.png",
  "/imagenes/benemerita.png",
  "/imagenes/conocimiento.png",
  "/imagenes/escudo.png",
  "/imagenes/escuelasuperior.png",
  "/imagenes/graduacion.png",
  "/imagenes/icon.png",
  "/imagenes/icono1.png",
  "/imagenes/icono2.png",
  "/imagenes/inicio_cap.png",
  "/imagenes/itson.png",
  "/imagenes/logo_unam.png",
  "/imagenes/mujer-removebg-preview.png",
  "/imagenes/multitalentoso.png",
  "/imagenes/papeleria.png",
  "/imagenes/par_students-removebg-preview.png",
  "/imagenes/plan_cap.png",
  "/imagenes/planeta-tierra.png",
  "/imagenes/profesional.jpg",
  "/imagenes/public-service.png",
  "/imagenes/Software.jpg",
  "/imagenes/unam.jpg",
  "/imagenes/valor.png"   
];


self.addEventListener('install', event => {
  console.log('✅ Service Worker: Instalado');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📌 Cacheando archivos...');
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => {
        console.log('✔ Todos los archivos fueron cacheados.');
      })
      .catch(error => console.error('❌ Error en la instalación del SW:', error))
  );
});


self.addEventListener('activate', event => {
  console.log('✅ Service Worker: Activado');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑 Borrando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});


self.addEventListener('fetch', event => {
  console.log('⚡ Fetch:', event.request.url);
  

  if (event.request.url.includes('favicon.ico')) {
    event.respondWith(new Response(null, { status: 204, statusText: 'No Content' }));
    return;
  }
  

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {

          if (event.request.url.endsWith('.html')) {
            let responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          console.log('🌐 Descargado de la red (navegación):', event.request.url);
          return networkResponse;
        })
        .catch(() => {
          console.warn('⚠ Fallo en la red para navegación:', event.request.url);
          return caches.match('/offline.html');
        })
    );
    return;
  }
  

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          console.log('📦 Sirviendo desde caché:', event.request.url);
          return cachedResponse;
        }
        return fetch(event.request)
          .then(networkResponse => {

            if (event.request.url.endsWith('.html')) {
              let responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
            }
            console.log('🌐 Descargado de la red:', event.request.url);
            return networkResponse;
          });
      })
      .catch(() => {
        console.warn('⚠ Archivo no disponible:', event.request.url);

        return new Response('', { status: 404, statusText: 'Not Found' });
      })
  );
});
