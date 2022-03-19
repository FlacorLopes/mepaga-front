<template>
  <q-card class="mp-card col">
    <q-card-section :class="{ blured: isSelecting }">
      <div class="text-mp-blue-1 text-subtitle1 text-weight-medium">
        Usuários de seu cartão nessa fatura
      </div>
      <div class="text-mp-blue-1 text-subtitle2 text-weight-light">
        clique em um card de comprador para atribuir a compra a ele
      </div>
    </q-card-section>
    <q-card-section class="q-gutter-y-md">
      <div class="row justify-center">
        <q-btn
          push
          dense
          color="white"
          text-color="primary"
          icon="share"
          label="Compartilhar compras"
          class="col"
          @click="$emit('showCharger')"
        />
      </div>
      <div>
        <div class="row q-gutter-sm-md q-gutter-xs-sm">
          <add-purchaser-card />
          <purchaser-card
            useUserStyle
            :value="userPurchasesValue"
            :purchaseAmount="userPurchases.length || 0"
            :badgeNumber="getDividingPurchaseNumber(userPurchaser)"
            :class="{ 'cursor-pointer': isSelecting }"
            @click="$emit('purchaserClick', userPurchaser)"
          />
        </div>
      </div>
      <q-scroll-area style="height: 240px" class="q-pb-xs">
        <div class="row q-gutter-sm-md q-gutter-xs-sm">
          <purchaser-card
            v-for="purchaser in purchasersList"
            :key="purchaser.name"
            :name="purchaser.name"
            :value="getPurchasesValueFromPurchaser(purchaser).toFixed(2)"
            :purchaseAmount="getPurchasesAmountFromPurchaser(purchaser)"
            :class="{ 'cursor-pointer': isSelecting }"
            :badgeNumber="getDividingPurchaseNumber(purchaser)"
            @click="$emit('purchaserClick', purchaser)"
          />
        </div>
      </q-scroll-area>

      <div>
        <div class="row" v-if="$q.screen.lt.md && (isDividing || isSelecting)">
          <q-btn
            class="col"
            push
            color="primary"
            label="Cancelar"
            @click="$emit('cancel')"
          />
        </div>
        <div class="row" v-show="isDividing">
          <q-btn
            label="Finalizar Divisão"
            color="positive"
            class="col"
            :disable="dividingPurchasers.length === 0"
            @click="$emit('finishDivision')"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IPurchase, IPurchaser } from 'src/services/app/dto/InvoiceDTO';
import PurchaserCard from 'src/components/PurchaserCard.vue';
import AddPurchaserCard from 'src/components/AddPurchaserCard.vue';

export default defineComponent({
  name: 'PurchasersList',
  emits: ['purchaserClick', 'finishDivision', 'cancel', 'showCharger'],
  components: { PurchaserCard, AddPurchaserCard },
  props: {
    modalToTeleport: {
      type: String,
    },
    isSelecting: {
      type: Boolean,
      default: false,
    },
    isDividing: {
      type: Boolean,
      default: false,
    },
    userPurchaser: {
      type: Object as PropType<IPurchaser>,
    },
    userPurchases: {
      type: Array as PropType<IPurchase[]>,
    },
    userPurchasesValue: {
      type: Number,
    },
    getPurchasesValueFromPurchaser: {
      type: Function,
    },
    getDividingPurchaseNumber: {
      type: Function,
    },
    getPurchasesAmountFromPurchaser: {
      type: Function,
    },
    purchasersList: {
      type: Array as PropType<IPurchaser[]>,
    },
    dividingPurchasers: {
      type: Array as PropType<IPurchaser[]>,
    },
  },
});
</script>
