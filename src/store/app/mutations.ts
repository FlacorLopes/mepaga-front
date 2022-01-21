import { IInvoice } from 'src/services/app/dto/InvoiceDTO';
import { MutationTree } from 'vuex';
import { AppStateInterface } from './state';

const mutation: MutationTree<AppStateInterface> = {
  setInvoices(state: AppStateInterface, invoices: IInvoice[]) {
    state.loading = false;
    state.invoices = invoices;
  },

  setLoading(state: AppStateInterface, loading: boolean) {
    state.loading = loading;
  },
};

export default mutation;
