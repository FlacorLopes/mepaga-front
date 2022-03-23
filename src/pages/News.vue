<template>
  <div class="q-px-lg q-pb-md mp-ubuntu">
    <q-timeline color="secondary">
      <q-timeline-entry heading>
        <div class="text-h5">Novidades aqui no MePaga</div>
      </q-timeline-entry>
      <q-timeline-entry
        title="Controlar compras com tags 🏷️"
        subtitle="22 de Março de 2022"
        icon="sell"
      >
        <q-item clickable :to="{ name: 'Help' }">
          <q-item-section avatar>
            <q-icon name="paid" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label
              >Agora você pode controlar suas compras usando tags. Com isso é
              possível filtrar gastos específicos, como Uber e Ifood.
            </q-item-label>
          </q-item-section>
        </q-item>

        <div class="row col">
          <q-card class="col-8">
            <q-card-section>
              <q-video
                :ratio="16 / 9"
                src="https://www.youtube.com/embed/38lO0iyS-TQ"
              />
            </q-card-section>
          </q-card>
        </div>
      </q-timeline-entry>
      <q-timeline-entry
        title="Exportar lista de compras"
        subtitle="19 de Março de 2022"
        icon="paid"
      >
        <q-item clickable :to="{ name: 'Help' }">
          <q-item-section avatar>
            <q-icon name="paid" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label
              >Agora é possível exportar a lista de compras da fatura. Também é
              possível selecionar apenas compradores específicos.</q-item-label
            >
          </q-item-section>
        </q-item>
        <div class="row col">
          <q-img
            src="https://i.imgur.com/c23AgkN.png"
            alt="como exportar a lista de compras"
            class="col-8"
          />
        </div>
      </q-timeline-entry>
      <q-timeline-entry
        title="Nova página de Ajuda"
        subtitle="15 de Março de 2022"
        icon="live_help"
      >
        <q-item clickable :to="{ name: 'Help' }">
          <q-item-section avatar>
            <q-icon name="live_help" color="primary" />
          </q-item-section>
          <q-item-section> Conheça a seção Ajuda </q-item-section>
        </q-item>
      </q-timeline-entry>

      <q-timeline-entry
        title="Faturas Picpay"
        subtitle="13 de Março de 2022"
        icon="credit_card"
      >
        <div>Agora você pode importar suas faturas do PicPay em PDF.</div>
      </q-timeline-entry>
      <q-timeline-entry
        title="Criptografia das Faturas"
        subtitle="12 de Março de 2022"
        icon="credit_card"
      >
        <div>
          Suas faturas tem a descrição das compras criptografadas. Dessa forma,
          nem mesmo nós podemos ter acesso a elas. Somente com sua Chave MePaga
          é possível fazer a descriptografia para apresentar a fatura.
        </div>
      </q-timeline-entry>
    </q-timeline>
  </div>
</template>
<script lang="ts">
import { useMeta } from 'quasar';
import { defineComponent } from 'vue';
const metaData = {
  title: 'Novidades',
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
  name: 'News',
  setup() {
    useMeta(metaData);
  },
});
</script>
