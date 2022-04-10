import {
  ResponseObject,
  StrapiSingleResponseWrapper,
} from 'src/services/StrapiResponseWrapper';
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
  purchasers?: StrapiCollectionResponseWrapper<IPurchaser>;
  isShared?: boolean;
  tags?: StrapiCollectionResponseWrapper<ITag>;
  isCurrentlySelected?: boolean;
  blured?: boolean;
  displayTaggingCheckbox?: boolean;
  isTagged?: boolean;
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
    purchasers: {
      data: params?.purchasers?.data || [makePurchaser(true)],
    },
    tags: {
      data: params?.tags?.data || [],
    },
  };

  const wrapper = mount(PurchaseRow, {
    props: {
      purchaseId: purchase.id,
      date: purchase.date,
      title: purchase.title,
      price: `R$ ${formatCurrency(purchase.price)}`,
      isShared: purchase.isShared,
      purchasers: purchase.purchasers,
      tags: purchase.tags,
      isCurrentlySelected: params?.isCurrentlySelected,
      blured: params?.blured,
      displayTaggingCheckbox: params?.displayTaggingCheckbox,
      isTagged: params?.isTagged,
    },
  });

  return { purchase, wrapper };
};

const makeTag = (params?: ITag): StrapiSingleResponseWrapper<ITag> => {
  const purchaser = makePurchaser(true);

  const generatedTag: ITag = {
    id: params?.id ?? faker.datatype.number(),
    name: params?.name ?? faker.random.word().slice(0, 12),
    owner: params?.owner ?? String(purchaser.id),
    purchases: params?.purchases ?? [],
  };
  return {
    data: {
      id: generatedTag.id,
      attributes: generatedTag,
    },
  };
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

  it('should has blur filter when marked as blured and is not currently selected', () => {
    const { wrapper } = makePurchaseRow({
      blured: true,
      isCurrentlySelected: false,
    });

    expect(
      wrapper.find("[data-test='container']").attributes('style')
    ).toContain('filter: blur(2px)');
  });

  describe('tags', () => {
    it('should display a checkbox when displayTaggingCheckbox is true', () => {
      const { wrapper } = makePurchaseRow({ displayTaggingCheckbox: true });

      expect(wrapper.find("[data-test='tag.checkbox']").exists()).toBe(true);
    });

    it('should NOT display a checkbox when displayTaggingCheckbox is false', () => {
      const { wrapper } = makePurchaseRow({ displayTaggingCheckbox: false });

      expect(wrapper.find("[data-test='tag.checkbox']").exists()).toBe(false);
    });

    it('should have a checkbox checked when isTagged is true', () => {
      const { wrapper, purchase } = makePurchaseRow({
        displayTaggingCheckbox: true,
        isTagged: true,
      });

      expect(
        wrapper.findComponent("[data-test='tag.checkbox']").props().val
      ).toBe(purchase.id);
    });

    it('should have a checkbox UNCHECKED when isTagged is false', () => {
      const { wrapper, purchase } = makePurchaseRow({
        displayTaggingCheckbox: true,
        isTagged: false,
      });

      expect(
        wrapper.findComponent("[data-test='tag.checkbox']").props().val
      ).not.toBe(purchase.id);
    });

    it('should display as many tags as present in tag list', () => {
      const { wrapper } = makePurchaseRow({
        tags: {
          data: [makeTag().data, makeTag().data],
        },
      });

      expect(wrapper.findAll("[data-test='tag']").length).toBe(2);
    });

    it('should display no more than 3 tags', () => {
      const { wrapper } = makePurchaseRow({
        tags: {
          data: [
            makeTag().data,
            makeTag().data,
            makeTag().data,
            makeTag().data,
          ],
        },
      });

      expect(wrapper.findAll("[data-test='tag']").length).toBe(3);
    });
  });
});
