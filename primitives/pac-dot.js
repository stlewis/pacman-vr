var extendDeep = AFRAME.utils.extendDeep;
var meshMixin = AFRAME.primitives.getMeshMixin();

AFRAME.registerPrimitive('a-pac-dot', extendDeep({}, meshMixin, {
  defaultComponents: {
    geometry: { primitive: 'box', width: 0.25, height: 0.25, depth: 0.25 },
    material: { color: '#FFFFFF' },
    dot: {},
    animation: { property: 'rotation', from: '-45 -45 -45', to: '45 45 45', dur: 1000, dir: 'normal', loop: true  }
  },

  mappings: {
    depth: 'geometry.depth',
    height: 'geometry.height',
    width: 'geometry.width',
    color: 'material.color',
    pointValue: 'dot.pointValue',
    grantsInvulnerability: 'dot.grantsInvulnerability'
  }


}));
