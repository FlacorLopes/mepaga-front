<template>
  <q-card
    class="q-px-md q-pt-none col"
    style="max-width: 220px; max-height: 88px"
  >
    <div
      class="column q-gutter-y-sm no-wrap items-center"
      style="max-height: 80px"
    >
      <q-input autofocus dense label="adicione uma pessoa">
        <template v-slot:prepend>
          <q-icon name="face" />
        </template>
      </q-input>
      <q-btn rounded color="mp-green-0" label="Adicionar" size="sm" />
    </div>
  </q-card>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

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
  // setup() {

  // },
});
</script>
<style lang="scss" scoped></style>
