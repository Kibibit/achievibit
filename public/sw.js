self.addEventListener('install', function(e) {
  e.waitUntil(caches.open('achievibit').then(function(cache) {
    return cache.addAll([
      '/',
      '/index.html',
      '/index.html?homescreen=1',
      '/?homescreen=1',
      '/style.css',
      '/achievibit.js',
      '/init.js',
      '/images/unlocked.png',
      '/background1.png',
      '/background2.png',
      '/background3.png',
      '/repo.png',
      '/user-header.jpg',
      '/favicon.ico',
      // need this?
      '/vex.combined.min.js',
      '/vex.css',
      '/vex-theme-default.css'
    ]);
  })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    if (response) {
      console.info('response for ' +
        event.request.url + ' was returned from cache!');
    }

    return response || fetch(event.request);
  }));
});
