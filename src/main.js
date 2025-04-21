import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as Sentry from "@sentry/vue";

const app = createApp(App)

Sentry.init({
    app,
    dsn: "https://dd57a97e99d41ca79b9604d71bef225c@o4509123224797184.ingest.us.sentry.io/4509183619170304",
    integrations: [
        Sentry.feedbackIntegration({
          // Disable the injection of the default widget
          autoInject: true,
        }),
      ],
});

app.use(router)
app.mount('#app')
