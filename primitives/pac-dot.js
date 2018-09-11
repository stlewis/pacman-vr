var extendDeep = AFRAME.utils.extendDeep;
var meshMixin = AFRAME.primitives.getMeshMixin();

AFRAME.registerPrimitive('a-pac-dot', extendDeep({}, meshMixin, {
  defaultComponents: {
    geometry: { primitive: 'box', width: 0.5, height: 0.5, depth: 0.5 },
    material: { color: '#FFFFFF' },
    dot: { pointValue: 10 },
  },

  mappings: {
    color: 'material.color',
    pointvalue: 'dot.pointValue',
    grantsinvulnerability: 'dot.grantsInvulnerability'
  }


}));
