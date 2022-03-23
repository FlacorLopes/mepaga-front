import { ITag } from 'src/services/app/dto/InvoiceDTO';
import { StrapiSingleResponseWrapper } from './../StrapiResponseWrapper';
import { api } from 'src/boot/axios';
import { AxiosInstance } from 'axios';
import { IInvoice, IPurchase, IPurchaser } from './dto/InvoiceDTO';
import { StrapiCollectionResponseWrapper } from '../StrapiResponseWrapper';

export interface IAppService {
  getInvoices(): Promise<IInvoice[]>;
  getInvoice(id: string, string: string): Promise<IInvoice>;
}

export class AppService implements IAppService {
  private readonly api: AxiosInstance;

  constructor() {
    this.api = api;
  }
  async getInvoice(id: string, secret: string): Promise<IInvoice> {
    const response = await this.api.get(`api/invoices/${id}`, {
      headers: {
        'mepaga-secret': secret,
      },
    });

    if (response.status !== 200) throw new Error(response.statusText);
    const invoice = response.data as StrapiSingleResponseWrapper<IInvoice>;
    invoice.data.attributes.id = invoice.data.id;
    return invoice.data.attributes;
  }
  async getInvoices(): Promise<IInvoice[]> {
    const response = await this.api.get('api/invoices');

    if (response.status !== 200) throw new Error(response.statusText);
    const invoices = response.data as StrapiCollectionResponseWrapper<IInvoice>;

    return invoices.data as unknown as IInvoice[];
  }

  async createPurchaser(name: string): Promise<IPurchaser> {
    const response = await this.api.post('api/purchasers', {
      data: {
        name,
      },
    });
    if (response.status !== 200) throw new Error(response.statusText);
    const purchaser = response.data as StrapiSingleResponseWrapper<IPurchaser>;
    purchaser.data.attributes.id = purchaser.data.id;
    return purchaser.data.attributes;
  }

  async addPurchaserToPurchase(
    purchasersIds: number[],
    purchaseId: number
  ): Promise<IPurchase> {
    const response = await this.api.post(
      `api/purchases/add_purchasers/${purchaseId}`,
      {
        data: {
          purchasers: purchasersIds,
        },
      }
    );

    if (response.status !== 200) throw new Error(response.statusText);

    const purchase = response.data as StrapiSingleResponseWrapper<IPurchase>;
    purchase.data.attributes.id = purchase.data.id;
    return purchase.data.attributes;
  }

  async getPurchasers(): Promise<IPurchaser[]> {
    const response = await this.api.get('api/purchasers');

    if (response.status !== 200) throw new Error(response.statusText);

    const purchasers =
      response.data as StrapiCollectionResponseWrapper<IPurchaser>;
    return purchasers.data.map((p) => ({
      name: p.attributes.name,
      representsUser: p.attributes.representsUser,
      id: p.id,
    }));
  }

  async getUserTags(): Promise<ITag[]> {
    const response = await this.api.get('api/tags');

    if (response.status !== 200) throw new Error(response.statusText);

    const tags = response.data as StrapiCollectionResponseWrapper<ITag>;

    return tags.data.map((t) => {
      return {
        id: t.id,
        name: t.attributes.name,
        owner: t.attributes.owner,
        purchases: t.attributes.purchases,
      };
    });
  }

  async createTag(name: string): Promise<ITag> {
    const response = await this.api.post('api/tags', {
      data: {
        name,
      },
    });

    if (response.status !== 200) throw new Error(response.statusText);

    const tag = response.data as StrapiSingleResponseWrapper<ITag>;

    return {
      id: tag.data.id,
      ...tag.data.attributes,
    };
  }

  async addTagsToPurchase(
    tags: ITag[],
    purchaseId: number
  ): Promise<IPurchase> {
    const response = await this.api.post(
      `api/purchases/add_tags/${purchaseId}`,
      {
        data: {
          id: purchaseId,
          tags,
        },
      }
    );

    if (response.status !== 200) throw new Error(response.statusText);

    const purchase = response.data as StrapiSingleResponseWrapper<IPurchase>;
    purchase.data.attributes.id = purchase.data.id;
    return purchase.data.attributes;
  }
}
