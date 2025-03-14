import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import './index.css';

createApp(App)
  .use(router)  // Ensure you're using the router
  .mount('#app');
