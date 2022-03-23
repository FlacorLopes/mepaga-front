import { IInvoice, IPurchaser, ITag } from 'src/services/app/dto/InvoiceDTO';

export interface AppStateInterface {
  loading: boolean;
  invoices?: Array<IInvoice>;
  currentInvoice?: IInvoice;
  purchasers?: Array<IPurchaser>;
  userPurchaserList?: Array<IPurchaser>;
  userTagList: Array<ITag>;
}

function state(): AppStateInterface {
  return {
    loading: false,
    purchasers: [],
    userPurchaserList: [],
    userTagList: [],
  };
}

export default state;
