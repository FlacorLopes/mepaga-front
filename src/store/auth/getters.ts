import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';

const getters: GetterTree<AuthStateInterface, StateInterface> = {
  auth(state: AuthStateInterface): AuthStateInterface {
    return {
      ...state,
    };
  },
};

export default getters;
