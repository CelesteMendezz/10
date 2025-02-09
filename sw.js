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

// 📌 Guardar archivos en caché al instalar el Service Worker
self.addEventListener('install', event => {
    console.log('✅ Service Worker: Instalado');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('📌 Cacheando archivos...');
            return cache.addAll(URLS_TO_CACHE);
        }).then(() => {
            console.log('✔ Todos los archivos fueron cacheados.');
        }).catch(error => console.error('❌ Error en la instalación del SW:', error))
    );
});

// 📌 Activar el nuevo Service Worker y eliminar versiones antiguas del caché
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

// 📌 Interceptar las solicitudes y devolver archivos en caché o red
self.addEventListener('fetch', event => {
    console.log('⚡ Fetch:', event.request.url);

    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                console.log('📦 Sirviendo desde caché:', event.request.url);
                return response;
            }

            return fetch(event.request).then(networkResponse => {
                console.log('🌐 Descargado de la red:', event.request.url);
                
                // Guardar en caché solo si es una página HTML
                if (event.request.url.endsWith('.html')) {
                    let responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                
                return networkResponse;
            });
        }).catch(() => {
            console.warn('⚠ Archivo no disponible:', event.request.url);

            // Si es una página, mostrar offline.html
            if (event.request.mode === 'navigate') {
                console.log('📄 Mostrando offline.html');
                return caches.match('/offline.html');
            }
        })
    );
});

