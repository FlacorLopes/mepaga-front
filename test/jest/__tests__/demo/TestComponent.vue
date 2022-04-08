<template>
  <h1>Teste</h1>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'TestComponent',
  setup() {
    return {
      counter: ref(0),
    };
  },
});
</script>
