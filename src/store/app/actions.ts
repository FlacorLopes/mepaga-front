import { ITag } from './../../services/app/dto/InvoiceDTO';
import { date } from 'quasar';
import {
  IInvoice,
  IPurchase,
  IPurchaser,
} from 'src/services/app/dto/InvoiceDTO';
import { AppService } from 'src/services/app/AppService';
import { ActionContext, ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AppStateInterface } from './state';
import { ResponseObject } from 'src/services/StrapiResponseWrapper';

const invoiceService = new AppService();

const updatePurchaseFromInvoice = (
  purchase: IPurchase,
  ctx: Pick<
    ActionContext<AppStateInterface, StateInterface>,
    'commit' | 'state'
  >
) => {
  const purchaseReferenceIndex =
    ctx.state.currentInvoice.purchases.data.findIndex(
      (p) => p.id == purchase.id
    );

  // https://laracasts.com/discuss/channels/vue/vue2-properly-clone-a-vuex-object-for-manipulation
  // deep copies the object from store;
  // Otherwise Vuex complains about mutating state(because the objects are proxies)
  const copy = JSON.parse(
    JSON.stringify(ctx.state.currentInvoice.purchases.data)
  ) as ResponseObject<IPurchase>[];

  copy[purchaseReferenceIndex].attributes = purchase;

  ctx.commit('setCurrentInvoice', {
    ...ctx.state.currentInvoice,
    purchases: {
      data: copy,
    },
  } as IInvoice);
};

const actions: ActionTree<AppStateInterface, StateInterface> = {
  async load({ commit }) {
    commit('setLoading', true);
    const invoices = await invoiceService.getInvoices();

    invoices.forEach((i) => {
      // p.attributes.date = date.formatDate(p.attributes.date, 'DD MM YYYY');
      (i as unknown as ResponseObject<IInvoice>).attributes.dueDate =
        date.formatDate(
          (i as unknown as ResponseObject<IInvoice>).attributes.dueDate,
          'DD MM YYYY'
        );
    });
    commit('setInvoices', invoices);
  },

  async loadInvoice({ commit }, params: { id: string; secret: string }) {
    commit('setLoading', true);
    const invoice = await invoiceService.getInvoice(params.id, params.secret);
    await this.dispatch('invoices/loadUserPurchasersList');
    await this.dispatch('invoices/loadUserTagsList');

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

    updatePurchaseFromInvoice(purchase, { commit, state });
  },

  async loadUserPurchasersList({ commit }) {
    const list = await invoiceService.getPurchasers();
    commit('setUserPurchasersList', list);
  },

  async loadUserTagsList({ commit }) {
    const list = await invoiceService.getUserTags();
    commit('setUserTagsList', list);
  },

  async addTagsToPurchase(
    { commit, state },
    params: { tags: ITag[]; purchaseId: number }
  ) {
    const purchase = await invoiceService.addTagsToPurchase(
      params.tags,
      params.purchaseId
    );

    updatePurchaseFromInvoice(purchase, { commit, state });
  },

  async createTag({ commit, state }, params: { name: string }): Promise<ITag> {
    const tag = await invoiceService.createTag(params.name);
    commit('setUserTagsList', [...state.userTagList, tag]);

    return tag;
  },
};

export default actions;
