<template>
  <div class="q-pt-xl q-px-md q-gutter-y-xl mp-ubuntu">
    <div class="row q-gutter-x-md">
      <loading-table-skeleton v-if="!currentInvoice" />
      <q-card class="mp-card col-sm-7 col-12" v-else>
        <q-card-section>
          <div class="text-mp-blue-1 text-subtitle1 text-weight-medium">
            Sua fatura de {{ dueDate }}
          </div>
          <div class="text-mp-blue-1 text-subtitle2 text-weight-light">
            clique em um linha para atribuir a dívida a alguém
          </div>
        </q-card-section>
        <q-card-section>
          <q-scroll-area style="height: 260px">
            <div
              v-for="p in purchasesList"
              :key="p.id"
              class="q-mb-sm shadow-1 rounded-borders bg-mp-lightblue-1"
              style=""
            >
              <div class="column-xs row-sm q-px-lg q-py-sm">
                <div
                  class="row text-subtitle2 q-gutter-x-md text-weight-regular text-mp-white-0 items-center"
                >
                  <div>{{ p.attributes.date }}</div>
                  <div
                    class="text-subtitle1 text-weight-medium text-lowercase text-mp-white-0 mp-purchase-line"
                    style="width: 250px; max-width: 250px; max-height: 30px"
                  >
                    {{ p.attributes.title }}
                  </div>
                </div>
                <q-space />
                <div class="row items-center q-gutter-x-sm">
                  <q-chip
                    color="mp-white-0"
                    dense
                    text-color="mp-red-0"
                    icon="paid"
                    style="width: 90px; max-width: 90px"
                  >
                    R$ {{ p.attributes.price.toFixed(2) }}
                  </q-chip>
                  <q-chip
                    color="positive"
                    dense
                    text-color="white"
                    icon="account_circle"
                    style="width: 120px; max-width: 120px"
                  >
                    Ruana Silva
                  </q-chip>
                  <q-icon
                    name="more_horiz"
                    color="mp-white-0"
                    size="sm"
                    class="cursor-pointer"
                    v-ripple
                  >
                    <q-menu auto-close>
                      <q-list style="min-width: 100px">
                        <q-item clickable>
                          <q-item-section avatar>
                            <q-icon name="safety_divider" color="primary" />
                          </q-item-section>
                          <q-item-section> Dividir Compra </q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-icon>
                </div>
              </div>
            </div>
          </q-scroll-area>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div
            class="row bg-mp-white-2 shadow-1 rounded-borders q-pa-lg items-center"
          >
            <div class="row q-gutter-x-md">
              <div class="text-h5 text-mp-lightblue-0">TOTAL</div>
              <div class="text-h5 text-mp-red-1">
                R$ {{ currentInvoice.total }}
              </div>
            </div>
            <q-space />
            <div class="column">
              <div class="row q-gutter-x-md justify-end">
                <div class="text-subtitle2 text-mp-lightblue-0">
                  Número de compras
                </div>
                <div class="text-subtitle1 text-mp-red-1">
                  {{ currentInvoice.purchasesNumber }}
                </div>
              </div>
              <div class="row q-gutter-x-md justify-end">
                <div class="text-subtitle2 text-mp-lightblue-0">
                  Compradores
                </div>
                <div class="text-subtitle2 text-mp-red-1">
                  {{ currentInvoice.numberOfPurchasers }}
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
      <q-card class="mp-card col" v-if="currentInvoice">
        <q-card-section>
          <div class="text-mp-blue-1 text-subtitle1 text-weight-medium">
            Usuários de seu cartão nessa fatura
          </div>
          <div class="text-mp-blue-1 text-subtitle2 text-weight-light">
            clique ou passe o mouse sobre um card para removê-lo
          </div>
        </q-card-section>
        <q-card-section class="q-gutter-y-md">
          <div class="row q-gutter-x-md">
            <purchaser-card useUserStyle :value="400" :purchaseAmount="2" />
            <add-purchaser-card />
          </div>
          <div class="row q-gutter-x-md"></div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from 'src/store';
import { useRouter } from 'vue-router';
import { defineComponent, computed } from 'vue';
import LoadingTableSkeleton from 'src/components/LoadingTableSkeleton.vue';
import { date } from 'quasar';
import PurchaserCard from 'src/components/PurchaserCard.vue';
import AddPurchaserCard from 'src/components/AddPurchaserCard.vue';
export default defineComponent({
  components: { LoadingTableSkeleton, PurchaserCard, AddPurchaserCard },
  // name: 'PageName'
  setup() {
    const store = useStore();
    const router = useRouter();
    const invoiceId = computed(() => router.currentRoute.value.params.id);
    const currentInvoice = computed(() => store.state.invoices?.currentInvoice);
    const purchasesList = computed(() => currentInvoice.value?.purchases.data);

    const dueDate = computed(() => {
      if (currentInvoice.value.dueDate) {
        let rawDate = date
          .formatDate(currentInvoice.value.dueDate, 'DD MMMM YYYY', {
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
      }
      return '';
    });

    if (invoiceId.value)
      void store.dispatch('invoices/loadInvoice', invoiceId.value);

    return {
      currentInvoice,
      invoiceId,
      dueDate,
      purchasesList,
    };
  },
});
</script>
<style lang="scss" scoped>
.mp-card {
  background: $mepaga-white-0;
}

.mp-purchase-line {
  line-height: 1;
}
</style>
