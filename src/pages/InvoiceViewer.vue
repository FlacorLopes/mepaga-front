<template>
  <div class="q-pt-xl q-px-md-md q-px-xs-sm mp-ubuntu">
    <div
      class="column-xs row-md q-gutter-xs-x-none q-gutter-y-xl q-gutter-md-x-md"
    >
      <loading-table-skeleton v-if="loading || !currentInvoice" />
      <q-card class="mp-card col-sm-7 col-xs-12" v-else>
        <q-card-section :class="{ blured: isSelecting }">
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
              v-for="(p, index) in purchasesList"
              :key="p.id"
              class="q-mb-sm shadow-1 rounded-borders cursor-pointer"
              :class="
                index % 2 !== 0 ? 'bg-mp-lightblue-1' : 'bg-mp-lightblue-2'
              "
              @click="handlePurchaseSelection(p.id)"
              :style="
                isSelecting && selectedPurchaseId != p.id
                  ? 'filter: blur(2px);'
                  : ''
              "
            >
              <div class="column-xs row-sm q-px-lg q-py-sm no-wrap">
                <div
                  class="column q-gutter-x-md text-weight-regular text-mp-white-0"
                >
                  <q-chip
                    color="mp-white-0"
                    dense
                    text-color="mp-red-0"
                    style="width: 80px; max-width: 80px"
                  >
                    <div class="text-caption text-mp-blue-1">
                      {{ p.attributes.date }}
                    </div>
                  </q-chip>
                  <div
                    class="text-subtitle2 text-weight-medium text-lowercase text-mp-white-0 mp-purchase-line"
                  >
                    {{ p.attributes.title }}
                  </div>
                </div>
                <q-space />
                <div class="row items-center q-gutter-x-sm q-mt-xs-md">
                  <q-chip
                    color="mp-white-0"
                    dense
                    text-color="mp-red-0"
                    icon="paid"
                    style="width: 90px; max-width: 90px"
                  >
                    R$ {{ formatCurrency(p.attributes.price) }}
                  </q-chip>

                  <q-chip
                    :color="p.attributes.isShared ? 'warning' : 'positive'"
                    dense
                    text-color="white"
                    icon="account_circle"
                    style="width: 120px; max-width: 120px"
                  >
                    <q-space />
                    <div class="text-caption" v-if="p.attributes.isShared">
                      DIVIDIDA
                      <q-tooltip max-height="40px">{{
                        p.attributes.purchasers.data
                          .map((p) => p.attributes.name)
                          .join(' - ')
                      }}</q-tooltip>
                    </div>
                    <div class="text-caption" v-else>
                      {{ getPurchaseOwner(p.attributes).name.toUpperCase() }}
                    </div>
                    <q-space />
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
                        <q-item clickable @click="isDividing = true">
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
                R$ {{ formatCurrency(currentInvoice.total) }}
              </div>
            </div>
            <q-space />
            <div class="column">
              <div class="row q-gutter-x-md justify-end">
                <div class="text-subtitle2 text-mp-lightblue-0">
                  Número de compras
                </div>
                <div class="text-subtitle2 text-mp-red-1">
                  {{ currentInvoice.purchasesNumber }}
                </div>
              </div>
              <div
                class="row q-gutter-x-md"
                :class="{ 'justify-end': $q.screen.gt.xs }"
              >
                <div class="text-subtitle2 text-mp-lightblue-0">
                  Compradores
                </div>
                <div class="text-subtitle2 text-mp-red-1">
                  {{ purchasersList?.length + 1 || 1 }}
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
      <q-card class="mp-card col" v-if="!loading && currentInvoice">
        <q-card-section :class="{ blured: isSelecting }">
          <div class="text-mp-blue-1 text-subtitle1 text-weight-medium">
            Usuários de seu cartão nessa fatura
          </div>
          <div class="text-mp-blue-1 text-subtitle2 text-weight-light">
            clique ou passe o mouse sobre um card para removê-lo
          </div>
        </q-card-section>
        <q-card-section class="q-gutter-y-md">
          <div>
            <div class="row q-gutter-md">
              <add-purchaser-card />
              <purchaser-card
                useUserStyle
                :value="userPurchasesValue.toFixed(2)"
                :purchaseAmount="userPurchases?.length || 0"
                :badgeNumber="getDividingPurchaseNumber(userPurchaser)"
                :class="{ 'cursor-pointer': isSelecting }"
                @click="handlePurchaserClick(userPurchaser)"
              />
            </div>
          </div>
          <q-scroll-area style="height: 240px" class="q-pb-xs">
            <div class="row q-gutter-md">
              <purchaser-card
                v-for="purchaser in purchasersList"
                :key="purchaser.name"
                :name="purchaser.name"
                :value="getPurchasesValue(purchaser).toFixed(2)"
                :purchaseAmount="getPurchasesAmount(purchaser)"
                :class="{ 'cursor-pointer': isSelecting }"
                :badgeNumber="getDividingPurchaseNumber(purchaser)"
                @click="handlePurchaserClick(purchaser)"
              />
            </div>
          </q-scroll-area>
          <div class="row" v-show="isDividing">
            <q-btn
              label="Finalizar Divisão"
              color="positive"
              class="col"
              :disable="dividingPurchasers.length === 0"
              @click="handleDivisionFinish"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from 'src/store';
import { useRouter } from 'vue-router';
import { defineComponent, computed, ref } from 'vue';
import LoadingTableSkeleton from 'src/components/LoadingTableSkeleton.vue';
import { date } from 'quasar';
import PurchaserCard from 'src/components/PurchaserCard.vue';
import AddPurchaserCard from 'src/components/AddPurchaserCard.vue';
import { getPurchaseOwner } from 'src/utils/InvoiceUtils';
import { IPurchase, IPurchaser } from 'src/services/app/dto/InvoiceDTO';
import { formatCurrency } from '@brazilian-utils/brazilian-utils';

export default defineComponent({
  components: { LoadingTableSkeleton, PurchaserCard, AddPurchaserCard },
  name: 'InvoiceViewer',
  setup() {
    const store = useStore();
    const router = useRouter();

    const invoiceId = computed(() => router.currentRoute.value.params.id);
    const currentInvoice = computed(() => store.state.invoices?.currentInvoice);
    const purchasesList = computed(() => currentInvoice.value?.purchases.data);

    const loading = ref(true);
    const isSelecting = ref(false);
    const isDividing = ref(false);
    const dividingPurchasers = ref<IPurchaser[]>([]);

    const selectedPurchaseId = ref();

    const userPurchaser = computed(() =>
      store.state.invoices?.userPurchaserList?.find(
        (p) => p.representsUser === true
      )
    );

    const userPurchases = computed(() =>
      purchasesList.value?.filter((p) =>
        p.attributes.purchasers.data.some(
          (purchaser) => purchaser.attributes.representsUser
        )
      )
    );
    const userPurchasesValue = computed(
      () =>
        userPurchases.value
          .map((p) => getDividedPrice(p.attributes))
          .reduce((a, b) => a + b) || 0
    );
    const purchasersList = computed(() => store.state.invoices.purchasers);

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
      store
        .dispatch('invoices/loadInvoice', invoiceId.value)
        .then(() => (loading.value = false))
        .catch((error) =>
          console.log('Ocorreu um erro ao carregar a fatura', error)
        );

    const getDividedPrice = (purchase: IPurchase): number => {
      // divides purchase value by all our purchasers
      if (purchase.isShared)
        return purchase.price / purchase.purchasers.data.length;
      return purchase.price;
    };
    return {
      currentInvoice,
      invoiceId,
      dueDate,
      purchasesList,
      userPurchases,
      userPurchasesValue,
      userPurchaser,
      purchasersList,
      loading,
      isSelecting,
      selectedPurchaseId,
      isDividing,
      dividingPurchasers,
      getPurchaseOwner,
      getDividedPrice,
      formatCurrency,
    };
  },
  methods: {
    handlePurchaseSelection(purchaseId: number) {
      if (this.isSelecting && purchaseId == this.selectedPurchaseId) return;
      if (!this.isSelecting) {
        this.isDividing = false;
        this.dividingPurchasers = [];
        this.selectedPurchaseId = purchaseId;
        this.isSelecting = true;
      } else {
        this.isDividing = false;
        this.dividingPurchasers = [];
        this.selectedPurchaseId = null;
        this.isSelecting = false;
      }
    },

    async requestAddPurchaser(purchasersIds: number[]) {
      await this.$store.dispatch('invoices/addPurchaserToPurchase', {
        purchasersIds,
        purchaseId: <number>this.selectedPurchaseId,
      });

      this.isSelecting = false;
      this.selectedPurchaseId = undefined;
    },
    async handlePurchaserClick(purchaser: IPurchaser) {
      if (!this.isSelecting) return;

      if (this.isDividing) {
        // if is performing purchase division, then just adds the purhcaser
        // to the division list
        if (this.dividingPurchasers.some((p) => p.id === purchaser.id)) {
          // removes purchaser from division if already in the list
          const indexInDivision = this.dividingPurchasers.findIndex(
            (p) => p.id === purchaser.id
          );

          if (indexInDivision >= 0) {
            this.dividingPurchasers.splice(indexInDivision, 1);
          }
        } else this.dividingPurchasers.push(purchaser);
        return;
      } else {
        // otherwise just requests to add it
        await this.requestAddPurchaser([purchaser.id]);
      }
    },

    async handleDivisionFinish() {
      if (this.dividingPurchasers.length == 0) return;
      await this.requestAddPurchaser(this.dividingPurchasers.map((p) => p.id));

      this.isDividing = false;
      this.dividingPurchasers = [];
    },

    filterPurchasesOwnedByPurchaser(targetPurchaser: IPurchaser) {
      return this.purchasesList.filter((p) =>
        p.attributes.purchasers.data.some(
          (purchaser) => purchaser.id === targetPurchaser.id
        )
      );
    },

    getPurchasesValue(targetPurchaser: IPurchaser): number {
      //TODO: Change when implementing shared purchases

      const purchasesOwnedByPurchaser =
        this.filterPurchasesOwnedByPurchaser(targetPurchaser);

      if (purchasesOwnedByPurchaser.length > 0) {
        return purchasesOwnedByPurchaser
          .map((p) => this.getDividedPrice(p.attributes))
          .reduce((a, b) => a + b);
      }

      return 0;
    },

    getPurchasesAmount(targetPurchaser: IPurchaser): number {
      const purchases = this.filterPurchasesOwnedByPurchaser(targetPurchaser);

      return purchases.length;
    },

    /**
     * Gets the position of a Purchaser in a Purchase division.
     * @returns {number} positive index
     */
    getDividingPurchaseNumber(targetPurchaser: IPurchaser): number {
      const index = this.dividingPurchasers.findIndex(
        (p) => p.id == targetPurchaser.id
      );

      return index + 1;
    },
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

.blured {
  filter: blur(2px);
}
</style>
