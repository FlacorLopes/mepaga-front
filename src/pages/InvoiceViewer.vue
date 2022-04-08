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
        <q-card-section class="q-gutter-y-sm">
          <div class="row justify-between q-py-none">
            <q-btn-group push>
              <q-btn
                push
                dense
                label="Tags"
                icon="sell"
                color="white"
                text-color="primary"
                :disable="isSelecting || isDividing"
                @click="displayTagManager = true"
              >
              </q-btn>
            </q-btn-group>
            <div class="col-sm-3 col-xs-6">
              <q-select
                outlined
                dense
                multiple
                :max-values="3"
                label="Filtrar por tags"
                color="primary"
                v-model="tagsForFilter"
                :options="userTagList"
                :disable="isSelecting || isDividing"
              >
                <template v-slot:selected-item="scope">
                  <q-chip
                    removable
                    dense
                    @remove="scope.removeAtIndex(scope.index)"
                    :tabindex="scope.tabindex"
                    icon="sell"
                    color="mp-white-0"
                    text-color="primary"
                    class="q-ma-none"
                  >
                    {{ scope.opt.name }}
                  </q-chip>
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-chip
                      :label="scope.opt.name"
                      dense
                      icon="sell"
                      color="mp-white-0"
                      text-color="primary"
                    />
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
          <q-scroll-area style="height: 260px">
            <purchase-row
              v-for="(p, index) in purchasesList"
              :key="p.id"
              class="q-mb-sm shadow-1 rounded-borders cursor-pointer"
              :class="
                index % 2 !== 0 ? 'bg-mp-lightblue-1' : 'bg-mp-lightblue-2'
              "
              :purchaseId="p.id"
              :date="p.attributes.date"
              :title="p.attributes.title"
              :price="formatCurrency(p.attributes.price)"
              :isShared="p.attributes.isShared"
              :isDividing="isDividing"
              :purchasers="p.attributes.purchasers.data"
            />
            <!-- <div
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
                <div class="row items-center">
                  <q-checkbox
                    v-if="isTagging"
                    v-model="taggedPurchases"
                    :val="p.id"
                    dense
                    size="sm"
                  />
                  <div
                    class="column q-gutter-sm-x-md text-weight-regular text-mp-white-0"
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
                </div>
                <q-space />
                <div class="column justify-end q-mt-xs-md">
                  <div class="row q-gutter-x-xs">
                    <q-chip
                      v-for="tag in p.attributes.tags.data"
                      :key="tag.id"
                      :label="tag.attributes.name"
                      dense
                      removable
                      clickable
                      icon="sell"
                      color="mp-white-0"
                      text-color="primary"
                      @remove="
                        handleTagRemove(
                          { id: tag.id, ...tag.attributes },
                          {
                            id: p.id,
                            ...p.attributes,
                          }
                        )
                      "
                    />
                  </div>
                  <div class="row items-center q-gutter-x-sm">
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
                      text-color="primary"
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
            </div> -->
          </q-scroll-area>
        </q-card-section>
        <q-card-section class="q-pt-none row">
          <div class="column col" v-if="isTagging">
            <div class="row col q-gutter-x-xs">
              <q-chip
                v-for="tag in tagsToBeAdded"
                :key="tag.id"
                :label="tag.name"
                dense
                color="primary"
                text-color="mp-white-0"
              />
            </div>
            <q-btn
              id="taggingActionButton"
              icon="sell"
              :label="
                taggedPurchases.length > 0
                  ? 'Finalizar Adição de Tags'
                  : 'Cancelar Adição de Tags'
              "
              color="positive"
              text-color="primary"
              class="col"
              @click="finishTagging"
            />
          </div>
          <div
            v-else
            class="row bg-mp-white-2 shadow-1 rounded-borders q-pa-lg items-center col"
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
    <q-dialog v-model="displayTagManager">
      <tag-manager @finishTagsSelection="handleTaggin" />
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { useStore } from 'src/store';
import { useRouter } from 'vue-router';
import { defineComponent, computed, ref, nextTick } from 'vue';
import LoadingTableSkeleton from 'src/components/LoadingTableSkeleton.vue';
import { QDialog, useMeta, useQuasar, scroll } from 'quasar';
import { getFullTextDate, getPurchaseOwner } from 'src/utils/InvoiceUtils';
import { IPurchase, IPurchaser, ITag } from 'src/services/app/dto/InvoiceDTO';
import { formatCurrency } from '@brazilian-utils/brazilian-utils';
import PurchasersList from 'src/components/PurchasersList.vue';
import { AuthService } from 'src/services/auth/AuthService';
import PurchasesCharger from 'src/components/PurchasesCharger.vue';
import TagManager from 'src/components/TagManager.vue';
import PurchaseRow from 'src/components/PurchaseRow/PurchaseRow.vue';

const authService = new AuthService();
const { getScrollTarget, setVerticalScrollPosition } = scroll;

// takes an element object
function scrollToElement(el: HTMLElement, duration = 500) {
  const target = getScrollTarget(el);
  const offset = el.offsetTop + el.offsetHeight;
  setVerticalScrollPosition(target, offset, duration);
}

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
    TagManager,
    PurchasersList,
    PurchasesCharger,
    PurchaseRow,
  },
  name: 'InvoiceViewer',
  setup() {
    const store = useStore();
    const router = useRouter();
    useMeta(metaData);

    const $q = useQuasar();

    const secret = ref($q.cookies.get('mepaga_secret'));
    const askSecret = ref(false);

    const loading = ref(true);
    const isSelecting = ref(false);
    const isDividing = ref(false);
    const dividingPurchasers = ref<IPurchaser[]>([]);

    const isTagging = ref(false);
    const tagsToBeAdded = ref<ITag[]>([]);
    const taggedPurchases = ref<number[]>([]);
    const displayTagManager = ref(false);
    const userTagList = computed(() => store.state.invoices.userTagList);
    const tagsForFilter = ref<ITag[]>([]);

    const selectedPurchaseId = ref();
    const invoiceId = computed(() => router.currentRoute.value.params.id);
    const currentInvoice = computed(() => store.state.invoices?.currentInvoice);
    const purchasesList = computed(() => {
      if (tagsForFilter.value.length === 0)
        return currentInvoice.value?.purchases.data;

      return currentInvoice.value?.purchases.data.filter((purchase) =>
        purchase.attributes.tags.data.some((tag) =>
          tagsForFilter.value.some((filterTag) => filterTag.id === tag.id)
        )
      );
    });

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
      isTagging,
      tagsToBeAdded,
      tagsForFilter,
      userTagList,
      displayTagManager,
      taggedPurchases,
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
    handleTagCheckboxToggle(id: number) {
      if (this.taggedPurchases.includes(id)) {
        const index = this.taggedPurchases.findIndex(
          (purchaseId) => id === purchaseId
        );
        this.taggedPurchases.splice(index, 1);

        return;
      }

      this.taggedPurchases.push(id);
    },
    handlePurchaseSelection(purchaseId: number) {
      if (this.isTagging) {
        this.handleTagCheckboxToggle(purchaseId);
        return;
      }
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

    async handleTaggin(tags: ITag[]) {
      this.isTagging = true;
      this.tagsToBeAdded = tags;

      // necessary to get the element by id
      await nextTick();
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const taggingActionButton = document.querySelector(
        '#taggingActionButton'
      ) as HTMLElement;
      scrollToElement(taggingActionButton, 100);
    },

    async finishTagging() {
      try {
        this.isTagging = false;

        if (this.taggedPurchases.length === 0) return;

        this.$q.loading.show({
          spinnerColor: 'positive',
        });
        await Promise.all(
          this.taggedPurchases.map((purchaseId) => {
            return this.$store.dispatch('invoices/addTagsToPurchase', {
              tags: this.tagsToBeAdded,
              purchaseId,
            });
          })
        );

        this.taggedPurchases = [];
      } catch (error) {
        console.log(error);
      } finally {
        this.$q.loading.hide();
      }
    },

    async handleTagRemove(tag: ITag, purchase: IPurchase) {
      const tagToRemoveIndex = purchase.tags.data.findIndex(
        (t) => t.id === tag.id
      );

      if (tagToRemoveIndex != -1) {
        await this.$store.dispatch('invoices/addTagsToPurchase', {
          tags: [...purchase.tags.data.filter((t) => t.id !== tag.id)],
          purchaseId: purchase.id,
        });
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
      if (!this.isSelecting) {
        return;
      }

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
