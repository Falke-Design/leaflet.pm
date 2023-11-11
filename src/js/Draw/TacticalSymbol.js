L.TacticalSymbol = L.Layer.extend({

  geomanOptions: {
    allowEditing: true,
    draggable: false,
    allowRemoval: false,
    allowCutting: false,
    allowRotation: false,
    hideMiddleMarkers: true
  },

  initialize(path) {
    this._layerGroup = L.featureGroup();
    this._visibleLayersInEditMode = [];

    const pmEnable = ()=>{
      this._visibleLayersInEditMode.forEach((layer)=>{
        layer.addTo(this._layerGroup);
      })
    };
    const pmDisable = ()=>{
      this._visibleLayersInEditMode.forEach((layer)=>{
        layer.removeFrom(this._layerGroup);
      })
    };

    this._layerGroup.on('pm:enable', pmEnable, this);
    this._layerGroup.on('pm:disable', pmDisable, this);

    // this._layerGroup.off('layeradd');
    this._symbolPath = path;

    this._masterLayer = null;

    this._ignoreLayersFromRemoving = [];

    this._scale = 1;

    this._hideHandlers = false;
    this._hideMarkersExceptHandlerIds = new Set();
  },

  createLayerFromPaths(symbolPath){
    this._tempHandlerId = 0;
    symbolPath.paths.forEach((path)=>{
      this.goTroughPath(path, this._pxCenter, 0);
    })
  },

  goTroughPath(path, cursor, depth, _angle, disabled, ignoreScale, data = {}){
    const angle = (_angle ||0 ) + path.angle;
    const point = this.destination(cursor, angle, path.pxLength * this._scale);
    const latlng = this._map.unproject(point, this._zoom);
    const cursorLatLng = this._map.unproject(cursor, this._zoom);

    let layer;

    if(path.type === 'LineString'){
      layer = L.polyline([cursorLatLng, latlng]);

      if(disabled){
        layer.options.pmIgnore = true;
      }
      layer.pm.setOptions(this.geomanOptions);
      layer.addTo(this._layerGroup);

      if(!this._masterLayer){
        this._masterLayer = layer;
        this._masterLayer.on('pm:enable', this._bubbleEvents, this);
        this._masterLayer.on('pm:disable', this._bubbleEvents, this);
      }
    } else if(path.type === 'Space'){
      layer = L.polyline([cursorLatLng, latlng], {stroke: false, fill: false});
      if(disabled){
        layer.options.pmIgnore = true;
      }
      layer.pm.setOptions(this.geomanOptions);
      layer.addTo(this._layerGroup);
    } else if(path.type === 'HandlerPoint' && !disabled){
      layer = new L.Marker(latlng, {
        draggable: true,
        pmIgnore: true,
        icon: L.divIcon({ className: `marker-icon rotate-marker-icon` }),
      });

      this._tempHandlerId += 1;
      const handlerId = this._tempHandlerId;
      layer._handlerId = handlerId;

      if(!this._hideHandlers || this._hideMarkersExceptHandlerIds.has(handlerId)) {
        this._visibleLayersInEditMode.push(layer);
      }

      layer.on('dragstart', ()=>{
        this._tempHandler = layer;

        this._hideHandlers = true;
        this._hideMarkersExceptHandlerIds.add(layer._handlerId);

        this._tempScale = this._scale;
        this._map.on('mousemove', this._onHandlerMousemove, this);
        this._map.once('mouseup', ()=>{
          this._map.off('mousemove', this._onHandlerMousemove, this);
          this._hideMarkersExceptHandlerIds.delete(layer._handlerId);
          this._hideHandlers = false;
          delete this._tempHandler;
          delete this._tempScale;
          document.body.classList.remove('leaflet-dragging');
          this._render();
        }, this);
      });

      layer.scale = path.scale;
      layer.rotate = path.rotate;
    }

    if(!layer) {
      layer = {}
    }

    layer._cursor = cursor;
    layer._point = point;
    layer._symbolPath = path;
    layer._allowedLatLngs = [];
    layer._allowedLatLngsFirst = [];
    layer._depth = depth;
    layer._angle = angle;
    layer._angleBase = _angle || 0;
    if(path.edit){
      // if(path.edit.last){
      //   layer._allowedLatLngs.push(latlng)
      // } else if(path.edit.first){
      //   layer._allowedLatLngs.push(cursorLatLng);
      //   layer._allowedLatLngsFirst.push({
      //     latlng: cursorLatLng,
      //     anchor: latlng
      //   })
      // }

      if(!this._hideHandlers) {
        if (path.edit.last) {
          layer._allowedLatLngs.push({
            latlng,
            directionForced: !Array.isArray(layer._symbolPath.edit.last) || layer._symbolPath.edit.last.indexOf('rotate') === -1
          })
        } else if (path.edit.first) {
          layer._allowedLatLngs.push({
            latlng: cursorLatLng,
            anchor: latlng,
            first: true,
            directionForced: !Array.isArray(layer._symbolPath.edit.first) || layer._symbolPath.edit.first.indexOf('rotate') === -1
          });
        }
      }
    }

    if(path.arrow){
      layer.arrows = layer.arrows || [];
      if(path.arrow.last){
        this.createArrowForLayer(layer, 'front');
      }
      if(path.arrow.first){
        this.createArrowForLayer(layer, 'back');
      }
    }

    if(path.text) {
      this.createTextForLayer(layer, path.text);
    }

    if(path.offset){
      data.offsetLayers = data.offsetLayers || [];
      data.offsetLayers.push({
        layer,
        offset: path.offset
      });
    }
    if((!path.offset || !path.paths || path.paths.length === 0) && data.offsetLayers?.length > 0){
      // No offset anymore
      layer.offsetLines = [
        this.createOffsetLines(data.offsetLayers, true),
        this.createOffsetLines(data.offsetLayers, false)
      ];
      data.offsetLayers = [];
    }

    if(path.paths){
      path.paths.forEach((subpath)=>{
        if(!layer.childs) layer.childs = [];
        const childLayer = this.goTroughPath(subpath, point, depth+1, layer._angle, disabled, ignoreScale, data);
        layer.childs.push(childLayer);
      })
    }

    if(layer.on && path.type !== 'HandlerPoint') {
      layer.on('pm:markerdragstart', (e)=>{
        const marker = e.markerEvent.target;

        const id = L.Util.stamp(marker);
        delete marker._parentPMLayer?._markerGroup?._layers[id];

        const markers = this._map.getContainer().querySelectorAll('.marker-icon:not(.marker-hidden)');

        markers.forEach((m)=>{
          m !== marker._icon && m.classList.add('marker-hidden');
        })

        this._hideHandlers = true;

      });
      layer.on('pm:markerdragend', (e)=>{
        const marker = e.markerEvent.target;
        this._map.removeLayer(marker);
        this._hideHandlers = false;
      });
      layer.on('pm:markerdrag', (e)=>{
        const marker = e.markerEvent.target;
        const pointMarker = this._map.project(marker.getLatLng(), this._zoom);
        let pxLength;

        const firstMarker = layer._allowedLatLngs.find((ll)=>ll.first && ll.latlng.equals(marker._initLatLng));

        if(firstMarker){
          const anchorMarkerPoint = this._map.project(firstMarker.anchor, this._zoom);

          pxLength = this.distance(pointMarker, anchorMarkerPoint);
          layer._cursor = pointMarker

          if(layer._depth === 0){
            this._pxCenter = pointMarker;
          }
        } else {
          pxLength = this.distance(pointMarker,layer._cursor);
        }

        layer._symbolPath.pxLength = pxLength / this._scale;


        if(Array.isArray(layer._symbolPath.edit.last) && layer._symbolPath.edit.last.indexOf('rotate') > -1) {
          layer._symbolPath.angle = this.angle(layer._cursor, pointMarker) -layer._angleBase;
        }
      });
      layer.on('pm:change', ()=>{
        this._render();
      })
      //
      // layer.on('pm:disable', ()=>{
      //   this._disabled();
      // })
      // layer.on('pm:enable', ()=>{
      //   this._alreadyDisabled = false;
      // })
    }
    return layer;
  },

  onAdd(map) {
    this._map = map;
    this._layerGroup.addTo(map);
    this._zoom = map.getZoom();
    this._pxCenter = this._map.project(this._map.getCenter(), this._zoom);
    this._render();
  },

  _render(){
    const enabled = this._layerGroup.pm.enabled();
    this._layerGroup.clearLayers();
    this._visibleLayersInEditMode = [];
    this._layerGroup.pm.disable();
    this.createLayerFromPaths(this._symbolPath, this._layerGroup);
    this._layerGroup.pm.setOptions(this.geomanOptions);
    enabled && this._layerGroup.pm.enable();
  },

  _disabled(){
    if(!this._alreadyDisabled){
      this._alreadyDisabled = true;
      this._render();
    }
  },

  _removeChildren(layer){
    if(layer.childs) {
      layer.childs.forEach((l)=>{

        if(!this._ignoreLayersFromRemoving.find((ignoreLayer)=>ignoreLayer === l)){
          l.removeFrom && l.removeFrom(this._layerGroup);
        }

        l.arrows && l.arrows.forEach((arrow)=>{
          arrow.removeFrom && arrow.removeFrom(this._layerGroup);
        });

        l.textMarker && l.textMarker.removeFrom(this._layerGroup);

        l.offsetLines && l.offsetLines.forEach((line)=>{
          line && line.removeFrom && line.removeFrom(this._layerGroup);
        });

        if(layer.childs){
          this._removeChildren(l);
        }
      });
    }
  },

  destination(point, angle, distance) {
    const result = {};

    result.x = Math.round(Math.cos(angle * Math.PI / 180) * distance + point.x);
    result.y = Math.round(Math.sin(angle * Math.PI / 180) * distance + point.y);

    return result;
  },

  distance(point1, point2){
    const {x: x1, y: y1} = point1;
    const {x: x2, y: y2} = point2;
    const y = x2 - x1;
    const x = y2 - y1;

    return Math.sqrt(x * x + y * y);
  },

  angle(point1, point2){
    return ((Math.atan2(point2.y - point1.y, point2.x - point1.x) * 180 / Math.PI)+360) % 360;
  },

  createArrowForLayer(layer, direction) {
    const arrow = L.polylineDecorator(layer, {
      patterns: [
        {
          offset: direction === 'front' ? '100%' : '0%',
          repeat: 0,
          // @ts-expect-error
          symbol: L.Symbol.arrowHead({
            sizePercent: 10,
            headAngle: direction === 'front' ? 60 : 300,
            polygon: false,
            pathOptions: {
              stroke: true,
              weight: layer.options.weight,
              color: layer.options.color,
              pmIgnore: true,
            },
          }),
        },
      ],
      pmIgnore: true,
    });
    arrow.addTo(this._layerGroup);
    layer.arrows.push(arrow);
  },

  createTextForLayer(layer, text) {
    const marker = L.polylineDecorator(layer, {
      patterns: [
        {
          offset: '50%',
          repeat: 0,
          // @ts-expect-error
          symbol: L.Symbol.marker({
            markerOptions: {
              icon: L.divIcon({
                html: `<span style="color: ${layer.options.color};font-weight: 900; font-size: 16px">${text}</span>`,
                className: 'text-marker',
                iconAnchor: [12,12]
              }),
              pmIgnore: true,
            },
          }),
        },
      ],
      pmIgnore: true,
    });
    marker.addTo(this._layerGroup);
    layer.textMarker = marker;
  },

  _bubbleEvents(e){
    this._layerGroup.fire(e.type, e);
  },

  _onHandlerMousemove(e){
    document.body.classList.add('leaflet-dragging');
    const point = this._map.project(e.latlng, this._zoom);

    let angle = null;
    if(this._tempHandler.rotate) {
      angle = this.angle(this._pxCenter, point);
    }

    if(this._tempHandler.scale) {
      const distanceNew = this.distance(this._pxCenter, point);

      // calculate the point without scaled length and scaled cursor
      const pointOrigin = this.destination(this._pxCenter, this._tempHandler._angle, this._tempHandler._symbolPath.pxLength);
      const distanceOrigin = this.distance(this._pxCenter, pointOrigin);
      this._scale = distanceNew / distanceOrigin;
    }

    this._symbolPath.paths.forEach((path)=>{
      if(angle !== null) {
        path.angle = angle;
      }
    });

    this._render()
  },
  createOffsetLines(layers, opposite){
    if(!layers || layers.length === 0){
      return;
    }
    const ring = [];
    layers.forEach((obj)=>{
      obj.layer.getLatLngs().forEach((ll)=>{
          ring.push(this._map.project(ll, this._zoom));
      });

      obj.layer.setStyle({fill: false, stroke: false});
      obj.layer.on('pm:enable', ()=>{
        obj.layer.setStyle({fill: true, stroke: true, dashArray: [0,5]});
      });
      obj.layer.on('pm:disable', ()=>{
        obj.layer.setStyle({fill: false, stroke: false});
      });

    });

    const ringOffset = L.PolylineOffset.offsetPoints(ring, {
      offset: layers[0].offset * (opposite ? -1 : 1),
      fill: false, stroke: false,
      pmIgnore: true,
      color: 'red'
    });

    const offsetLatLngs = [];
    ringOffset.forEach((xy)=>{
      offsetLatLngs.push(this._map.unproject(L.point(xy.x, xy.y), this._zoom));
    });

    const offsetLayer = L.polyline(offsetLatLngs, {pmIgnore: true}).addTo(this._layerGroup);
    return offsetLayer;
  }

});

L.PolylineOffset.joinSegments2 = function (s1, s2, offset, list, i) {
  const a = this.sharpArc(s1, s2, offset, list, i)
    .filter((x) => {
      // L.marker(window.map.unproject(L.point(x), 15)).addTo(window.fg);
      return x
    })

  return a
};

L.PolylineOffset.sharpArc2 = function (s1, s2, distance, list, i){
    // if the segments are the same angle,
    // there should be a single join point
    if (s1.offsetAngle === s2.offsetAngle) {
      return [s1.offset[1]];
    }
    let [a, b] = s2.offset;
    const direction = Math.atan2(a.y - b.y, a.x - b.x) > Math.PI / 2;
    const angleOffset = this.calculateAngleInDegrees(a,b);
    [a, b] = s2.original;
    const direction2 = Math.atan2(a.y - b.y, a.x - b.x) > Math.PI / 2;
  const angleOriginal = this.calculateAngleInDegrees(a,b);


    const signedAngle = this.getSignedAngle(s1.offset, s2.offset);
    const signedAngle2 = this.getSignedAngle(s1.original, s2.original);

    // for inner angles, just find the offset segments intersection
    if ((signedAngle * distance > 0) &&
      (signedAngle * this.getSignedAngle(s1.offset, [s1.offset[0], s2.offset[1]]) > 0)) {
      // we call the original function to get the intersection function
      // return this.circularArc(s1, s2, distance);

      // let abc = false
      //
      // if(list[i + 1] && abc) {
      //   const s2Next = list[i + 1];
      //   const signedAngleNext = this.getSignedAngle(s1.offset, s2Next.offset);
      //   console.log('BB', signedAngle, this.getSignedAngle(s1.offset, s2Next.offset), this.getSignedAngle(s1.offset, [s1.offset[0], s2.offset[1]]), this.getSignedAngle(s1.offset, [s1.offset[0], s2Next.offset[1]]))
      //   const intersectionPoint = this.intersection(s1.offset[0], s1.offset[1], s2Next.offset[0], s2Next.offset[1])
      //   if(intersectionPoint && (signedAngleNext * this.getSignedAngle(s1.offset, [s1.offset[0], s2Next.offset[1]])) <= 0){
      //     s2.offset = [intersectionPoint, s2Next.offset[0]];
      //     return [intersectionPoint];
      //   }
      //   // s2.offset = [intersectionPoint, intersectionPoint];
      //   // return [intersectionPoint];
      // }
      //
      //

      let intersectionPoint = this.intersection(s1.offset[0], s1.offset[1], s2.offset[0], s2.offset[1]);
      console.log('Deg',this.calculateAngleInDegrees(intersectionPoint, s2.offset[0]), this.calculateAngleInDegrees(...s2.original))
      // if(list[i + 1] && Math.round(this.calculateAngleInDegrees(intersectionPoint, s2.offset[0])) !== Math.round(this.calculateAngleInDegrees(...s2.original))){
      //   const s2Next = list[i + 1];
      //   intersectionPoint = this.intersection(s1.offset[0], s1.offset[1], s2Next.offset[0], s2Next.offset[1])
      //   s2.offset = [intersectionPoint, intersectionPoint];
      // }


      // s1.offset[1] = intersectionPoint;
      // s2.offset[0] = intersectionPoint;
      return [intersectionPoint];
    } else if(this.getSignedAngle(s1.offset, [s1.offset[0], s2.offset[1]]) <= 0){
      // TODO: Maybe the intersection point between s1 & s2 would work better

      // return [s1.offset[1]];
      if(list.length > i + 1 && false) {
        const s2Next = list[i + 1];

        const newP = this.intersection(s1.offset[0], s1.offset[1], s2Next.offset[0], s2Next.offset[1]) || s1.offset[1];
        // const newP = this.sharpArc(s1, s2Next, distance, list, i + 1);
        s2.offset = [newP, s2Next.offset[0]];
        return [newP];
      } else {
        return [s1.offset[1]];
      }
      // [this.intersection(s1.offset[0], s1.offset[1], s2Next.offset[0], s2Next.offset[1])]

      // const last = list[list.length -1] === s2;
      // if(last) {
      //   s2.offset = [s1.offset[1], s1.offset[1]];
      // }
      // return [s1.offset[1]];
    }
    return [s1.offset[1]];
};

/** TODOS
 * HandlerPoint not moving if pxCenter is moved
 * Dragging of whole Group
 * Drawing

 */
