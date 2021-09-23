import Vue from 'vue'
import Router from 'vue-router'
import authService from '../services/auth-service';

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      meta: {
        allowAnonymous: true
      },
      component: () => import(/* webpackChunkName: "search" */ '../views/Home.vue')
    },
    {
      path: '/documents',
      name: 'documents',
      component: () => import(/* webpackChunkName: "search" */ '../views/Documents.vue')
    },
    {
      path: '/shared_with_me',
      name: 'sharedDocuments',
      component: () => import(/* webpackChunkName: "search" */ '../views/DocumentsShared.vue')
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        allowAnonymous: true
      },
      component: () => import(/* webpackChunkName: "search" */ '../views/Login.vue')
    },
  ]
});

router.beforeEach((to, _from, next) => {
  if (!to.meta.allowAnonymous && !authService.isLogggedIn()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  }
  else {
    next()
  }  
});


export default router;