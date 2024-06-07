⚠️ **Under active development!** ⚠️

Lunchbox 2 lets you write [ThreeJS](https://threejs.org/) scenes using [web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components).

```html
<three-lunchbox>
  <three-mesh position-z="-5">
    <torus-knot-geometry></torus-knot-geometry>
    <mesh-normal-material></mesh-normal-material>
  </three-mesh>
</three-lunchbox>
```

## About

Lunchbox 2 is still in active development. Expect breaking changes until the full `2.0.0` version is released.

Lunchbox started as a Vue + ThreeJS custom renderer, but from version 2 on will be focused on web components built into browsers.

## Full Docs

[docs.lunchboxjs.com](https://docs.lunchboxjs.com/) _(under development)_

## Local Dev

`npm install`, then `npm run dev` to run dev server. From there, edit source code in the LunchboxJS package's `/src/...` and examples in `/index.html/...` to build and test features.

`npm run test` to run headless tests, `npm run cy:open` to open Cypress test suites.

`npm run docs:dev` to run docs locally.

## Publishing

`npm run test` to make sure all tests pass, then `npm run publish`.