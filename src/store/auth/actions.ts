import { AuthService } from 'src/services/auth/AuthService';
import { AuthRequestDTO } from 'src/services/auth/dto/AuthDTO';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';

const authService = new AuthService();

const actions: ActionTree<AuthStateInterface, StateInterface> = {
  async login({ commit }, params: AuthRequestDTO) {
    commit('setLoading', true);
    const data = await authService.login(params);
    console.log(data);
    commit('setLoggedIn', data);
    commit('setLoading', false);
  },
  logout({ commit }) {
    authService.logout();
    commit('setLoggedOut');
  },
};

export default actions;
