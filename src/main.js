import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

// import { initializeApp } from "firebase/app";
// import firebaseConfig from "@/config/firebase.js";
// initializeApp(firebaseConfig);

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.mount("#app");
