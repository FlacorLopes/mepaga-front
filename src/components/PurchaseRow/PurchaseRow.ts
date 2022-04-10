import { StrapiCollectionResponseWrapper } from 'src/services/StrapiResponseWrapper';
import { getPurchaseOwner } from 'src/utils/InvoiceUtils';
import { IPurchaser, ITag } from 'src/services/app/dto/InvoiceDTO';
import { defineComponent, ref, PropType, computed, watch } from 'vue';

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
      type: Object as PropType<StrapiCollectionResponseWrapper<IPurchaser>>,
      required: true,
    },
    isDividing: {
      type: Boolean,
      default: false,
    },
    blured: {
      type: Boolean,
      default: false,
    },
    isCurrentlySelected: {
      type: Boolean,
      default: false,
    },
    displayTaggingCheckbox: {
      type: Boolean,
      default: false,
    },
    isTagged: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: Object as PropType<StrapiCollectionResponseWrapper<ITag>>,
      required: true,
    },
  },
  emits: ['dividePurchaseClick', 'tagCheckboxToggle'],
  setup(props) {
    const purchaser = computed(() => {
      if (!props.isShared) {
        return props.purchasers.data.find((p) => p.attributes.representsUser);
      }
      return props.purchasers.data[0];
    });
    const selectedForTagging = ref([]);

    watch(props, () => {
      if (props.isTagged) selectedForTagging.value[0] = props.purchaseId;
      else selectedForTagging.value[0] = undefined;
    });
    return {
      selectedForTagging,
      getPurchaseOwner,
      purchaser,
    };
  },
});
