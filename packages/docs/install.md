# Install

## Methods

Lunchbox 2 is available in a few different formats:

### With npm

1. Run `npm install three lit lunchboxjs`. This will install ThreeJS, [Lit](https://lit.dev/), and Lunchbox 2.
2. In your code, import and run `initLunchbox`:

```ts
import { initLunchbox } from 'lunchboxjs';

initLunchbox();
```

### Vanilla 

1. Follow the instructions to [install ThreeJS](https://threejs.org/manual/#en/installation).
2. Follow the instructions to [install Lit](https://lit.dev/docs/getting-started).
3. Add this code to your `<head>` tag (you can also add the `lunchboxjs` property to your importmap from previous steps):

```html
<script type="importmap">
  {
    "imports": {
      "lunchboxjs": "https://cdn.jsdelivr.net/npm/lunchboxjs/dist/lunchboxjs.js",
    }
  }
</script>
```

4. Add this code to the body:

```html
<script type="module">
import { initLunchbox } from 'lunchboxjs';
initLunchbox();
</script>
```

## Next steps

You can now use Lunchbox web components - for example:

```html
<three-lunchbox>
    <three-mesh position-z="-5">
        <icosahedron-geometry></icosahedron-geometry>
        <mesh-normal-material></mesh-normal-material>
    </three-mesh>
</three-lunchbox>
```

<three-lunchbox>
    <three-mesh position-z="-5">
        <icosahedron-geometry></icosahedron-geometry>
        <mesh-normal-material></mesh-normal-material>
    </three-mesh>
</three-lunchbox>

See [core concepts](/concepts.html) for next steps.