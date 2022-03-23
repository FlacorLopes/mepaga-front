<template>
  <q-card
    class="q-px-md q-pt-none col-xs col"
    :style="`min-width: 180px; ${$q.screen.gt.xs ? 'max-width: 220px' : ''}`"
  >
    <div class="column q-gutter-y-sm no-wrap">
      <q-select
        dense
        use-input
        use-chips
        hide-bottom-space
        label="adicione uma pessoa"
        v-model="newPurchaser"
        :options="userPurchasersList"
        :error="error"
        :error-message="errorMessage"
        @new-value="addValueToSelect"
        @filter="filterFn"
        class="col"
      >
        <template v-slot:prepend>
          <q-icon name="face" />
        </template>
        <template v-slot:option="{ itemProps, opt }">
          <q-item v-bind="itemProps">
            <q-item-section avatar>
              <q-icon name="face" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label v-text="opt.name" />
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:selected>
          <q-chip
            v-if="newPurchaser?.name?.length > 0"
            dense
            color="primary"
            text-color="white"
            class="q-my-none q-ml-xs q-mr-none"
          >
            {{ newPurchaser.name }}
          </q-chip>
        </template>
      </q-select>
      <q-btn
        rounded
        color="mp-green-0"
        label="Adicionar"
        size="sm"
        class="q-mb-xs-md"
        :loading="loading"
        :disable="
          newPurchaser?.name?.length < 3 || newPurchaser?.name?.length > 10
        "
        @click="addPurchaser"
        @blur="() => (error = false)"
      />
    </div>
  </q-card>
</template>
<script lang="ts">
import { IPurchaser } from 'src/services/app/dto/InvoiceDTO';
import { useStore } from 'src/store';
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  name: 'AddPurchaserCard',
  props: {
    useUserStyle: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
    },
    value: {
      type: Number,
    },
    purchaseAmount: {
      type: Number,
    },
  },
  setup() {
    const store = useStore();
    const newPurchaser = ref<IPurchaser>({
      name: '',
      representsUser: false,
    });
    const loading = ref(false);
    const error = ref(false);
    const errorMessage = ref('');

    const invoicePurchasers = computed(() => store.state?.invoices?.purchasers);

    const selectionFilter = ref<string>(null);
    const userPurchasersList = computed(() =>
      store.state?.invoices?.userPurchaserList
        .filter(
          (p) =>
            !p.representsUser &&
            !invoicePurchasers.value.some(
              (invoicePurchaser) => invoicePurchaser.name === p.name
            )
        )
        .filter((p) => {
          if (selectionFilter.value === null) return true;
          return p.name.indexOf(selectionFilter.value) > -1;
        })
    );

    const fillSelectInput = (val: string) => {
      if (val.length > 2) {
        if (!userPurchasersList.value.some((p) => p.name === val)) {
          // newPurchaser.value = {
          //   name: val,
          //   representsUser: false,
          //   id: null,
          // };
          // done(
          //   {
          //     name: val,
          //     representsUser: false,
          //   },
          //   'add-unique'
          // );
        }
      } else {
        newPurchaser.value = {
          name: '',
          representsUser: false,
          id: null,
        };
      }
    };

    return {
      newPurchaser,
      loading,
      error,
      errorMessage,
      userPurchasersList,
      selectionFilter,
      fillSelectInput,
    };
  },

  methods: {
    async addPurchaser() {
      try {
        this.error = false;
        this.loading = true;
        if (this.newPurchaser.id) {
          const purchasers = this.$store.state?.invoices?.purchasers;
          this.$store.commit('invoices/setPurchasers', [
            ...purchasers,
            this.newPurchaser,
          ] as IPurchaser[]);
        } else {
          await this.$store.dispatch(
            'invoices/addPurchaser',
            this.newPurchaser.name
          );
        }
        this.newPurchaser = {
          name: '',
          representsUser: false,
        };
        this.loading = false;
      } catch (error) {
        console.log(error);
        this.error = true;
        this.errorMessage = 'Já existe uma pessoa com esse nome';
        this.loading = false;
      }
    },
    addValueToSelect(
      value: string,
      done: (arg0: IPurchaser, arg1: string) => void
    ) {
      if (value.length === 0)
        done({ name: '', representsUser: false }, 'add-unique');
      else done({ name: value, representsUser: false }, 'add-unique');
    },
    filterFn(val: string, update: (arg0: () => void) => void) {
      update(() => {
        if (val === '') {
          this.selectionFilter = null;
        } else {
          const needle = val.toLowerCase();
          this.selectionFilter = needle;
        }
      });
    },
    onClear(value) {
      alert(value);
    },
  },
});
</script>
