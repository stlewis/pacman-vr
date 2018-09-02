var extendDeep = AFRAME.utils.extendDeep;
var meshMixin = AFRAME.primitives.getMeshMixin();

AFRAME.registerPrimitive('a-pac-dot', extendDeep({}, meshMixin, {
  defaultComponents: {
    geometry: { primitive: 'box', width: 0.5, height: 0.5, depth: 0.5 },
    material: { color: '#FFFFFF' },
    dot: { pointValue: 10 },
    //animation: { property: 'rotation', easing: "linear", to: '45 45 45', dur: 1000, dir: 'normal', loop: true  }
  },

  mappings: {
    geometry: 'geometry',
    depth: 'geometry.depth',
    height: 'geometry.height',
    width: 'geometry.width',
    color: 'material.color',
    pointvalue: 'dot.pointValue',
    grantsinvulnerability: 'dot.grantsInvulnerability'
  }


}));
