<template>
  <q-checkbox v-model="model" :val="1" label="teste" />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'TestViewer',
  setup() {
    return {
      model: ref([1]),
    };
  },
});
</script>
