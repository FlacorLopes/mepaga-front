<template>
  <q-card class="q-pa-md col" style="min-width: 200px; max-width: 220px">
    <q-spinner
      color="primary"
      size="md"
      class="absolute-center"
      v-if="loading"
    />

    <div class="row q-gutter-x-lg no-wrap">
      <div class="column q-gutter-y-xs">
        <q-avatar color="mp-lightblue-1" size="md">
          {{ name && name[0] }}
        </q-avatar>
        <div
          class="text-caption text-weight-bold text-positive"
          v-if="useUserStyle"
        >
          Você
        </div>
        <div class="text-caption text-weight-bold text-mp-blue-1" v-else>
          {{ name }}
        </div>
      </div>

      <div class="column q-gutter-y-none">
        <q-badge
          color="positive"
          class="q-mt-sm q-mr-sm"
          :label="badgeNumber"
          floating
          rounded
          v-show="badgeNumber >= 1"
        />
        <div class="text-subtitle1 text-mp-red-0 text-weight-medium">
          R$ {{ value }}
        </div>
        <div class="text-caption text-mp-blue-1" style="margin-top: -5px">
          {{ purchaseAmount }} compras
        </div>
      </div>
    </div>
  </q-card>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PurchaserCard',
  props: {
    useUserStyle: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
    },
    value: {
      type: String,
    },
    purchaseAmount: {
      type: Number,
    },
    badgeNumber: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  // setup() {

  // },
});
</script>
