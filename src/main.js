import { createApp } from "vue";
import { createPinia } from "pinia";
import FontAwesome from "@/plugins/FontAwesome";

import App from "./App.vue";
import router from "./router";
import "./assets/main.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(FontAwesome);

app.mount("#app");
