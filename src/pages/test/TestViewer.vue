<template>
  <purchase-row />
</template>
<script lang="ts">
import PurchaseRow from 'src/components/PurchaseRow/PurchaseRow.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { PurchaseRow },
  name: 'TestViewer',
  setup() {
    //
  },
});
</script>
