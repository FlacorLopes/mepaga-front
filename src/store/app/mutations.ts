import { IInvoice, IPurchaser } from 'src/services/app/dto/InvoiceDTO';
import { MutationTree } from 'vuex';
import { AppStateInterface } from './state';

const mutation: MutationTree<AppStateInterface> = {
  setInvoices(state: AppStateInterface, invoices: IInvoice[]) {
    state.loading = false;
    state.invoices = invoices;
  },
  setCurrentInvoice(state: AppStateInterface, invoice: IInvoice) {
    state.loading = false;
    state.currentInvoice = invoice;
  },
  setLoading(state: AppStateInterface, loading: boolean) {
    state.loading = loading;
  },
  setPurchasers(state: AppStateInterface, purchasers: IPurchaser[]) {
    state.purchasers = purchasers;
  },
  setUserPurchasersList(state: AppStateInterface, list: IPurchaser[]) {
    state.userPurchaserList = list;
  },
};

export default mutation;
