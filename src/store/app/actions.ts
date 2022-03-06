import { date } from 'quasar';
import {
  IInvoice,
  IPurchase,
  IPurchaser,
} from 'src/services/app/dto/InvoiceDTO';
import { AppService } from 'src/services/app/AppService';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AppStateInterface } from './state';
import { ResponseObject } from 'src/services/StrapiResponseWrapper';

const invoiceService = new AppService();
const actions: ActionTree<AppStateInterface, StateInterface> = {
  async load({ commit }) {
    commit('setLoading', true);
    const invoices = await invoiceService.getInvoices();

    invoices.forEach((i) => {
      // p.attributes.date = date.formatDate(p.attributes.date, 'DD MM YYYY');
      console.log(i);
      (i as unknown as ResponseObject<IInvoice>).attributes.dueDate =
        date.formatDate(
          (i as unknown as ResponseObject<IInvoice>).attributes.dueDate,
          'DD MM YYYY'
        );
    });
    commit('setInvoices', invoices);
  },

  async loadInvoice({ commit }, id: string) {
    commit('setLoading', true);
    const invoice = await invoiceService.getInvoice(id);
    await this.dispatch('invoices/loadUserPurchasersList');

    const purchasersFound: IPurchaser[] = [];

    // separates unique purchasers into purchasersFound
    invoice.purchases.data.forEach((p) => {
      p.attributes.date = date.formatDate(p.attributes.date, 'DD MM YYYY');
      p.attributes.purchasers.data.forEach((purchaser) => {
        if (
          !purchasersFound.some(
            (purchaserFound) =>
              purchaserFound.name === purchaser.attributes.name
          ) &&
          !purchaser.attributes.representsUser
        )
          purchasersFound.push({ ...purchaser.attributes, id: purchaser.id });
      });
    });
    commit('setCurrentInvoice', invoice);
    commit('setPurchasers', purchasersFound);
  },

  async addPurchaser({ commit, state }, name: string) {
    const purchaser = await invoiceService.createPurchaser(name);
    console.log(purchaser);
    commit('setPurchasers', [...state.purchasers, purchaser]);
    commit('setUserPurchasersList', [...state.userPurchaserList, purchaser]);
  },

  async addPurchaserToPurchase(
    { commit, state },
    params: { purchasersIds: number[]; purchaseId: number }
  ) {
    if (!state.currentInvoice?.purchases)
      throw new Error('Current invoice is empty');

    const purchase = await invoiceService.addPurchaserToPurchase(
      params.purchasersIds,
      params.purchaseId
    );

    const purchaseReferenceIndex =
      state.currentInvoice.purchases.data.findIndex((p) => p.id == purchase.id);

    // https://laracasts.com/discuss/channels/vue/vue2-properly-clone-a-vuex-object-for-manipulation
    // deep copies the object from store;
    // Otherwise Vuex complains about mutating state(because the objects are proxies)
    const copy = JSON.parse(
      JSON.stringify(state.currentInvoice.purchases.data)
    ) as ResponseObject<IPurchase>[];

    copy[purchaseReferenceIndex].attributes = purchase;
    commit('setCurrentInvoice', {
      ...state.currentInvoice,
      purchases: {
        data: copy,
      },
    } as IInvoice);
  },

  async loadUserPurchasersList({ commit }) {
    const list = await invoiceService.getPurchasers();
    commit('setUserPurchasersList', list);
  },
};

export default actions;
