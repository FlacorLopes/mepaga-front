import { IPurchase, IPurchaser } from 'src/services/app/dto/InvoiceDTO';

const getPurchaseOwner = (
  purchase: IPurchase,
  representingUser = false
): IPurchaser => {
  if (representingUser)
    return purchase.purchasers.data.find((p) => p.attributes.representsUser)
      .attributes;

  return purchase.purchasers.data[0].attributes;
};

export { getPurchaseOwner };
