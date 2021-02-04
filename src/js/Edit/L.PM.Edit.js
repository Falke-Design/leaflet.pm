import SnapMixin from '../Mixins/Snapping';
import DragMixin from '../Mixins/Dragging';
import Utils from "../L.PM.Utils";

const Edit = L.Class.extend({
  includes: [DragMixin, SnapMixin],
  options: {
    snappable: true,
    snapDistance: 20,
    allowSelfIntersection: true,
    allowSelfIntersectionEdit: false,
    preventMarkerRemoval: false,
    removeLayerBelowMinVertexCount: true,
    limitMarkersToCount: -1,
    hideMiddleMarkers: false,
    draggable: true,
  },
  setOptions(options) {
    L.Util.setOptions(this, options);
  },
  applyOptions() { },
  isPolygon() {
    // if it's a polygon, it means the coordinates array is multi dimensional
    return this._layer instanceof L.Polygon;
  },
  getShape(){
    return this._shape;
  },
  _setPane(layer,type){
    if(type === "layerPane"){
      layer.options.pane = this._map.pm.globalOptions.panes && this._map.pm.globalOptions.panes.layerPane || 'overlayPane';
    }else if(type === "vertexPane"){
      layer.options.pane = this._map.pm.globalOptions.panes && this._map.pm.globalOptions.panes.vertexPane || 'markerPane';
    }else if(type === "markerPane"){
      layer.options.pane = this._map.pm.globalOptions.panes && this._map.pm.globalOptions.panes.markerPane || 'markerPane';
    }
  },
  _setMap(map){
    this._map = map || this._layer._map || this._map;
  },
  _getMap(){
    return this._map|| this._layer._map;
  },
  removeLayer(fireEvent = true){
    this.disable();
    if(this._getMap()) {
      this._groups = [this._getMap()];
      if (this._getMap().pm._getContainingLayer().hasLayer(this._layer)) {
        this._groups.push(this._getMap().pm._getContainingLayer());
      }
      this._groups.forEach((group) => {
        this._layer.removeFrom(group);
      });
      if (fireEvent) {
        Utils._fireEvent(this._getMap(), 'pm:remove', {layer: this._layer, shape: this.getShape()});
      }
    }
  },
  addLayer(){
    if(this._groups && this._groups.length > 0) {
      this._groups.forEach((group) => {
        this._layer.addTo(group);
      });
    }else{
      this._layer.addTo(this._getMap().pm._getContainingLayer());
    }
  },
  undo(){

  },
  cancel(){
    const map = this._getMap();

    const history = map.pm.getHistory({layer: this._layer});
    const historyPos = map.pm.getHistoryLayerBreakpoint(this._layer);
    if((!historyPos && historyPos !== 0) || history.length === 0){
      return;
    }
    history.reverse().forEach((entry, i)=>{
      if((history.length - 1 ) - i > historyPos) {
        const idx = map.pm._getIndexOfHistoryEntry(entry);
        map.pm.undoHistory(false,idx);
        map.pm.removeHistoryEntry(entry);
      }
    });
  }
});

export default Edit;
