self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('app-cache').then(function(cache) {
            return cache.addAll([
                '/',
                '/static/css/styles.css',
                '/static/js/scripts.js',
                '/static/css/cursos.css',
                '/static/js/manifest.json',
                '/static/js/service-worker.js',
                '/static/css/tela_inicial.css',
                'totemapp/css/tela_inicial.css',
                'totemapp/js/manifest.json',
                'totemapp/js/service-worker.js',
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});