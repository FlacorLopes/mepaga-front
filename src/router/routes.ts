import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Index.vue') }],
  },
  {
    path: '/area-privada',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'MyInvoices',
        path: 'minhas-faturas',
        component: () => import('pages/MyInvoices.vue'),
      },
      {
        name: 'InvoiceViewer',
        path: 'fatura/:id',
        component: () => import('pages/InvoiceViewer.vue'),
      },
    ],
  },
  {
    path: '/connect',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'google/redirect',
        component: () => import('pages/auth/Google.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
