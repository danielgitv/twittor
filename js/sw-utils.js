
// Guardar  en el cache dinamico
function actualizaCacheDinamico( dynamicCache, req, res ) {


    if ( res.ok ) { // si la respuesta la hace - almaceno

        return caches.open( dynamicCache ).then( cache => {
            //almaceno la request y clonar la respuesta
            cache.put( req, res.clone() );
            
            return res.clone();

        });

    } else { // si falló el cache y falló la red, lo único que
                // regreso es return res;
        return res;
    }



}

