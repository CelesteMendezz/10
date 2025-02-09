self.addEventListener('install', event => {
    console.log('Service Worker: Instalado');
    event.waitUntil(
        caches.open('mi-cache-v1').then(cache => {
            return cache.addAll([
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
            ]);
        })
    );
});



self.addEventListener('activate', event => {
    console.log('Service Worker: Activado');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== 'mi-cache-v1') {
                        console.log('Borrando caché antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
           
            if (response) {
                return response;
            }

           
            return fetch(event.request)
                .then(networkResponse => {
                    if (!networkResponse || networkResponse.status !== 200) {
                        throw new Error('Respuesta de red no válida');
                    }

                    
                    let responseClone = networkResponse.clone();
                    caches.open('mi-cache-v1').then(cache => {
                        cache.put(event.request, responseClone);
                    });

                    return networkResponse;
                })
                .catch(() => {
                    
                    if (event.request.mode === 'navigate') {
                        return caches.match('/offline.html');
                    }
                });
        })
    );
});

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
