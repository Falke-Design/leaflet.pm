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
    // this._layerGroup.off('layeradd');
    this._symbolPath = path;

    this._masterLayer = null;

    this._ignoreLayersFromRemoving = [];

    this._scale = 1;
  },

  createLayerFromPaths(symbolPath){
    symbolPath.paths.forEach((path)=>{
      this.goTroughPath(path, this._pxCenter, 0);
    })
  },

  goTroughPath(path, cursor, depth, _angle, disabled, ignoreScale){
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
      layer.pm.setOptions(this.geomanOptions)
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

      layer._extraEvents = [];

      const pmEnable = ()=>{
        layer.addTo(this._layerGroup);
      };
      const pmDisable = ()=>{
        layer.removeFrom(this._layerGroup);
      };

      layer._extraEvents.push(pmEnable, pmDisable);

      this._layerGroup.on('pm:enable', pmEnable, this);
      this._layerGroup.on('pm:disable', pmDisable, this);

      layer.on('dragstart', ()=>{
        this._tempHandler = layer;
        this._tempScale = this._scale;
        this._map.on('mousemove', this._onHandlerMousemove, this);
        this._map.once('mouseup', ()=>{
          this._map.off('mousemove', this._onHandlerMousemove, this);
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

    if(path.edit){
      if(path.edit.last){
        layer._allowedLatLngs.push(latlng)
      } else if(path.edit.first){
        layer._allowedLatLngs.push(cursorLatLng);
        layer._allowedLatLngsFirst.push({
          latlng: cursorLatLng,
          anchor: latlng
        })
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

    if(path.paths){
      path.paths.forEach((subpath)=>{
        if(!layer.childs) layer.childs = [];
        layer.childs.push(this.goTroughPath(subpath, point, depth+1, layer._angle, disabled, ignoreScale))
      })
    }

    if(layer.on && path.type !== 'HandlerPoint') {
      layer.on('pm:markerdragstart', (e)=>{
        const marker = e.markerEvent.target;

        const markers = this._map.getContainer().querySelectorAll('.marker-icon:not(.marker-hidden)');

        markers.forEach((m)=>{
          m !== marker._icon && m.classList.add('marker-hidden');
        })

      });
      layer.on('pm:markerdrag', (e)=>{
        const marker = e.markerEvent.target;
        const pointMarker = this._map.project(marker.getLatLng(), this._zoom);
        let pxLength;

        const firstMarker = layer._allowedLatLngsFirst.find((ll)=>ll.latlng.equals(marker._initLatLng));

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

        if(layer.childs){
          this._removeChildren(layer);
          layer.childs = [];
          const point = this.destination(layer._cursor, layer._angle, layer._symbolPath.pxLength * this._scale);

          layer._symbolPath.paths.forEach((subpath)=>{
            if(!layer.childs) layer.childs = [];
            layer.childs.push(this.goTroughPath(subpath, point, layer._depth+1, layer._angle, true, true))
          })
          this._layerGroup.pm.setOptions(this.geomanOptions)
        }

        if(layer.arrows){
          layer.arrows.forEach((arrow)=>{
            arrow.removeFrom && arrow.removeFrom(this._layerGroup);
          });

          if(layer._symbolPath.arrow.last){
            this.createArrowForLayer(layer, 'front');
          }
          if(layer._symbolPath.arrow.first){
            this.createArrowForLayer(layer, 'back');
          }
        }

        if(layer._symbolPath.text) {
          layer.textMarker.removeFrom(this._layerGroup);
          this.createTextForLayer(layer, layer._symbolPath.text);
        }

      });
      layer.on('pm:edit', ()=>{
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

        l._extraEvents && l._extraEvents.forEach((event)=>{
          this._layerGroup.off('pm:enable', event, this);
        })


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
    this._removeChildren({ childs: this._layerGroup.getLayers() });

    let angle = null;
    if(this._tempHandler.rotate) {
      angle = this.angle(this._pxCenter, point);
    }

    if(this._tempHandler.scale) {
      const distanceNew = this.distance(this._pxCenter, point);

      // calculate the point without scaled length and scaled cursor
      const pointOrigin = this.destination(this._pxCenter, this._tempHandler._angle, this._tempHandler._symbolPath.pxLength);
      const distanceOrigin = this.distance(this._pxCenter, pointOrigin);

      const scale = distanceNew / distanceOrigin;

      this._scale = scale;
    }

    this._symbolPath.paths.forEach((path)=>{
      if(angle !== null) {
        path.angle = angle;
      }
      this.goTroughPath(path, this._pxCenter, 0, 0, true, false);
    })
  }

});


/** TODOS
 * HandlerPoint not moving if pxCenter is moved
 * Dragging of whole Group
 * Drawing

 */
