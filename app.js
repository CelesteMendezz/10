if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
    .then(registration => {
        console.log('SW registrado con exito:', registration);
    }) 
    .catch(error => {
        console.error('Error al registrar el Service Worker:', error);
    });
}
