import { createApp, h } from 'vue';
import { createRouter, createWebHistory, RouterView, useRoute } from 'vue-router';
const Order = { setup: () => () => h('h1', `Order ${useRoute().params.id}`) };
const router = createRouter({
    history: createWebHistory('/admin/'),
    routes: [{ path: '/', component: { render: () => h('h1', 'Admin') } }, { path: '/orders/:id', component: Order }],
});
createApp({ render: () => h(RouterView) }).use(router).mount('#app');
