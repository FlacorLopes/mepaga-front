<template>
  <div
    class="q-pa-md q-gutter-y-md"
    :style="`width: ${$q.screen.lt.md ? '100%' : '60%'}`"
  >
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
    <q-card>
      <q-card-section>
        <div class="text-h6 mp-ubuntu text-primary text-uppercase">
          Como exportar a lista de compras da fatura por pessoa
        </div>
        <q-separator />
      </q-card-section>
      <q-card-section>
        <q-video
          :ratio="16 / 9"
          src="https://www.youtube.com/embed/CDqBPKo7kBM"
        />
      </q-card-section>
    </q-card>
  </div>
</template>
<script lang="ts">
import { useMeta } from 'quasar';
import { defineComponent } from 'vue';

const metaData = {
  title: 'Ajuda',
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
  name: 'Help',
  setup() {
    useMeta(metaData);
  },
});
</script>
