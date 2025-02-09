const CACHE_NAME = 'mi-cache-v2';
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
    console.log('Service Worker: Instalado');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(URLS_TO_CACHE);
        }).catch(error => console.error('Error en la instalación del SW:', error))
    );
});

// 📌 Activar el nuevo Service Worker y eliminar versiones antiguas del caché
self.addEventListener('activate', event => {
    console.log('Service Worker: Activado');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Borrando caché antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// 📌 Interceptar las solicitudes y devolver archivos en caché
self.addEventListener('fetch', event => {
    console.log('Service Worker: Fetch', event.request.url);

    // Evitar caché de favicon.ico para evitar errores en consola
    if (event.request.url.includes('favicon.ico')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response; // 📌 Si está en caché, devolverlo
            }

            // 📌 Si no está en caché, intentar cargarlo desde la red
            return fetch(event.request).then(networkResponse => {
                if (!networkResponse || networkResponse.status !== 200) {
                    throw new Error('No se pudo obtener respuesta de la red');
                }

                // 📌 Clonar la respuesta para guardarla en caché
                let responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseClone);
                });

                return networkResponse;
            });
        }).catch(() => {
            // 📌 Si está offline y no se encuentra en caché, devolver `offline.html`
            if (event.request.mode === 'navigate') {
                return caches.match('/offline.html');
            }
        })
    );
});

// 📌 Sincronización en segundo plano
self.addEventListener('sync', event => {
    if (event.tag === 'sincronizar-datos') {
        console.log('Service Worker: Sincronizando datos');
        event.waitUntil(
            new Promise(resolve => {
                setTimeout(() => {
                    console.log('Datos sincronizados');
                    resolve();
                }, 1000);
            }).catch(error => console.error('Error en la sincronización:', error))
        );
    }
});
