document.addEventListener('DOMContentLoaded', function() {
    // La apiKey ahora se define globalmente en index.hbs
    let map;
    let initialCenter = [-58.175, -26.181]; // Valor por defecto

    function initializeMap(center) {
        map = new maplibregl.Map({
            container: 'map',
            style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`,
            center: center, // Usamos el centro dinámico
            zoom: 10
        });

        // Agregar controles de navegación (zoom, etc.)
        map.addControl(new maplibregl.NavigationControl(), 'top-left');
    }

    function fetchLocationsAndAddMarkers() {
        fetch('/maps/locations')
            .then(response => response.json())
            .then(data => {
                if (data && data.locations && data.locations.length > 0) {
                    // Establecer el centro inicial con la primera sede
                    initialCenter = [data.locations[0].longitude, data.locations[0].latitude];
                    initializeMap(initialCenter); // Inicializar el mapa después de obtener la primera sede

                    data.locations.forEach(location => {
                        // Crear un marcador para cada ubicación
                        const marker = new maplibregl.Marker()
                            .setLngLat([location.longitude, location.latitude]) // [lng, lat] para MapLibre GL JS
                            .setPopup(new maplibregl.Popup({ offset: 25 })
                                .setHTML(`<h3>${location.name}</h3><p>${location.address || ''}</p>`))
                            .addTo(map);
                    });
                } else {
                    initializeMap(initialCenter); // Inicializar con el centro por defecto si no hay sedes
                    console.warn('No se encontraron sedes.');
                }
            })
            .catch(error => {
                initializeMap(initialCenter); // Inicializar con el centro por defecto en caso de error
                console.error('Error al cargar las ubicaciones:', error);
            });
    }

    function centerMap(lng, lat, name) {
        if (map) {
            map.flyTo({
                center: [lng, lat],
                zoom: 15,
                essential: true
            });

            new maplibregl.Marker()
                .setLngLat([lng, lat])
                .setPopup(new maplibregl.Popup({ offset: 25 })
                .setHTML(`<h3>${name}</h3>`))
                .addTo(map);
        }
    }

    // Cargar las ubicaciones y agregar los marcadores al mapa
    fetchLocationsAndAddMarkers();

    // Agregar event listeners a la lista de sedes (esto podría estar también en index.hbs)
    const locationsListItems = document.querySelectorAll('.location-item');
    locationsListItems.forEach(item => {
        item.addEventListener('click', function() {
            const latitude = parseFloat(this.dataset.lat);
            const longitude = parseFloat(this.dataset.lng);
            const name = this.dataset.name;

            centerMap(longitude, latitude, name);
        });
    });
});