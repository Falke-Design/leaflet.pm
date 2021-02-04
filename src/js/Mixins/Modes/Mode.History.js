import cloneDeep from "lodash/cloneDeep";
import isEqual from "lodash/isEqual";
import reduce from "lodash/reduce";

const GlobalHistoryMode = {
  options: {
    precision: 16
  },
  _history: [],
  _historyPos: -1,
  _addedHistoryLayersOnMap: [],
  _historyBreakpoints: {},
  _modeAction: {
    "init": {mode: "Init", action: "init"},
    "pm:create": {mode: "Draw", action: "create"},
    "pm:cut": {mode: "Draw", action: "cut"},
    "pm:edit": {mode: "Edit", action: "edit"},
    "pm:remove": {mode: "Removal", action: "delete"},
    "pm:dragend": {mode: "Move", action: "drag"},
    "revertdraw": {mode: "RevertDraw", action: "removeCreate"}, // first entry of history of the layer is found, and now it is needed one before to remove it from the map // TODO: is this working with existing layers?
    "removecut": {mode: "RemoveCut", action: "delete"},
  },
  _enableHistoryRecording() {
    Object.keys(this._modeAction).forEach((event) => {
      this.map.on(event, this._onHistroyEvent, this);
    });

    this.map.on('layeradd',(e)=>{
      this._addedHistoryLayersOnMap.push(e.layer);
    });
    if (!this.throttleInitHistoryOnLayer) {
      this.throttleInitHistoryOnLayer = L.Util.throttle(this._initHistoryOnLayer, 100, this)
    }
    // add map handler
    this.map.on('layeradd', this.throttleInitHistoryOnLayer, this);

    this.map.on('pm:enable',(e)=>{
      this.createHistoryLayerBreakpoint(e.layer);
    });
  },
  _onHistroyEvent(e) {
    // console.log(e)

    if (e.type === "pm:cut") {
      this._onHistroyEvent({layer: e.originalLayer, type: "removecut"})
    }

    const modeAction = this._modeAction[e.type];
    this.addHistoryEntry(e.layer, modeAction.mode, modeAction.action);
  },
  addHistoryEntry(layer, mode = "", action = "") {
    const cloneLayer = cloneDeep(layer);

    // remove the existing feature property. Leaflet don't generate it new, if it exists (no matter if changes happened)
    delete cloneLayer.feature;
    const geoJson = this.getDataOfLayer(cloneLayer);

    const historyEntry = {
      geoJson,
      map: layer._map,
      layer,
      mode,
      action
    };

    if (!this._matchEntryWithLast(historyEntry) && !layer._pmTempLayer) {
      // The _globalChangePos is not on the last position, so the new change have to inserted after the _globalChangePos and all other changes after have to be removed
      if(this._historyPos !== this._history.length-1){
        // remove all next steps, but keep the current one (+1)
        this._history = this._history.slice(0,this._historyPos+1);
      }
      this._history.push(historyEntry);
      this._historyPos = this._history.length - 1;
      this._updateHistoryControls();
    }

  },
  removeHistoryEntry(entry) {
    const idx = this._getIndexOfHistoryEntry(entry);
    if (idx > -1) {
      this._history.splice(idx, 1);
    }
  },
  getHistory(filter = {}) {
    let history = this._history;
    if (filter.mode) {
      history = history.filter(x => x.mode === filter.mode);
    }
    if (filter.action) {
      history = history.filter(x => x.action === filter.action);
    }
    if (filter.layer) {
      history = history.filter(x => x.layer === filter.layer);
    }

    return history;
  },
  getDataOfLayer(layer) {

    let geoJson;
    if (layer instanceof L.ImageOverlay) {
      geoJson = L.rectangle(layer.getBounds()).toGeoJSON(this.options.precision);
    }else {
      geoJson = layer.toGeoJSON(this.options.precision);
    }

    if (layer instanceof L.CircleMarker) {
      geoJson.properties.radius = layer.getRadius();
    }

    return geoJson;
  },
  applyDataToLayer(layer,geoJson){
    if(!layer || !geoJson){
      return;
    }

    const geoLayer = L.GeoJSON.geometryToLayer(geoJson);

    if(layer._latlng){
      layer.setLatLng(geoLayer.getLatLng());
    }else if(layer._latlngs){
      layer.setLatLngs(geoLayer.getLatLngs());
    }else if(layer instanceof L.ImageOverlay){
      layer.setBounds(geoLayer.getBounds());
    }

    if(layer._radius){
      layer.setRadius(geoJson.properties.radius);
    }
  },
  undoHistory(noWayBack = false, pos = this._historyPos) {
    const {beforeEntry,currentEntry} = this._getHistoryEntriesAroundLayer(pos);
    this.loadHistory(beforeEntry);
    this._fireHistoryEvent(beforeEntry,'undo');
    this._setPos(-1);
    if(currentEntry && currentEntry.action === "cut"){
      this.undoHistory(noWayBack);
    }

    if(noWayBack){
      // remove all next steps, but keep the current one (+1)
      this._history = this._history.slice(0,this._historyPos+1);
      this._historyPos = this._history.length - 1;
    }

    this._updateHistoryControls();
  },
  undoHistoryLayer(layer) {
    const {beforeEntry,currentEntry} = this._getHistoryEntriesAroundLayer(pos);
    this.loadHistory(beforeEntry);
    this._fireHistoryEvent(beforeEntry,'undo');
    this._setPos(-1);
    if(currentEntry && currentEntry.action === "cut"){
      this.undoHistory(noWayBack);
    }

    if(noWayBack){
      // remove all next steps, but keep the current one (+1)
      this._history = this._history.slice(0,this._historyPos+1);
      this._historyPos = this._history.length - 1;
    }

    this._updateHistoryControls();
  },
  redoHistory() {
    this._setPos(1);
    const {currentEntry} = this._getHistoryEntriesAroundLayer(this._historyPos);
    this.loadHistory(currentEntry);
    this._fireHistoryEvent(currentEntry,'redo');
    if(currentEntry && currentEntry.mode === "RemoveCut"){
      this.redoHistory()
    }
    this._updateHistoryControls();
  },
  resetHistory(){
    this._history = [];
    this._historyPos = -1;
    this._addInitHistoryEntries();
    this._updateHistoryControls();
  },
  _setPos(step){
    let pos = this._historyPos + step;
    // the pos is -1 when all layers are reverted
    if(pos < -1){
      pos = -1;
    }else if(pos > this._history.length-1){
      pos = this._history.length-1;
    }
    this._historyPos = pos;
    return pos;
  },
  loadHistory(entry) {
    if(!entry || !entry.layer || !entry.layer.pm){
      return;
    }

    const {layer, mode, action, map, geoJson} = entry;
    layer.pm._historyAdd = false;
    if (action === "delete" || action === "removeCreate") {
      layer.pm.removeLayer(false);
    } else if (!layer._map) {
      // if the layer is not added to the map, it have to be added
      layer.pm._historyAdd = true;
      layer.pm.addLayer();
    }

    this.applyDataToLayer(layer,geoJson);

    if(this.globalEditModeEnabled() && layer._map){
      L.PM.Utils._preventFireEvents(true);
      layer.pm.enable();
      L.PM.Utils._preventFireEvents(false);
    }else if (this._markerGroup) {
      this._markerGroup.clearLayers();
    }
  },
  _matchEntryWithLast(entry) {
    const oldEntry = this._history[this._historyPos];
    if (!oldEntry) {
      return false;
    }

    // after pm:dragend, pm:edit is fired
    if (oldEntry.layer === entry.layer && oldEntry.action === "drag" && entry.action === "edit") {
      if (isEqual(oldEntry.geoJson, entry.geoJson)) {
        return true;
      }
    }

    return isEqual(entry, oldEntry);
  },
  _getHistoryEntriesAroundLayer(pos){

    if(pos === -1){
      return {
        beforeEntry: undefined,
        nextEntry: this._history[0],
        currentEntry: undefined
      };
    }

    const currentEntry = this._history[pos];
    if(!currentEntry || !currentEntry.layer.pm){
      return {
        beforeEntry: {layer: currentEntry ? currentEntry.layer : undefined, mode: 'RevertDraw', action: 'removeCreate', geoJson: null},
        nextEntry: undefined,
        currentEntry
      };
    }
    const history = this.getHistory({layer: currentEntry.layer, init: false});
    const idx = history.indexOf(currentEntry);

    let beforeEntry;
    if(history[idx-1]){
      beforeEntry = history[idx-1];
    }else if(history[idx] && history[idx].mode === "Draw" && history[idx].action === "create"){
      beforeEntry = {layer: currentEntry.layer, mode: 'RevertDraw', action: 'removeCreate', geoJson: null}
    }else{
      beforeEntry = currentEntry.layer.pm._initHistoryEntry;
    }

    const nextEntry = history[idx+1];

    return {
      beforeEntry,
      nextEntry,
      currentEntry
    }

  },
  createHistoryBreakpoint(tag = "default"){
    this._historyBreakpoints[tag] = this._historyPos;
  },
  getHistoryBreakpoint(tag = "default"){
    return this._historyBreakpoints[tag];
  },
  undoHistoryBreakpoint(tag = "default"){
    const breakpoint = this._historyBreakpoints[tag];
    if(breakpoint || breakpoint === 0) {
      for (let i = this._historyPos; i > breakpoint; i--) {
        this.undoHistory(true);
      }
      delete this._historyBreakpoints[tag];
    }
  },
  createHistoryLayerBreakpoint(layer){
    const history = this.getHistory({layer});
    this._historyBreakpoints[L.Util.stamp(layer)] = history.length-1;
  },
  getHistoryLayerBreakpoint(layer){
    return this._historyBreakpoints[L.Util.stamp(layer)];
  },
  _updateHistoryControls(){
    this.map.pm.Toolbar.setButtonDisabled('redoMode',false);
    this.map.pm.Toolbar.setButtonDisabled('undoMode',false);

    const historyLen = this.getHistory().length;

    if(historyLen === 0)   {
      this.map.pm.Toolbar.setButtonDisabled('redoMode',true);
      this.map.pm.Toolbar.setButtonDisabled('undoMode',true);
    } else if(this._historyPos === historyLen - 1){
      this.map.pm.Toolbar.setButtonDisabled('redoMode',true);
    }else if(this._historyPos === -1){
      this.map.pm.Toolbar.setButtonDisabled('undoMode',true);
    }
  },
  _addInitHistoryEntries(){
    const layers = L.PM.Utils.findLayers(this.map);
    layers.forEach((layer)=>{
      const history = this.getHistory({layer});
      if(history.length === 0){
        this._addInitHistoryEntry(layer);
      }
    });
  },
  _addInitHistoryEntry(layer){
    const cloneLayer = cloneDeep(layer);

    // remove the existing feature property. Leaflet don't generate it new, if it exists (no matter if changes happened)
    delete cloneLayer.feature;
    const geoJson = this.getDataOfLayer(cloneLayer);

    layer.pm._initHistoryEntry = {
      geoJson,
      map: layer._map,
      layer,
      mode: "Init",
      action: "init"
    };
  },
  _initHistoryOnLayer(){
    if(this._addedHistoryLayersOnMap && this._addedHistoryLayersOnMap.length > 0){
      const layers = this._addedHistoryLayersOnMap;
      this._addedHistoryLayersOnMap = [];
      layers.forEach((layer)=>{
        if (
          layer.pm && !layer._pmTempLayer && !layer.pm._historyAdd && (
            layer instanceof L.Polyline ||
            layer instanceof L.Marker ||
            layer instanceof L.Circle ||
            layer instanceof L.CircleMarker ||
            layer instanceof L.ImageOverlay
          )
        ) {
          this._addInitHistoryEntry(layer);
        }else if(layer.pm){
          layer.pm._historyAdd = false;
        }
      });
    }
  },
  _fireHistoryEvent(entry, change){
    if(!entry || !entry.layer){
      return;
    }
    L.PM.Utils._fireEvent(entry.layer, 'pm:historychange', {
      layer: entry.layer,
      shape: entry.layer.pm.getShape(),
      historyEntry: entry,
      change
    });
  },
  _getIndexOfHistoryEntry(entry){
    return this._history.indexOf(entry);
  }
};
export default GlobalHistoryMode;
