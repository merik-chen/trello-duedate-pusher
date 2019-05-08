import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const r = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ './views/Home.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue'),
    },
    {
      path: '/rToken',
      name: 'rToken',
      component: () => import(/* webpackChunkName: "rToken" */ './views/ProcessToken.vue'),
    },
  ],
});

r.beforeEach((to, from, next) => {
  const apikey = localStorage.getItem('trello-api-token');
  if ((to.name !== 'login') && (to.name !== 'rToken')) {
    if (apikey === null) next({ name: 'login', query: { error: 'apiTokenLost' }, replace: true });
  }

  if ((to.name === 'login') && apikey) {
    next({ name: 'home', replace: true });
  }

  next();
});

export default r;
