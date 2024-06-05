---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Lunchbox 2"
  text: "ThreeJS Web Components"
  tagline: Write once, use in any (or no) framework.
  actions:
    - theme: brand
      text: Get started
      link: /guide
    # - theme: alt
    #   text: API Examples
    #   link: /api-examples

features:
  # - title: ThreeJS in native web components
  #   details: react-three-fiber anywhere
  - title: Create this...
    details: <three-lunchbox><three-mesh position-z="-5"><torus-knot-geometry></torus-knot-geometry><mesh-normal-material></mesh-normal-material></three-mesh></three-lunchbox>
  - title: ...with this
    details: <code>&lt;three-lunchbox><br/>&nbsp;&nbsp;&lt;three-mesh position-z="-5"><br/>&nbsp;&nbsp;&nbsp;&nbsp;&lt;torus-knot-geometry>&lt;/torus-knot-geometry><br/>&nbsp;&nbsp;&nbsp;&nbsp;&lt;mesh-normal-material>&lt;/mesh-normal-material><br/>&nbsp;&nbsp;&lt;/three-mesh><br/>&lt;/three-lunchbox></code>
---

