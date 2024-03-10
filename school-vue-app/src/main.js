import Vue from 'vue'
import App from './App.vue'

import './assets/main.css'

// Check if the browser supports service workers
/*
if ('serviceWorker' in navigator) {
  // Register the service worker
  navigator.serviceWorker.register('/service-worker.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}
*/

Vue.config.productionTip = false

new Vue({
  render: (h) => h(App)
}).$mount('#app')
