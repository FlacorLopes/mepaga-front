import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { LocalStorage } from 'quasar';
import { AuthResponseDTO } from 'src/services/auth/dto/AuthDTO';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: 'http://localhost:1337/' });

export default boot(({ app, store }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API

  const authStorage: AuthResponseDTO = LocalStorage.getItem('authentication');
  console.log('axios auth', authStorage);

  if (authStorage?.jwt) store.commit('authentication/setLoggedIn', authStorage);
  else store.commit('authentication/setLoggedOut');

  api.interceptors.request.use((config) => {
    const authStorage: AuthResponseDTO = LocalStorage.getItem('authentication');

    if (authStorage?.user) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      api.defaults.headers['Authorization'] = 'Bearer ' + authStorage.jwt;
    }
    return config;
  });
});

export { api };
