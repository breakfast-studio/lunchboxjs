<script setup lang="ts">
import Basic from './Basic.vue'
</script>


<template>
    <Story title="Basic">
        <Variant title="playground">
            <div id="lunchbox-story">
                <lunchbox :root="Basic" />
            </div>
        </Variant>
    </Story>
</template>

<style>
.htw-sandbox-contain {
    contain: initial;
}
</style>