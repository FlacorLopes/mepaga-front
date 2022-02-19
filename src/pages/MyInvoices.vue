<template>
  <div class="q-pa-md">
    <q-table
      title="Minhas Faturas"
      :rows="invoices.invoices"
      :columns="columns"
      row-key="uid"
      :loading="invoices.loading"
      grid
      @rowClick="(e, row) => goToInvoice(row)"
    />
  </div>
</template>

<script lang="ts">
import { useStore } from 'src/store';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { ResponseObject } from 'src/services/StrapiResponseWrapper';
import { IInvoice } from 'src/services/app/dto/InvoiceDTO';

const columns = [
  {
    name: 'date',
    label: 'Data',
    field: (row: ResponseObject<IInvoice>) => row.attributes.dueDate,
    align: 'left',
  },
  {
    name: 'total',
    label: 'Valor',
    field: (row: ResponseObject<IInvoice>) => row.attributes.total,

    align: 'left',
  },
];
export default {
  name: 'MyInvoices',
  setup() {
    const store = useStore();
    const invoices = computed(() => store.state.invoices);
    const router = useRouter();

    store.dispatch('invoices/load').catch((reason) => alert(reason));

    const goToInvoice = async (row: { id: string }) => {
      console.log(row);
      await router.push('/fatura/' + row.id);
    };

    return {
      invoices,
      columns,
      goToInvoice,
    };
  },
};
</script>
