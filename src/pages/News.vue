<template>
  <div class="q-px-lg q-pb-md mp-ubuntu">
    <q-timeline color="secondary">
      <q-timeline-entry heading>
        <div class="text-h4">Novidades aqui no MePaga</div>
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
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'News',
  setup() {
    //
  },
});
</script>
