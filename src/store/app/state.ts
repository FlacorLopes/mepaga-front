import { IInvoice, IPurchaser } from 'src/services/app/dto/InvoiceDTO';

export interface AppStateInterface {
  loading: boolean;
  invoices?: Array<IInvoice>;
  currentInvoice?: IInvoice;
  purchasers?: Array<IPurchaser>;
  userPurchaserList?: Array<IPurchaser>;
}

function state(): AppStateInterface {
  return {
    loading: false,
    purchasers: [],
    userPurchaserList: [],
  };
}

export default state;
