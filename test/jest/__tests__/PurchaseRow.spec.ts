import { ResponseObject } from './../../../src/services/StrapiResponseWrapper';
import { StrapiCollectionResponseWrapper } from 'src/services/StrapiResponseWrapper';
import { IPurchase, IPurchaser, ITag } from 'src/services/app/dto/InvoiceDTO';
import { mount, VueWrapper } from '@vue/test-utils';
import { ComponentPublicInstance } from 'vue';
import { describe, expect, it } from '@jest/globals';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import PurchaseRow from 'src/components/PurchaseRow/PurchaseRow';
import { formatCurrency } from '@brazilian-utils/brazilian-utils';
import { faker } from '@faker-js/faker';
installQuasarPlugin();

const makePurchaseRow = (params?: {
  purchasers: StrapiCollectionResponseWrapper<IPurchaser>;
  isShared?: boolean;
  tags?: StrapiCollectionResponseWrapper<ITag>;
}): {
  purchase: IPurchase;
  wrapper: VueWrapper<ComponentPublicInstance>;
} => {
  const purchase: IPurchase = {
    id: 1,
    date: '14 02 2022',
    title: 'Descrição da compra',
    price: 234.49,
    isShared: params?.isShared ?? false,
    purchasers: params?.purchasers ?? null,
    tags: params?.tags ?? null,
  };

  const wrapper = mount(PurchaseRow, {
    props: {
      purchaseId: purchase.id,
      date: purchase.date,
      title: purchase.title,
      price: `R$ ${formatCurrency(purchase.price)}`,
      isShared: purchase.isShared,
      purchasers: params?.purchasers?.data.map((p) => p.attributes) || [
        makePurchaser(true).attributes,
      ],
    },
  });

  return { purchase, wrapper };
};

const makePurchaser = (representsUser = false): ResponseObject<IPurchaser> => {
  const id = faker.datatype.number();
  return {
    id,
    attributes: {
      name: faker.name.firstName(),
      representsUser,
      id,
    },
  };
};

describe('PurchaseRow', () => {
  it('should mount correctly', () => {
    const { wrapper } = makePurchaseRow();

    expect(wrapper).toBeTruthy();
  });

  it('should display the date', () => {
    const { wrapper, purchase } = makePurchaseRow();

    expect(wrapper.find("[data-test='date']").text()).toBe(purchase.date);
  });

  it('should display the title', () => {
    const { wrapper, purchase } = makePurchaseRow();

    expect(wrapper.find("[data-test='title']").text()).toBe(purchase.title);
  });

  it('should display the price', () => {
    const { wrapper, purchase } = makePurchaseRow();

    expect(wrapper.find("[data-test='price']").text()).toContain(
      formatCurrency(purchase.price)
    );
  });

  it('should display the name of the purchaser if there is only one', () => {
    const purchaser = makePurchaser(true);
    const { wrapper } = makePurchaseRow({
      purchasers: {
        data: [purchaser],
      },
    });

    expect(wrapper.find("[data-test='purchaser.name']").text()).toBe(
      purchaser.attributes.name.toUpperCase()
    );
  });

  describe('shared purchases', () => {
    it('should display DIVIDIDA as the owner when a purchase is shared', () => {
      const purchaser1 = makePurchaser(true);
      const purchaser2 = makePurchaser();

      const { wrapper } = makePurchaseRow({
        purchasers: {
          data: [purchaser1, purchaser2],
        },
        isShared: true,
      });

      expect(wrapper.find("[data-test='shared']").text()).toBe('DIVIDIDA');
    });

    it.todo(
      'should display a tooltip with the name of the purchasers when it is shared'
    );
  });

  it('should display an icon to perform purchase division', () => {
    const purchaser1 = makePurchaser(true);

    const { wrapper } = makePurchaseRow({
      purchasers: {
        data: [purchaser1],
      },
      isShared: false,
    });

    expect(wrapper.find("[data-test='divide.icon']").exists()).toBe(true);
  });
});
