<template>
    <main class="home">
        <h1>Lunchbox V2</h1>
        <ul>
            <li class="single-demo" v-for="(item, i) in demos" :key="i">
                <a
                    :href="
                        item.url ??
                        `/${item.title[0].toLowerCase()}${item.title.slice(1)}/`
                    "
                    >{{ item.title }}</a
                >
            </li>
        </ul>
    </main>
</template>

<script lang="ts" setup>
import demos from './demos.json'
</script>