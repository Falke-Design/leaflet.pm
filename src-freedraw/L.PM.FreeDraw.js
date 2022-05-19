import './L.PM.Draw.FreeDraw';

L.PM.FreeDraw = {
  initialize() {
    function initMap() {
      const map = this;
      const name = 'FreeDraw';
      map.pm.Draw.createNewDrawInstance(name, name);

      // Click button -> toggle disabled
      map.pm.Toolbar.createCustomControl({
        name,
        block: 'draw',
        className: 'leaflet-pm-icon-polyline',
        title: 'Free drawing',
        afterClick: (e, ctx) => {
          // toggle drawing mode
          map.pm.Draw[ctx.button._button.jsClass].toggle();
        },
        toggle: false,
        disableOtherButtons: true,
        position: map.pm.Toolbar.options.position,
        actions: ['cancel'],
      });
    }
    L.Map.addInitHook(initMap);
  },
};
L.PM.FreeDraw.initialize();
