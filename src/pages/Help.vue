<template>
  <div class="q-pa-md" :style="`width: ${$q.screen.lt.md ? '100%' : '60%'}`">
    <q-card>
      <q-card-section>
        <div class="text-h6 mp-ubuntu text-primary text-uppercase">
          Como importar faturas
        </div>
        <q-separator />
      </q-card-section>
      <q-card-section>
        <q-video
          :ratio="16 / 9"
          src="https://www.youtube.com/embed/2Pq-dAFFvwo"
        />
      </q-card-section>
    </q-card>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Help',
  setup() {
    //
  },
});
</script>
