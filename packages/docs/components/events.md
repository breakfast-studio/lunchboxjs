# Events

Lunchbox 2 components can trigger [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) instances at different points in their lifecycles.

## Built-in events

Currently, [built-in components](/component-guide.html#built-in-components) do not trigger any special events.

## Common events

All [auto-registered](/component-guide.html#auto-registered-components) and [`extend`ed components](/component-guide.html#custom-components-via-extend) trigger the following events. 

Note that a [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) passes data via its `detail` property; this is the unique data of each event, and so is the payload in the `detail` column below.

| Name              | `detail`                                 | Notes      |
| ----------------- | ---------------------------------------- | ---------- |
| `instancecreated` | `{ instance: /* the ThreeJS object */ }` | Fired when |

### Examples

```html
<three-lunchbox>
  <three-mesh position-z="-5" oninstancecreated="console.log(event.detail)">
    <torus-knot-geometry></torus-knot-geometry>
    <mesh-normal-material></mesh-normal-material>
  </three-mesh>
</three-lunchbox>
```

<three-lunchbox>
  <three-mesh position-z="-5" oninstancecreated="console.log('zzz')">
    <torus-knot-geometry></torus-knot-geometry>
    <mesh-normal-material></mesh-normal-material>
  </three-mesh>
</three-lunchbox>
