# Events

Lunchbox 2 components can trigger [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) instances at different points in their lifecycles.

## Built-in events

### `<three-lunchbox>` events

If `dispatch-after-render` and/or `dispatch-before-render` attributes are set to `true` on the `<three-lunchbox>` wrapper, `afterrender` and `beforerender` events, respectively, will be dispatched. These events do not have any data in the `details` parameter. 

For example, in TypeScript:

```html
<!-- remember that a blank value equals `true` for HTML attributes -->
<three-lunchbox 
    dispatch-after-render 
    dispatch-before-render
>
</three-lunchbox>
```

```ts
import { type ThreeLunchbox } from 'lunchboxjs';

const lunchbox = document.querySelector('three-lunchbox');
lunchbox?.addEventListener<CustomEvent<object>>(
    'beforerender', 
    evt => console.log('before', evt)
);
lunchbox?.addEventListener<CustomEvent<object>>(
    'afterrender', 
    evt => console.log('after', evt)
);
```

## Common events

All [auto-registered](/components/component-guide.html#auto-registered-components) and [`extend`ed components](/components/component-guide.html#custom-components-via-extend) trigger the following events. 

Note that a [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) passes data via its `detail` property; this is the unique data of each event, and so is the payload in the `detail` column below.

| Name              | `detail`                                 | Notes                                                                                                   |
| ----------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `instancecreated` | `{ instance: /* the ThreeJS object */ }` | Fired when the underling [instance](/components/component-guide.html#the-instance-property) is created. |

### Examples

```js
const mesh = document.querySelector('three-mesh');
mesh.addEventListener('instancecreated', event => {
    console.log(event.detail.instance);
});
```

In TypeScript, this you can get type completion with the `InstanceEvent` generic type:

```ts
import { type Lunchbox, type InstanceEvent } from 'lunchboxjs';
import * as THREE from 'three';

const mesh = document.querySelector<Lunchbox<THREE.Mesh>>('three-mesh');
mesh.addEventListener('instancecreated', (event: CustomEvent<InstanceEvent<THREE.Mesh>>) => {
    console.log(event.detail.instance);
});
```
