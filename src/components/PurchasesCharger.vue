<template>
  <q-card class="bg-mp-white-0 col mp-ubuntu">
    <q-card-section>
      <div class="row no-wrap items-center q-gutter-x-md">
        <q-icon name="shopping_bag" color="positive" size="md" />
        <div class="text-mp-blue-1 text-subtitle1 text-weight-medium">
          Essa é a lista de compras por compradores
        </div>
      </div>
      <q-separator />
    </q-card-section>
    <q-card-actions>
      <div class="row q-px-sm col justify-center">
        <q-btn
          push
          dense
          icon="content_copy"
          color="primary"
          class="col-6"
          text-color="positive"
          label="Copiar texto"
          @click="copy"
        />
      </div>
    </q-card-actions>
    <q-card-section>
      <q-list bordered>
        <q-expansion-item
          v-for="(purchaser, index) in purchasers"
          :key="purchaser.name"
          group="somegroup"
          icon="face"
          :default-opened="purchaser.representsUser"
          header-class="text-primary"
          class="relative-position"
        >
          <template v-slot:header>
            <q-badge floating rounded :label="purchaser.purchases.length" />
            <q-item-section side>
              <q-checkbox v-model="exportList[index]" />
            </q-item-section>
            <q-item-section side v-if="$q.screen.gt.xs">
              <q-icon name="face" color="primary" />
            </q-item-section>

            <q-item-section> {{ purchaser.name }} </q-item-section>

            <q-item-section side>
              <q-chip
                color="mp-lightblue-0"
                dense
                text-color="mp-red-0"
                icon="paid"
                style="width: 90px; max-width: 90px"
              >
                R$ {{ formatCurrency(purchaser.total) }}
              </q-chip>
            </q-item-section>
          </template>
          <q-card>
            <q-card-section>
              <q-list bordered separator dense>
                <q-item
                  v-ripple
                  v-for="purchase in purchaser.purchases"
                  :key="purchase.id"
                >
                  <q-item-section>
                    <q-item-label>{{ purchase.attributes.title }}</q-item-label>
                    <q-item-label caption class="row q-gutter-x-md">
                      <q-chip
                        color="mp-white-2"
                        dense
                        text-color="mp-red-0"
                        style="width: 80px; max-width: 80px"
                      >
                        <div class="text-caption text-mp-blue-1">
                          {{ purchase.attributes.date }}
                        </div>
                      </q-chip>
                      <q-chip
                        color="mp-lightblue-0"
                        dense
                        text-color="mp-red-0"
                        icon="paid"
                        style="width: 90px; max-width: 90px"
                      >
                        R$ {{ formatCurrency(purchase.attributes.price) }}
                      </q-chip>
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <!-- <q-item v-ripple>
                  <q-item-section>
                    <q-item-label
                      >Item with caption grande grande grande
                      grabde</q-item-label
                    >
                    <q-item-label caption>Caption</q-item-label>
                  </q-item-section>
                </q-item> -->
              </q-list>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-separator />
      </q-list>
    </q-card-section>
  </q-card>
</template>
<script lang="ts">
import { formatCurrency } from '@brazilian-utils/brazilian-utils';
import {
  IInvoice,
  IPurchase,
  IPurchaser,
} from 'src/services/app/dto/InvoiceDTO';
import { ResponseObject } from 'src/services/StrapiResponseWrapper';
import { defineComponent, PropType, computed, reactive } from 'vue';
import { copyToClipboard } from 'quasar';
import { getFullTextDate } from 'src/utils/InvoiceUtils';

export default defineComponent({
  props: {
    invoice: {
      type: Object as PropType<IInvoice>,
      required: true,
    },

    purchasesList: {
      type: Array as PropType<ResponseObject<IPurchase>[]>,
      required: true,
    },
    purchasersList: {
      type: Array as PropType<IPurchaser[]>,
      required: true,
    },
    getDividedPrice: {
      type: Function as PropType<(arg0: IPurchase) => number>,
      required: true,
    },
  },
  setup(props) {
    const purchasers = computed(() => {
      // unique set of purchaser along with it's purchases
      const listSet = new Set([
        ...props.purchasersList.map((p) => {
          const purchases = props.purchasesList.filter((purchase) =>
            purchase.attributes.purchasers.data
              .map((innerPurchaser) => innerPurchaser.id)
              .includes(p.id)
          );

          let total = 0.0;
          if (purchases.length > 0) {
            total = purchases
              .map((p) => props.getDividedPrice(p.attributes))
              .reduce((a, b) => a + b);
          }
          return {
            name: p.name,
            purchases,
            export: true,
            total,
            representsUser: p.representsUser,
          };
        }),
      ]);

      return Array.from(listSet);
    });

    const exportList = reactive(purchasers.value.map(() => true));

    return {
      purchasers,
      exportList,
      formatCurrency,
    };
  },
  methods: {
    copy() {
      let text = `Minha fatura do ${this.invoice.BANK} de ${getFullTextDate(
        this.invoice?.dueDate
      )}. ✅\n💰Total: ${formatCurrency(this.invoice.total)}\n\n`;

      this.purchasers
        .filter((p, index) => this.exportList[index] === true)
        .forEach((p) => {
          const purchasesLines = p.purchases.map((purchase, index) => {
            const isLastPurchase = index === p.purchases.length - 1;
            const isFirstPurchase = index === 0;
            const isShared = purchase.attributes.isShared;
            const numberOfPurchasers =
              purchase.attributes.purchasers.data.length;
            const getPriceWithDivision = () =>
              isShared
                ? purchase.attributes.price / numberOfPurchasers
                : purchase.attributes.price;

            return `${isFirstPurchase ? `${p.name}\n` : ''}\t💰 ${
              purchase.attributes.date
            } - ${purchase.attributes.title}: R$ ${formatCurrency(
              isShared ? getPriceWithDivision() : purchase.attributes.price
            )}${
              isShared
                ? ` (${purchase.attributes.price} dividido por ${numberOfPurchasers})`
                : ''
            } ${
              isLastPurchase
                ? `\n\t🤑 Total: R$ ${formatCurrency(
                    p.total
                  )}\n\nControle suas faturas no www.mepaga.net\n\n`
                : ''
            }`;
          });

          text += purchasesLines.join('\n');
        });

      copyToClipboard(text)
        .then(() => {
          this.$q.notify({
            type: 'positive',
            message: 'Extrato copiado ✨',
            textColor: 'primary',
          });
        })
        .catch(() => {
          this.$q.notify({
            type: 'warining',
            message: 'Não foi possível copiar o extrato :(',
          });
        });
    },
  },
});
</script>
