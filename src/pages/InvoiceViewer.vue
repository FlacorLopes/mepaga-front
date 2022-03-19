<template>
  <div class="q-pt-md-xl q-pt-xs-sm q-px-md-md q-px-xs-sm mp-ubuntu">
    <div
      class="column-xs row-md q-gutter-xs-x-none q-gutter-xs-y-md q-gutter-y-xl q-gutter-md-x-md"
    >
      <loading-table-skeleton v-if="loading || !currentInvoice" />
      <q-card class="mp-card col-sm-7 col-xs-12" v-else>
        <q-card-section :class="{ blured: isSelecting }">
          <div class="text-mp-blue-1 text-subtitle1 text-weight-medium">
            Sua fatura do
            <span style="text-transform: captalize">{{
              currentInvoice.BANK
            }}</span>
            de
            {{ dueDate }}
          </div>
          <div class="text-mp-blue-1 text-subtitle2 text-weight-light">
            <div clss="row items-base">
              clique em um linha, ou no menu
              <q-icon name="more_horiz" color="primary" size="sm" />, para
              atribuir a dívida a alguém
            </div>
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
                    <q-menu auto-close :class="{ 'z-max': $q.screen.lt.md }">
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

      <purchasers-list
        v-if="!showMobilePurchasers && !loading && currentInvoice"
        :isSelecting="isSelecting"
        :isDividing="isDividing"
        :dividingPurchasers="dividingPurchasers"
        :purchasersList="purchasersList"
        :userPurchases="userPurchases"
        :userPurchaser="userPurchaser"
        :userPurchasesValue="userPurchasesValue.toFixed(2)"
        :getDividingPurchaseNumber="getDividingPurchaseNumber"
        :getPurchasesAmountFromPurchaser="getPurchasesAmount"
        :getPurchasesValueFromPurchaser="getPurchasesValue"
        @finish-division="handleDivisionFinish"
        @purchaser-click="handlePurchaserClick"
        @showCharger="showPurchasesCharger = true"
      />
    </div>
    <q-dialog
      v-model="showMobilePurchasers"
      transition-duration="500"
      full-height
      ref="modal"
    >
      <purchasers-list
        v-if="!loading && currentInvoice"
        :isSelecting="isSelecting"
        :isDividing="isDividing"
        :dividingPurchasers="dividingPurchasers"
        :purchasersList="purchasersList"
        :userPurchases="userPurchases"
        :userPurchaser="userPurchaser"
        :userPurchasesValue="userPurchasesValue.toFixed(2)"
        :getDividingPurchaseNumber="getDividingPurchaseNumber"
        :getPurchasesAmountFromPurchaser="getPurchasesAmount"
        :getPurchasesValueFromPurchaser="getPurchasesValue"
        @finish-division="handleDivisionFinish"
        @purchaser-click="handlePurchaserClick"
        @cancel="hideModal"
      />
    </q-dialog>
    <q-dialog v-model="askSecret" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Informe sua Chave MePaga</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="secret"
            type="password"
            name="chave_mepaga"
            autofocus
          >
            <template v-slot:prepend>
              <q-icon name="vpn_key" color="primary" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Confirmar" v-close-popup @click="setSecret" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="showPurchasesCharger"
      transition-duration="500"
      full-height
    >
      <purchases-charger
        v-if="showPurchasesCharger"
        :invoice="currentInvoice"
        :userStuff="userStuff"
        :purchasersList="purchasersList"
        :purchasesList="purchasesList"
        :getDividedPrice="getDividedPrice"
      />
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { useStore } from 'src/store';
import { useRouter } from 'vue-router';
import { defineComponent, computed, ref } from 'vue';
import LoadingTableSkeleton from 'src/components/LoadingTableSkeleton.vue';
import { QDialog, useMeta, useQuasar } from 'quasar';

import { getFullTextDate, getPurchaseOwner } from 'src/utils/InvoiceUtils';
import { IPurchase, IPurchaser } from 'src/services/app/dto/InvoiceDTO';
import { formatCurrency } from '@brazilian-utils/brazilian-utils';
import PurchasersList from 'src/components/PurchasersList.vue';
import { AuthService } from 'src/services/auth/AuthService';
import PurchasesCharger from 'src/components/PurchasesCharger.vue';

const authService = new AuthService();

const metaData = {
  title: 'Controle sua Fatura',
  titleTemplate: (title: string) =>
    `${title} - MePaga | O lugar certo para organizar suas faturas`,

  // meta tags
  meta: {
    description: {
      name: 'description',
      content: 'Importe a fatura do seu cartão em PDF e organize por compra.',
    },
    keywords: {
      name: 'keywords',
      content: 'fatura,cartão,pdf,importar fatura,dividir compras,compras,',
    },
    equiv: {
      'http-equiv': 'Content-Type',
      content: 'text/html; charset=UTF-8',
    },
    // note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
    ogTitle: {
      property: 'og:title',
      // optional; similar to titleTemplate, but allows templating with other meta properties
      template(ogTitle: string) {
        return `${ogTitle} - MePaga | O lugar certo para organizar suas faturas`;
      },
    },
  },
};
export default defineComponent({
  components: {
    LoadingTableSkeleton,

    PurchasersList,
    PurchasesCharger,
  },
  name: 'InvoiceViewer',
  setup() {
    const store = useStore();
    const router = useRouter();
    useMeta(metaData);

    const $q = useQuasar();

    const secret = ref($q.cookies.get('mepaga_secret'));
    const askSecret = ref(false);

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
    const userPurchasesValue = computed(() => {
      if (userPurchases.value.length > 0)
        return userPurchases.value
          .map((p) => getDividedPrice(p.attributes))
          .reduce((a, b) => a + b);

      return 0;
    });
    const purchasersList = computed(() => store.state.invoices.purchasers);

    const dueDate = computed(() => {
      if (currentInvoice.value.dueDate) {
        return getFullTextDate(currentInvoice.value.dueDate);
      }
      return '';
    });

    const showMobilePurchasers = computed(
      () => $q.screen.lt.md && (isSelecting.value || isDividing.value)
    );
    const showPurchasesCharger = ref(false);

    if (invoiceId.value) {
      if (!secret.value) {
        askSecret.value = true;
        $q.notify({
          type: 'warning',
          message: 'Ops! Sua Chave MePaga não foi detectada',
        });
      } else {
        store
          .dispatch('invoices/loadInvoice', {
            id: invoiceId.value,
            secret: secret.value,
          })
          .then(() => {
            loading.value = false;
            $q.notify({
              type: 'positive',
              message: 'Fatura descriptografada com sua Chave MePaga ✨',
              textColor: 'primary',
              multiLine: true,
              timeout: 3000,
            });
          })
          .catch((error) => {
            console.log('Ocorreu um erro ao carregar a fatura', error);
            $q.notify({
              type: 'warning',
              message: 'Ops! Sua Chave MePaga não foi detectada',
              timeout: 5000,
            });
          });
      }
    }

    const getDividedPrice = (purchase: IPurchase): number => {
      // divides purchase value by all our purchasers
      if (purchase.isShared)
        return purchase.price / purchase.purchasers.data.length;
      return purchase.price;
    };

    const setSecret = () => {
      authService.setSecretCookie(secret.value);
      window.location.reload();
    };

    const userStuff = computed(() => ({
      user: userPurchaser.value,
      purchases: userPurchases.value,
    }));

    return {
      secret,
      askSecret,
      currentInvoice,
      invoiceId,
      dueDate,
      purchasesList,
      userPurchases,
      userPurchasesValue,
      userPurchaser,
      userStuff,
      purchasersList,
      loading,
      isSelecting,
      selectedPurchaseId,
      isDividing,
      dividingPurchasers,
      showMobilePurchasers,
      showPurchasesCharger,
      authService,
      setSecret,
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

      if (this.showMobilePurchasers) {
        setTimeout(() => {
          this.isSelecting = false;
          this.selectedPurchaseId = undefined;
        }, 500);
      } else {
        this.isSelecting = false;
        this.selectedPurchaseId = undefined;
      }
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
      this.isSelecting = false;
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
    hideModal() {
      this.isSelecting = false;
      this.isDividing = false;
      this.dividingPurchasers = [];

      (this.$refs.modal as QDialog).hide();
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
