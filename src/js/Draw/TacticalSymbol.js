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

      if(path.edit.last){
        layer._allowedLatLngs.push({
          latlng,
          directionForced: !Array.isArray(layer._symbolPath.edit.last) || layer._symbolPath.edit.last.indexOf('rotate') === -1
        })
      } else if(path.edit.first){
        layer._allowedLatLngs.push({
          latlng: cursorLatLng,
          anchor: latlng,
          first: true,
          directionForced: !Array.isArray(layer._symbolPath.edit.first) || layer._symbolPath.edit.first.indexOf('rotate') === -1
        });
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

        const markers = this._map.getContainer().querySelectorAll('.marker-icon:not(.marker-hidden)');

        markers.forEach((m)=>{
          m !== marker._icon && m.classList.add('marker-hidden');
        })

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

        if(layer.childs){
          this._removeChildren(layer);
          layer.childs = [];
          let point;
          if(Array.isArray(layer._symbolPath.edit.last) && layer._symbolPath.edit.last.indexOf('rotate') > -1) {
            point = pointMarker;
            layer._symbolPath.angle = layer._angleBase + this.angle(layer._cursor, point);
            // layer._angle = this.angle(layer._cursor, point);
          }else{
            point = this.destination(layer._cursor, layer._angle, layer._symbolPath.pxLength * this._scale);
          }


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
  },
  createOffsetLines(layers, opposite){
    if(!layers || layers.length === 0){
      return;
    }

    const line = L.polyline(layers[0].layer.getLatLngs(), {
      offset: layers[0].offset * (opposite ? -1 : 1),
      fill: false, stroke: false,
      pmIgnore: true,
      color: 'red'
    }).addTo(this._map);

    layers.forEach((obj)=>{
      obj.layer.getLatLngs().forEach((ll, idx)=>{
        // skip first entry, because the previous layer shares the same latlng
        if(idx > 0){
          line.addLatLng(ll);
        }
      });
      obj.layer.setStyle({fill: false, stroke: false});
      obj.layer.on('pm:enable', ()=>{
        obj.layer.setStyle({fill: false, stroke: true});
      });
      obj.layer.on('pm:disable', ()=>{
        obj.layer.setStyle({fill: false, stroke: false});
      });
    });

    const ring =  line._rings[0];

    const offsetLatLngs = [];
    ring.forEach((xy)=>{
      offsetLatLngs.push(this._map.layerPointToLatLng(L.point(xy.x, xy.y)));
    });

    line.removeFrom(this._map);

    const offsetLayer = L.polyline(offsetLatLngs, {pmIgnore: true}).addTo(this._layerGroup);
    return offsetLayer;
  },
  createOffsetLines2(layers, opposite){
    if(!layers || layers.length === 0){
      return;
    }
    const segmente = [];
    layers.forEach((obj)=>{
      const ring = [];
      obj.layer.getLatLngs().forEach((ll)=>{
        ring.push(this._map.project(ll, this._zoom));
      });

      segmente.push(...L.PolylineOffset.offsetPointLine(L.LineUtil.simplify(ring, 1), obj.offset * (opposite ? -1 :1), this._map));
      obj.layer.setStyle({fill: false, stroke: false});
      obj.layer.on('pm:enable', ()=>{
        obj.layer.setStyle({fill: true, stroke: true});
      });
      obj.layer.on('pm:disable', ()=>{
        obj.layer.setStyle({fill: false, stroke: false});
      });

    });

    const ringPts = L.PolylineOffset.joinLineSegments(segmente, layers[0].offset);

    // const segmentePts = [];
    // segmentePts.push(...L.PolylineOffset.offsetPointLine(L.LineUtil.simplify(ringPts, 1), 0, this._map));
    // const ring = L.PolylineOffset.joinLineSegments(segmentePts, 0);

    const ring = ringPts;

    const offsetLatLngs = [];
    ring.forEach((xy)=>{
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
