# LunchboxJS

LunchboxJS (or just Lunchbox) is a Vue 3 custom renderer for [Three.js](https://threejs.org/). You can write Three scenes in Vue components like this:

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
