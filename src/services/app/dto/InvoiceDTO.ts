export enum BankTypes {
  NUBANK = 'Nubank',
  PICPAY = 'Picpay',
}

export interface IInvoice {
  total: number;
  dueDate: string;
  createdAt: string;
  numberOfPurchasers: number;
  purchasesNumber: number;
  BANK: BankTypes;
  uuid: string;
}
