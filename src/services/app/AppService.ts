import { StrapiSingleResponseWrapper } from './../StrapiResponseWrapper';
import { api } from 'src/boot/axios';
import { AxiosInstance } from 'axios';
import { IInvoice } from './dto/InvoiceDTO';
import { StrapiCollectionResponseWrapper } from '../StrapiResponseWrapper';

export interface IAppService {
  getInvoices(): Promise<IInvoice[]>;
  getInvoice(id: string): Promise<IInvoice>;
}

export class AppService implements IAppService {
  private readonly api: AxiosInstance;

  constructor() {
    this.api = api;
  }
  async getInvoice(id: string): Promise<IInvoice> {
    const response = await this.api.get(`api/invoices/${id}`);

    if (response.status !== 200) throw new Error(response.statusText);
    const invoice = response.data as StrapiSingleResponseWrapper<IInvoice>;

    return invoice.data.attributes as unknown as IInvoice;
  }
  async getInvoices(): Promise<IInvoice[]> {
    const response = await this.api.get('api/invoices');

    if (response.status !== 200) throw new Error(response.statusText);
    const invoices = response.data as StrapiCollectionResponseWrapper<IInvoice>;

    return invoices.data as unknown as IInvoice[];
  }
}
