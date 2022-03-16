import { IPurchase, IPurchaser } from 'src/services/app/dto/InvoiceDTO';
import { date } from 'quasar';

const getPurchaseOwner = (
  purchase: IPurchase,
  representingUser = false
): IPurchaser => {
  if (representingUser)
    return purchase.purchasers.data.find((p) => p.attributes.representsUser)
      .attributes;

  return purchase.purchasers.data[0].attributes;
};

const getFullTextDate = (dueDate: string) => {
  const rawDate = date
    .formatDate(dueDate, 'DD MMMM YYYY', {
      months: [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
      ],
    })
    .split(' ');
  return `${rawDate[0]} de ${rawDate[1]} de ${rawDate[2]}`;
};
export { getPurchaseOwner, getFullTextDate };
