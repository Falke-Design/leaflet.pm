import Utils from "../L.PM.Utils";
import {createGeodesicPolygon, destination, distance} from "../helpers";
import intersect from "@turf/intersect";
import lineIntersect from "@turf/line-intersect";
const { findLayers } = Utils;

const GuidelineMixin = {
  guidelines: [],
  drawGuidelineEnabled: false,
  guidlinesEnabled: true,
  count: 0,
  visibleHelplines: [],
  addGuideline(layer) {
    this.count+=1;
    layer._guideLayer = this.count;
    this.guidelines.push(layer);

    this.map.fire('pm:guidelineadd',{
      guideline: layer,
      index: this.count,
      guidelines: this.guidelines,
    });
  },
  _addGuidelineFromDraw({layer}) {
    this.addGuideline(layer);
    if (!(layer instanceof L.Marker || (layer instanceof L.CircleMarker && !(layer instanceof L.Circle)))) {
      layer.removeFrom(this.map);
    }
  },
  removeGuideline(layer) {
    if(layer._guideLayer) {
      const idx = this._findGuideline(layer._guideLayer);
      if(idx > -1) {
        this.guidelines.splice(idx, 1);

        this.map.fire('pm:guidelineremove',{
          guideline: layer,
          index: layer._guideLayer,
          guidelines: this.guidelines,
        });
      }
    }
  },
  _findGuideline(nr){
    let idx = -1;
    this.guidelines.forEach((layer,i) => {
      if(layer._guideLayer === nr){
        idx = i;
      }
    });
    return idx;
  },
  showGuidelines() {
    this.guidelines.forEach((layer) => {
      layer.addTo(this.map);
    });
  },
  hideGuidelines() {
    this.guidelines.forEach((layer) => {
      layer.removeFrom(this.map);
    });
    const shape = this.map.pm.Draw.getActiveShape();
    if(shape) {
      this.map.pm.Draw[shape]._cleanupSnapping();
    }
    this._hideHelplines();
  },
  enableGuidelines(){
    this.guidlinesEnabled = true;
    if(this._modesEnabled()){
      this.showGuidelines();
      const shape = this.map.pm.Draw.getActiveShape();
      if(shape) {
        this.map.pm.Draw[shape]._cleanupSnapping();
      }
    }
    this._fireGuidelineEvent();
  },
  disableGuidelines(){
    this.guidlinesEnabled = false;
    this.hideGuidelines();
    this._fireGuidelineEvent();
  },
  guidelinesEnabled() {
    return this.guidlinesEnabled;
  },
  toggleGuidelines() {
    if (this.guidlinesEnabled) {
      this.disableGuidelines()
    } else {
      this.enableGuidelines();
    }
  },
  enableDrawGuidelines() {
    this.orgOptions = {};
    this.map.pm.Draw.shapes.forEach(shape => {
      const opt = this.map.pm.Draw[shape].options;
      this.orgOptions[shape] = {templineStyle: opt.templineStyle, hintlineStyle: opt.hintlineStyle, pathOptions: opt.pathOptions};
      this.map.pm.Draw[shape].setOptions({
        hintlineStyle: {
          color: '#ed0063',
          dashArray: '5,5',
        },
        templineStyle: {
          color: '#ed0063',
          dashArray: '5,5',
        },
        pathOptions: {
          color: '#ed0063',
          dashArray: '5,5',
        },
      });
    });
    this.map.pm.Draw.applyDrawStyles();

    this.drawGuidelineEnabled = true;
    this.map.on('pm:create', this._addGuidelineFromDraw, this);
    this._fireGuidelineEvent();
  },
  disableDrawGuidelines() {

    for(const shape in this.orgOptions){
      this.map.pm.Draw[shape].setOptions(this.orgOptions[shape]);
    }
    this.map.pm.Draw.applyDrawStyles();

    this.drawGuidelineEnabled = false;
    this.map.off('pm:create', this._addGuidelineFromDraw, this);
    this.orgOptions = {};
    this._fireGuidelineEvent();
  },
  drawGuidelinesEnabled() {
    return this.drawGuidelineEnabled;
  },
  toggleDrawGuidelines() {
    if (this.drawGuidelineEnabled) {
      this.disableDrawGuidelines()
    } else {
      this.enableDrawGuidelines();
    }
  },
  removeAllGuidelines(){
    this.hideGuidelines();
    this.guidelines = [];
    this.count = 0;
    this.map.fire('pm:guidelinesremove',{
      guidelines: this.guidelines,
      enabled: this.guidelinesEnabled(),
      enabledDraw: this.drawGuidelinesEnabled()
    });
  },
  _modesEnabled(){
    return this.map.pm.globalDrawModeEnabled() || this.map.pm.globalDragModeEnabled() || this.map.pm.globalRemovalEnabled() || this.map.pm.globalEditEnabled();
  },
  _fireGuidelineEvent(){
    this.map.fire('pm:guidelines',{
      guidelines: this.guidelines,
      enabled: this.guidelinesEnabled(),
      enabledDraw: this.drawGuidelinesEnabled()
    })
  },
  createAllHelplines(){
    this.helplines = [];
    const layers = findLayers(this.map);
    layers.forEach((layer) => {
      this.helplines = this.helplines.concat(this._createHelplines(layer));
    });
    const tempLines = this.helplines.concat(layers);
    this.helplines = this.helplines.concat(this._createIntersectionPoints(tempLines));
    return this.helplines;
  },
  _createHelplines(layer){
    var dis = 100;
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
  createLayerHelplines(layer){
    let helplines = this.helplines.concat(this._createHelplines(layer));
    helplines = helplines.concat(this._createIntersectionPoints(helplines.concat(findLayers(this.map))));
    this.helplines = helplines;
    return helplines;
  },
  _createIntersectionLines (latlng, d, w) {
    var o1 = destination(latlng,d,w)
    var o12 = destination(latlng,d,w-180)
    var o2 = destination(latlng,d,w-90)
    var o22 = destination(latlng,d,w+90)

    var poly1 = L.polyline([this.getLatLngFromGeoJson(o12),this.getLatLngFromGeoJson(o1)]);
    var poly2 = L.polyline([this.getLatLngFromGeoJson(o22),this.getLatLngFromGeoJson(o2)]);
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
  getLatLngFromGeoJson(geojson){
    return geojson;
    //return L.latLng([geojson.geometry.coordinates[1],geojson.geometry.coordinates[0]]);
  },
  _showHideHelplines(layer){
    this._hideHelplines();
    this._showHelpline(layer);
  },
  _showHelpline(layer){
    if(!(layer instanceof L.Marker)){
      layer.setStyle({
        color: '#ed0063',
        dashArray: '5,5'
      });
      layer.addTo(this.map);
      this.visibleHelplines.push(layer);
    }
  },
  _hideHelplines(){
    this.visibleHelplines.forEach((l)=>{
      l.removeFrom(this.map);
    });
    this.visibleHelplines = [];
  }

};

export default GuidelineMixin;
