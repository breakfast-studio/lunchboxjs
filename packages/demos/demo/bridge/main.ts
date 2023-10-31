import { createApp } from "vue";
import { lunchbox } from "../../";
import App from "./HtmlApp.vue";

createApp(App).use(lunchbox).mount("#app");
