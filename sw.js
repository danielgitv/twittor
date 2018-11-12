// imports
importScripts('js/sw-utils.js');


const STATIC_CACHE    = 'static-v8';
const DYNAMIC_CACHE   = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmutable-v1';

// shell = cascara
const APP_SHELL = [ // es un arreglo
    //'/',  En Githut la app No se encuenta en la raiz
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [//es un arreglo
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];


// Proceso de Instalalción
self.addEventListener('install', e => {

    // abrimos 2 promesas
    const cacheStatic = caches.open( STATIC_CACHE ).then(cache => 
        cache.addAll( APP_SHELL ));

    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then(cache => 
        cache.addAll( APP_SHELL_INMUTABLE ));


        //aquí la manejo la 2 promesas como (Promise.all)
    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ])  );

});

//Proceso de activación (cada vez que cambie el sw me borre los caches viejos)
self.addEventListener('activate', e => { // recibo un evento

    const respuesta = caches.keys().then( keys => {
        // el forEach espera hasta que temirmne la linea anterior
        keys.forEach( key => {

            if (  key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }

            if (  key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil( respuesta );

});



//75.Repaso: Cache con Network Fallback
self.addEventListener( 'fetch', e => {

    // verificar si existe la request
    const respuesta = caches.match( e.request ).then( res => {

        if ( res ) { //si existe la respuesta
            return res;
        } else { // si no existe la respuesta
            //implementar para de la extrategia de Cache con Network Fallback
            //Tengo que hacer un fetch para obtener el nuevo recurso
            return fetch( e.request ).then( newRes => {

                return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes );

            });

        }

    });



    e.respondWith( respuesta );

});
