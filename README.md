Custom Vue 3 renderer for ThreeJS.

## Full Docs

[Docs](//docs.lunchboxjs.com)

## Local Dev

`npm run dev` to run dev server. From there, edit source code in `/src/...` and examples in `/demo/...` to build and test features.

### Creating Examples

Run `npm run demo:create` to create a new demo.

## Docs Dev

`npm run docs:dev` to run docs dev. Docs exist as a Vitepress site in the `/docs` folder.

## App-level globals migration

-   `src/index.ts`
    -   `globals`
        -   ~~`dpr`~~
        -   `inputActive`
        -   `mousePos`
    -   ~~`camera`~~
    -   ~~`renderer`~~
    -   ~~`scene`~~
    -   ~~`app`~~
    -   ~~`queuedCustomRenderFunction`~~
-   ~~`src/core/update.ts`~~
    -   ~~`frameId`~~
    -   ~~`watchStopHandle`~~
    -   ~~`beforeRender`~~
    -   ~~`afterRender`~~
-   ~~`src/core/start.ts`~~
    -   ~~`startCallbacks`~~
-   ~~`src/core/minidom.ts`~~
    -   ~~`rootNode`~~
-   `src/core/ensure.ts`
    -   `lunchboxRootNode`
    -   `autoCreated`
    -   `overrides`
    -   ~~`defaultCamera`~~
    -   ~~`cameraReady`~~
    -   ~~`ensuredCamera`~~
    -   ~~`ensuredRenderer`~~
    -   ~~`rendererReady`~~
    -   ~~`ensuredScene`~~
    -   `ensuredRaycaster`
-   `src/core/allNodes.ts`
    -   `allNodes`
-   `src/core/interaction/input.ts`
    -   `inputActive`
-   `src/core/interaction/interactables.ts`
    -   `interactables`
-   `src/core/interaction/setupAutoRaycaster.ts`
    -   `mouseMoveListener`
    -   `mouseDownListener`
    -   `mouseUpListener`
    -   `mousePos`
    -   `autoRaycasterEventsInitialized`
    -   `frameId`
    -   `currentIntersections`
