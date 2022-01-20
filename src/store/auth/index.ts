import { StateInterface } from './../index';
import { Module } from 'vuex';
import state, { AuthStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const authenticationModule: Module<AuthStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default authenticationModule;
