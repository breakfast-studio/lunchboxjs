Lunchbox 2 lets you write [ThreeJS](https://threejs.org/) scenes using [web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components). You can use it in any (or no) framework.

```html
<three-lunchbox>
  <three-mesh position-z="-5">
    <torus-knot-geometry></torus-knot-geometry>
    <mesh-normal-material></mesh-normal-material>
  </three-mesh>
</three-lunchbox>
```

## Docs

[Install](https://docs.lunchboxjs.com/install.html)

[Full docs](https://docs.lunchboxjs.com/)

## About

Lunchbox started as a Vue + ThreeJS custom renderer, but from version 2 on will be focused on web components built into browsers.

## Local Dev

`npm install`, then `npm run dev` to run dev server. From there, edit source code in the LunchboxJS package's `/src/...` and examples in `/index.html/...` to build and test features.

`npm run test` to run headless tests, `npm run cy:open` to open Cypress test suites.

`npm run docs:dev` to run docs locally.

## Publishing

`npm run test` to make sure all tests pass, then `npm run publish`.