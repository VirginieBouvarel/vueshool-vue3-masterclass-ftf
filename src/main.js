import { createApp } from "vue";
import { createPinia } from "pinia";
import FontAwesome from "@/plugins/FontAwesome";
import ClickOutsideDirective from "@/plugins/ClickOutsideDirective";
import PageScrollDirective from "@/plugins/PageScrollDirective";

import App from "./App.vue";
import router from "./router";
import "./assets/main.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(FontAwesome);
app.use(ClickOutsideDirective);
app.use(PageScrollDirective);

app.mount("#app");
