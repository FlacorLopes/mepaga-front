<template>
  <div class="q-pt-xl q-px-md q-gutter-y-xl mp-ubuntu">
    <div class="q-gutter-md">
      <div class="text-h5 text-weight-bold text-primary">Bem Vindo(a)!</div>

      <div style="max-width: 450px">
        O MePaga te ajuda as organizar a faturas do seu cartão. Para começar,
        importe uma fatura.
      </div>
    </div>

    <div class="col column items-center relative-position">
      <q-select
        v-if="auth.isLoggedIn"
        v-model="selectedBank"
        :options="bankList"
        label="Selecione o Banco"
        class="absolute-center"
        :style="`z-index: 999; ${
          $q.screen.lt.md ? 'width: 50%' : 'width: 30%'
        }`"
        :disable="selectedBank !== null || !auth.isLoggedIn"
        @update:model-value="onBankSelected"
      >
        <template v-slot:append>
          <q-icon name="credit_card" color="primary" />
        </template>
      </q-select>
      <q-btn
        v-if="!auth.isLoggedIn"
        push
        color="primary"
        icon="img:images/google.svg"
        label="Entrar com o google"
        class="absolute-center"
        style="z-index: 999"
        :style="$q.screen.lt.sm ? 'width: 80%' : 'width: 40%'"
        :loading="auth.loading"
        :href="googleAuth"
      />
      <q-uploader
        :url="`${API_URL}api/invoices/upload?bank=${selectedBank?.toLocaleLowerCase()}`"
        color="positive"
        style="width: 100%; height: 100%"
        class="bd-uploader relative-position"
        accept="application/pdf"
        method="POST"
        :headers="[
          {
            name: 'Authorization',
            value: `Bearer ${auth.token?.access_token}`,
          },
        ]"
        auto-upload
        @uploaded="onUploadFinish"
        @failed="onFailed"
        :disable="selectedBank === null || !auth.isLoggedIn"
        ref="uploader"
        flat
      >
      </q-uploader>
    </div>
  </div>
</template>

<script lang="ts">
import { QUploader, useMeta, useQuasar } from 'quasar';
import { IInvoice } from 'src/services/app/dto/InvoiceDTO';
import { useStore } from 'src/store';
import { defineComponent, computed, ref } from 'vue';
import { useRouter } from 'vue-router';

interface QUploadInfo {
  xhr: {
    response: string;
  };
}

const metaData = {
  title: 'Importe uma Fatura',
  titleTemplate: (title: string) =>
    `${title} - MePaga | Organize as Faturas de Seus Cartões`,

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
        return `${ogTitle} - MePaga | Organize as Faturas de Seus Cartões`;
      },
    },
  },
};
export default defineComponent({
  name: 'PageIndex',
  setup() {
    const store = useStore();
    const auth = computed(() => store.state?.authentication);
    const router = useRouter();
    const selectedBank = ref<string>(null);
    const bankList = ref<string[]>(['Nubank']);
    const $q = useQuasar();
    const uploaderRef = ref<InstanceType<typeof QUploader>>();
    useMeta(metaData);

    const onUploadFinish = async (info: QUploadInfo) => {
      const invoice = JSON.parse(info.xhr.response) as IInvoice;
      await router.push({
        name: 'InvoiceViewer',
        params: {
          id: String(invoice.uid),
        },
      });
    };

    const onFailed = (info: QUploadInfo) => {
      console.log(info.xhr.response);

      $q.notify({
        type: 'warning',
        message:
          'Não foi possível ler sua fatura no momento. Por favor, tente mais tarde.',
      });
    };

    const onBankSelected = () => {
      // uploaderRef.value.
    };
    return {
      auth,
      selectedBank,
      bankList,
      uploaderRef,
      googleAuth: process.env.GOOGLE_AUTH,
      API_URL: process.env.API_URL,
      onUploadFinish,
      onFailed,
      onBankSelected,
    };
  },
});
</script>
<style lang="scss" scoped>
.bd-uploader {
  border: 2px dashed $mepaga-blue-2;
  border-radius: 10px;

  min-height: 330px;
}
</style>
