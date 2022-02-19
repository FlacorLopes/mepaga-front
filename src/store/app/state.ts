import { IInvoice } from 'src/services/app/dto/InvoiceDTO';

export interface AppStateInterface {
  loading: boolean;
  invoices?: Array<IInvoice>;
  currentInvoice?: IInvoice;
}

function state(): AppStateInterface {
  return {
    loading: false,
  };
}

export default state;
