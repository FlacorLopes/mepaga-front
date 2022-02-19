import { AppService } from 'src/services/app/AppService';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AppStateInterface } from './state';

const invoiceService = new AppService();
const actions: ActionTree<AppStateInterface, StateInterface> = {
  async load({ commit }) {
    commit('setLoading', true);
    const invoices = await invoiceService.getInvoices();
    commit('setInvoices', invoices);
  },

  async loadInvoice({ commit }, id: string) {
    commit('setLoading', true);
    const invoice = await invoiceService.getInvoice(id);
    console.log('loaded invoice', invoice);
    commit('setCurrentInvoice', invoice);
  },
};

export default actions;
