import { createGeodesicPolygon, getTranslation } from "./helpers";

const Utils = {
  calcMiddleLatLng(map, latlng1, latlng2) {
    // calculate the middle coordinates between two markers

    const p1 = map.project(latlng1);
    const p2 = map.project(latlng2);

    return map.unproject(p1._add(p2)._divideBy(2));
  },
  findLayers(map,inBounds = false) {
    let layers = [];
    map.eachLayer(layer => {
      if (
        layer instanceof L.Polyline ||
        layer instanceof L.Marker ||
        layer instanceof L.Circle ||
        layer instanceof L.CircleMarker
      ) {
        if(inBounds){
          const bounds = map.getBounds().pad(0.2); // extend bounds 20% off-screen
          let contains = false;
          if(layer instanceof L.Polyline){
            const latlngs = layer.getLatLngs().flat().find((latlng) => bounds.contains(latlng));
            contains = !!latlngs;
          }else {
            contains = bounds.contains(layer.getLatLng());
          }

          if(contains){
            layers.push(layer);
          }
        }else{
          layers.push(layer);
        }

      }
    });
    // filter out layers that don't have the leaflet-geoman instance
    layers = layers.filter(layer => !!layer.pm);

    // filter out everything that's leaflet-geoman specific temporary stuff
    layers = layers.filter(layer => !layer._pmTempLayer);

    console.log(layers.length)
    return layers;
  },
  circleToPolygon(circle, sides = 60) {
    const origin = circle.getLatLng();
    const radius = circle.getRadius();
    const polys = createGeodesicPolygon(origin, radius, sides, 0); // these are the points that make up the circle
    const polygon = [];
    for (let i = 0; i < polys.length; i += 1) {
      const geometry = [polys[i].lat, polys[i].lng];
      polygon.push(geometry);
    }
    return L.polygon(polygon, circle.options);
  },
  createGeodesicPolygon,
  getTranslation,
};

export default Utils;
