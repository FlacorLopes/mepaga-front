<template>
  <q-card
    class="q-px-md q-pt-none col"
    style="max-width: 220px; max-height: 88px"
  >
    <div
      class="column q-gutter-y-sm no-wrap items-center"
      style="max-height: 80px"
    >
      <q-input autofocus dense label="adicione uma pessoa" v-model="nameValue">
        <template v-slot:prepend>
          <q-icon name="face" />
        </template>
      </q-input>
      <q-btn
        rounded
        color="mp-green-0"
        label="Adicionar"
        size="sm"
        :loading="loading"
        :disable="nameValue.length < 2 || nameValue.length > 10"
        @click="addPurchaser"
      />
    </div>
  </q-card>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

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
  setup() {
    const nameValue = ref('');
    const loading = ref(false);

    return {
      nameValue,
      loading,
    };
  },

  methods: {
    async addPurchaser() {
      try {
        this.loading = true;
        await this.$store.dispatch('invoices/addPurchaser', this.nameValue);
        this.nameValue = '';
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },
  },
});
</script>
<style lang="scss" scoped></style>
