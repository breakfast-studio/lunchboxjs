# LunchboxJS

<div style="margin-top: 20px; width: 100%; height: 0; padding-bottom: 56.25%; position: relative;">
    <iframe style="position: absolute; top: 0; right: 0;
    bottom: 0; frame: none; left: 0; width: 100%;
    height: 100%; border: none;" src="https://lunchbox-memory.netlify.app/"/>
</div>

[source for this demo](https://github.com/breakfast-studio/memory-game)

LunchboxJS (or just Lunchbox) is a Vue 3 custom renderer for [Three.js](https://threejs.org/). Think of it like [react-three-fiber](https://github.com/pmndrs/react-three-fiber) for Vue. You can write Three scenes in Vue components like this:

```html
<template>
    <Lunchbox background="white">
        <mesh position-z="-5">
            <boxGeometry />
            <meshBasicMaterial color="green" />
        </mesh>
    </Lunchbox>
</template>
```

<iframe src="https://codesandbox.io/embed/lunchboxjs-template-7owyy?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="lunchboxjs-template"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

From there, you can add interactivity and reactivity:

```html
<template>
    <!-- click the box to change colors -->
    <Lunchbox background="white">
        <mesh @click="colorIndex++" position-z="-5">
            <boxGeometry />
            <meshBasicMaterial :color="color" />
        </mesh>
    </Lunchbox>
</template>

<script>
    export default {
        data() {
            return {
                colors: ['green', 'blue', 'yellow', '#ccc'],
                colorIndex: 0,
            }
        },
        computed: {
            color() {
                return this.colors[this.colorIndex % this.colors.length]
            },
        },
    }
</script>
```

<iframe src="https://codesandbox.io/embed/lunchbox-interactivity-flqob?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="lunchbox-interactivity"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

Lunchbox is a full custom renderer for Vue 3 and Three.js, which differentiates it from other projects like the excellent [TroisJS](https://troisjs.github.io/). It's still early in development but is ready for production, with several [examples](https://twitter.com/lunchboxjs) available.
