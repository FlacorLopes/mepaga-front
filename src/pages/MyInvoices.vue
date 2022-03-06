<template>
  <div class="q-px-md">
    <q-table
      :rows="invoices.invoices"
      :columns="columns"
      row-key="uid"
      :loading="invoices.loading"
      grid
    >
      <template v-slot:top>
        <div class="row col justify-between items-center">
          <div class="text-h6 text-weight-regular">Minhas Faturas</div>
          <q-btn
            color="primary"
            label="Importar Fatura"
            icon="credit_card"
            push
            to="/"
          />
        </div>
      </template>
      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6"
          @click="(e, row) => goToInvoice(props.row)"
        >
          <q-card>
            <q-card-section class="row q-gutter-x-md">
              <q-chip
                color="mp-white-0"
                square
                text-color="primary"
                style="width: 120px; max-width: 120px"
                icon="event"
              >
                <div class="text-subtitle2 text-mp-blue-1">
                  {{ props.row.attributes.dueDate }}
                </div>
              </q-chip>
              <q-chip
                color="mp-white-0"
                square
                text-color="primary"
                style="width: 120px; max-width: 120px"
                icon="request_quote"
              >
                <div class="text-subtitle2 text-mp-blue-1">
                  R$ {{ formatCurrency(props.row.attributes.total) }}
                </div>
              </q-chip>
            </q-card-section>
            <q-card-section>
              <q-img
                src="images/banks/nubank.png"
                width="50px"
                alt="logo do banco"
              />
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import { useStore } from 'src/store';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { ResponseObject } from 'src/services/StrapiResponseWrapper';
import { IInvoice } from 'src/services/app/dto/InvoiceDTO';
import { formatCurrency } from '@brazilian-utils/brazilian-utils';

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
      formatCurrency,
    };
  },
};
</script>
