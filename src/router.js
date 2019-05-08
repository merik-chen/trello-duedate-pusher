import Vue from 'vue';
import Router from 'vue-router';

import Home from './views/Home.vue';
import Login from './views/Login.vue';
import ProcessToken from './views/ProcessToken.vue';

Vue.use(Router);

const r = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/rToken',
      name: 'rToken',
      component: ProcessToken,
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
