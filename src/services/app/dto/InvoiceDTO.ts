import { StrapiCollectionResponseWrapper } from 'src/services/StrapiResponseWrapper';

export enum BankTypes {
  NUBANK = 'Nubank',
  PICPAY = 'Picpay',
}
export interface IInvoice {
  id: number;
  total: number;
  dueDate: string;
  createdAt: string;
  numberOfPurchasers: number;
  purchasesNumber: number;
  purchases: StrapiCollectionResponseWrapper<IPurchase>;
  BANK: BankTypes;
  uuid: string;
}

export interface IPurchase {
  id: number;
  date: string;
  title: string;
  price: number;
  isShared: boolean;
  purchasers: StrapiCollectionResponseWrapper<IPurchaser>;
}

export interface IPurchaser {
  id?: number;
  name: string;
  representsUser: boolean;
}

/*
Deep Object access
let P: IInvoice;
P.purchases.data[0].attributes.purchasers.data[0].attributes.name

*/
