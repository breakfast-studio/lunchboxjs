// These keys originally used Symbols per Vue instructions,
// but differing dev/build values made dev difficult.
// These strings have some risk of namespace collision,
// but that's a low enough risk that they're worth hardcoding
// as strings, in my opinion.

export const globalsInjectionKey = 'lunchbox-globals' // Symbol()
export const updateGlobalsInjectionKey = 'lunchbox-updateGlobals' // Symbol()

export const setCustomRenderKey = 'lunchbox-setCustomRender' // Symbol()
export const clearCustomRenderKey = 'lunchbox-clearCustomRender' //Symbol()

export const beforeRenderKey = 'lunchbox-beforeRender' // Symbol()
export const onBeforeRenderKey = 'lunchbox-onBeforeRender' //Symbol()
export const offBeforeRenderKey = 'lunchbox-offBeforeRender' // Symbol()

export const afterRenderKey = 'lunchbox-afterRender' // Symbol()
export const onAfterRenderKey = 'lunchbox-onAfterRender' // Symbol()
export const offAfterRenderKey = 'lunchbox-offAfterRender' // Symbol()

export const frameIdKey = 'lunchbox-frameId' // Symbol()
export const watchStopHandleKey = 'lunchbox-watchStopHandle' // Symbol()

export const appRootNodeKey = 'lunchbox-appRootNode' // Symbol()
export const appKey = 'lunchbox-appKey' //  Symbol()
export const appRenderersKey = 'lunchbox-renderer' //Symbol()
export const appSceneKey = 'lunchbox-scene' // Symbol()
export const appCameraKey = 'lunchbox-camera' //Symbol()
export const lunchboxInteractables = 'lunchbox-interactables' // Symbol()

export const startCallbackKey = 'lunchbox-startCallback' // Symbol()
