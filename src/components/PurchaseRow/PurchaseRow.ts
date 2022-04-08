import { getPurchaseOwner } from 'src/utils/InvoiceUtils';
import { IPurchaser } from './../../services/app/dto/InvoiceDTO';
import { defineComponent, ref, PropType, computed } from 'vue';

export default defineComponent({
  name: 'PurchaseRow',
  props: {
    purchaseId: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    isShared: {
      type: Boolean,
      default: false,
    },
    purchasers: {
      type: Array as PropType<IPurchaser[]>,
      required: true,
    },
    isDividing: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['dividePurchaseClick'],
  setup(props) {
    const purchaser = computed(() => {
      if (!props.isShared) {
        return props.purchasers.find((p) => p.representsUser);
      }
      return props.purchasers[0];
    });
    return {
      temp: ref(false),
      getPurchaseOwner,
      purchaser,
    };
  },
});
