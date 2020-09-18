import Utils from "../L.PM.Utils";
import {createGeodesicPolygon, destination} from "../helpers";
import lineIntersect from "@turf/line-intersect";

const HelplineMixins = {
  _helplineLayers: [],
  helplines: [],
  calculateAllHelplines(recalcAll = false){
    // get all layers in map bounds
    let layers = Utils.findLayers(this.map,true);

    if(!recalcAll) {
      layers = layers.filter(layer => this._helplineLayers.indexOf(layer) === -1);
      const notNeededLayers = this._helplineLayers.filter(layer => layers.indexOf(layer) === 1);
      notNeededLayers.forEach((layer)=>{
        this.removeHelpline(layer);
      });
    }else{
      this._helplineLayers.forEach((layer)=>{
        this.removeHelpline(layer);
      });
      this._helplineLayers = [];
    }

    layers.forEach((layer)=>{
      this.addHelpline(layer);
    })

  },
  addHelpline(layer){
    this._helplineLayers.push(layer);

  },
  removeHelpline(layer){
    if(layer){
      const idx = this._helplineLayers.indexOf(layer);
      if(idx > -1){
        this._helplineLayers.splice(idx,1);
        if(layer.pm._helpline){
          layer.pm._helpline.remove();
          const idxLine = this.helplines.indexOf(layer.pm._helpline);
          if(idxLine > -1) {
            this.helplines.splice(idxLine, 1);
          }
        }
      }
    }
  },
  // TODO: this.helplines sind gaaanz viele ... möglichkeit mit dem layer zu verknüpfen? Und hier wird jedes mal wieder aufs neue alle Punkte neu berechnet, nicht nur die vom neuen layer
  createLayerHelplines(layer){
    let helplines = this.helplines.concat(this._createHelplines(layer));
    helplines = helplines.concat(this._createIntersectionPoints(helplines.concat(Utils.findLayers(this.map,true))));
    this.helplines = helplines;
    return helplines;
  },
  _createHelplines(layer){
    const dis = 100;
    let helplines = [];
    if(layer instanceof L.Polyline){
      layer.getLatLngs().flat().forEach((latlng)=>{
        helplines = helplines.concat(this._createIntersectionLines(latlng,dis,0));
      });
      if(layer.getLatLngs().flat() > 1 && layer.getCenter) {
        const marker = L.marker(layer.getCenter());
        marker._helpPoint = true;
        helplines.push(marker);
        helplines = helplines.concat(this._createIntersectionLines(layer.getCenter(), dis, 0));
      }
    }else{
      if(layer instanceof L.Circle){
        const points = createGeodesicPolygon(layer.getLatLng(),layer.getRadius(),4,0);
        points.forEach((p)=>{
          helplines = helplines.concat(this._createIntersectionLines(p,dis,0));
        })
      }
      helplines = helplines.concat(this._createIntersectionLines(layer.getLatLng(),dis,0));
    }
    return helplines;
  },

  _createIntersectionLines (latlng, d, w) {
    const o1 = destination(latlng,d,w)
    const o12 = destination(latlng,d,w-180)
    const o2 = destination(latlng,d,w-90)
    const o22 = destination(latlng,d,w+90)

    const poly1 = L.polyline([o12,o1]);
    const poly2 = L.polyline([o22,o2]);
    poly1._helpLine = true;
    poly2._helpLine = true;
    return [poly1,poly2];
  },
  _createIntersectionPoints(layers){
    let points = [];
    const tempLayers = layers.filter(l => l instanceof L.Polyline);
    tempLayers.forEach((layer)=>{
      // exclude the drawn one
      tempLayers.filter(l => l !== layer)
      // only layers with intersections
        .filter(l => {
          try {
            const inter = lineIntersect(layer.toGeoJSON(15), l.toGeoJSON(15));
            if(inter && inter.features.length > 0){
              const interPoints = L.geoJSON(inter).getLayers();
              if(l._helpLine || layer._helpLine) {
                interPoints.forEach((p) => {
                  p._helpLines = [];
                  if(l._helpLine){
                    p._helpLines.push(l);
                  }
                  if(layer._helpLine){
                    p._helpLines.push(layer);
                  }
                  p._helpPoint = true;
                });
              }
              points = points.concat(interPoints);
            }
            return true;
          } catch (e) {
            /* eslint-disable-next-line no-console */
            console.error('You cant cut polygons with self-intersections');
            return false;
          }
        });
      tempLayers.shift()
    })

    return points;
  },
};

export default HelplineMixins;
