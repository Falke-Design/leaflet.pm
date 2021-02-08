const RotateMixin = {

  /*
  *******
   Private functions for Edit.Rectangle to create the scale help border and fucntion to transform the latlngs of the scaled layers
  *******
   */
  _onRotateStart(e){
    this._rotationOriginPoint = this._toPoint(this._getRotationOrigin(this._layer));
    this._rotationStart    =  this._toPoint(e.target.getLatLng());
    this._initialMatrix = L.matrix(1, 0, 0, 1, 0, 0);

    // we need to store the initial latlngs so we can always re-calc from the origin
    this._initialRotateLatLng = L.polygon(this._layer.getLatLngs()).getLatLngs();

  },
  _onRotate(e) {
    const pos = this._toPoint(e.target.getLatLng());
    const previous = this._rotationStart;
    const origin   = this._rotationOriginPoint;

    // rotation step angle
    this._angle = Math.atan2(pos.y - origin.y, pos.x - origin.x) -
      Math.atan2(previous.y - origin.y, previous.x - origin.x);

    this._matrix = this._initialMatrix
      .clone()
      .rotate(this._angle, origin)
      .flip();

    // we change the scale helper border latlngs
    this._layer.setLatLngs(this._convertLatLngs(this._initialRotateLatLng, this._matrix, this._map));

    const corners = this._layer.getLatLngs()[0];
    // update the corner markers to the new latlng
    this._cornerMarkers.forEach((marker) => {
        marker.setLatLng(corners[marker._index]);
    });

    const oldLatLngs = L.polygon(this._rotateLayer.getLatLngs()).getLatLngs();
    const newLatLngs = this._convertLatLngs(this._rotateLayer.pm._rotateOrgLatLng, this._matrix, this._map);
    this._rotateLayer.setLatLngs(newLatLngs);

  },
  _onRotateEnd(e){
    delete this._rotationStart;
    delete this._rotationOriginPoint;

    const originalLatLngs = L.polygon(this._rotateLayer.pm._rotateOrgLatLng).getLatLngs();
    // store the new latlngs
    this._rotateLayer.pm._rotateOrgLatLng = L.polygon(this._rotateLayer.getLatLngs()).getLatLngs();


  },


  /**
   * @return {L.LatLng}
   */
  _getRotationOrigin(layer) {

    return layer.getCenter();


    var latlngs = layer.getLatLngs()[0];
    var lb = latlngs[0];
    var rt = latlngs[2];

    return new L.LatLng(
      (lb.lat + rt.lat) / 2,
      (lb.lng + rt.lng) / 2
    );
  },

  /*
  ######################################################
  ######################################################
  ######################################################
  ######################################################
  ######################################################
  ######################################################
  ######################################################
   */


  _onScaleStart(e) {
    const marker = e.target;

    // get the opposite marker latlng
    const corners = this._findCorners();
    marker._oppositeCornerLatLng = corners[(marker._index + 2) % 4];
    const currentLatLng = marker.getLatLng();

    // get the distance between the dragged marker and the opposite corner
    this._initialDist = this._toPoint(marker._oppositeCornerLatLng).distanceTo(this._toPoint(currentLatLng));
    this._initialMatrix = L.matrix(1, 0, 0, 1, 0, 0);

    // we need to store the initial latlngs so we can always re-calc from the origin
    this._initialScaleLatLng = L.polygon(this._layer.getLatLngs()).getLatLngs();


    const originalLatLngs = L.polygon(this._scaleLayer.pm._scaleOrgLatLng).getLatLngs();
    L.PM.Utils._fireEvent(this._scaleLayer, 'pm:scalestart', {
      layer: this._scaleLayer,
      originalLatLngs,
      helpLayer: this._layer
    });
  },
  _onScale(e) {
    const currentPoint = this._toPoint(e.latlng);
    const oppositePoint = this._toPoint(e.target._oppositeCornerLatLng);

    // we get the ratio of the new distance to the init one
    const ratio = oppositePoint.distanceTo(currentPoint) / this._initialDist;

    // update matrix and scale it with the ratio
    const scale = L.point(ratio, ratio);
    this._matrix = this._initialMatrix
      .clone()
      .scale(scale, oppositePoint);

    // we change the scale helper border latlngs
    this._layer.setLatLngs(this._convertLatLngs(this._initialScaleLatLng, this._matrix, this._map));

    // We create a temp rectangle with the bounds of the layer for the help-borders and we add pmIgnore: false to be sure that it has the .pm._findCorners() function.
    const tempRect = L.rectangle(this._layer.getBounds(),{pmIgnore: false});
    const corners = tempRect.pm._findCorners();
    // update the corner markers to the new latlng
    this._cornerMarkers.forEach((marker) => {
      if (!marker.getLatLng().equals(e.target._oppositeCornerLatLng)) {
        marker.setLatLng(corners[marker._index]);
      }
    });

    const oldLatLngs = L.polygon(this._scaleLayer.getLatLngs()).getLatLngs();
    const newLatLngs = this._convertLatLngs(this._scaleLayer.pm._scaleOrgLatLng, this._matrix, this._map);
    this._scaleLayer.setLatLngs(newLatLngs);

    const originalLatLngs = L.polygon(this._scaleLayer.pm._scaleOrgLatLng).getLatLngs();
    L.PM.Utils._fireEvent(this._scaleLayer, 'pm:scale', {
      layer: this._scaleLayer,
      matrix: this._matrix,
      oldLatLngs,
      newLatLngs,
      originalLatLngs,
      helpLayer: this._layer
    });

  },
  _onScaleEnd() {
    const originalLatLngs = L.polygon(this._scaleLayer.pm._scaleOrgLatLng).getLatLngs();

    // store the new latlngs
    this._scaleLayer.pm._scaleOrgLatLng = L.polygon(this._scaleLayer.getLatLngs()).getLatLngs();

    delete this._initialDist;
    delete this._initialScaleLatLng;

    L.PM.Utils._fireEvent(this._scaleLayer, 'pm:scaleend', {
      layer: this._scaleLayer,
      newLatLngs: this._scaleLayer.getLatLngs(),
      originalLatLngs,
      matrix: this._matrix,
      helpLayer: this._layer
    });
  },
  _toPoint(latlng) {
    if (latlng instanceof L.Layer) {
      latlng = latlng.getLatLng();
    }
    return this._map.project(latlng, this._map.getMaxZoom());
  },
  _convertLatLngs(latlng, matrix, map) {
    const zoom = map.getMaxZoom();
    if (L.Util.isArray(latlng)) {
      const latlngs = [];
      latlng.forEach((x) => {
        latlngs.push(this._convertLatLngs(x, matrix, map));
      });
      return latlngs;
    } else if (latlng instanceof L.LatLng) {
      return this._convertLatLng(latlng, matrix, map, zoom);
    }
    return null;
  },
  _convertLatLng(latlng, matrix, map, zoom) {
    return map.unproject(matrix.transform(map.project(latlng, zoom)), zoom);
  },

  /*
  *******
   Public functions to disable and enable scaling on the layer directly
  *******
  */
  enableRotate(){

    // we use the color of the layer but it can be overwritten over the options `scaleBorderStyle`
    const options = Object.assign({},{color: this._layer.options.color}, this.options.rotateBorderStyle,{pmIgnore: false,  fill: false});

    // we create a scale help border
    this._rotateRect = L.rectangle(this._layer.getBounds(),options).addTo(this._layer._map);
    this._rotateRect.pm.options.rotate = true;
    this._rotateRect.pm._rotateLayer = this._layer;
    this._rotateRect.pm.enable();

    // store the original latlngs
    this._rotateOrgLatLng = L.polygon(this._layer.getLatLngs()).getLatLngs();

    this._rotateEnabled = true;

    L.PM.Utils._fireEvent(this._layer, 'pm:rotateenable', {
      layer: this._layer,
      helpLayer: this._rotateRect
    });
  },
  disableRotate(){
    if(this.rotateEnabled()){

      // remove the scale help border
      this._rotateRect.pm.disable();
      this._rotateRect.remove();
      this._rotateRect = undefined;
      this._rotateOrgLatLng = undefined;

      this._rotateEnabled = false;

      L.PM.Utils._fireEvent(this._layer, 'pm:rotatedisabled', {
        layer: this._layer,
        helpLayer: this._rotateRect
      });
    }
  },
  rotateEnabled(){
    return this._rotateEnabled;
  }
};

export default RotateMixin;
