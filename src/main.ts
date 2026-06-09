import { createApp } from "vue";
import { setupStore } from "@/store";
import router from "./router";
import App from "./App.vue";
import "./style/index.css";
import "./style/global.css";
import "./style/element-plus.css";

const app = createApp(App);

setupStore(app);
app.use(router);
app.mount("#app");
