<template>
  <div class="q-pt-xl q-px-md q-gutter-y-xl mp-ubuntu">
    <div class="q-gutter-md">
      <div class="text-h4 text-weight-bold text-primary">Bem Vindx</div>
      <div style="max-width: 450px">
        O MePaga te ajuda a organizar a fatura do seu cartão. Para começar,
        importe uma fatura.
      </div>
    </div>
    <q-uploader
      :url="`http://localhost:1337/api/invoices/upload?bank=${'nubank'}`"
      color="positive"
      style="width: 100%; height: 100%"
      class="bd-uploader"
      accept="application/pdf"
      method="POST"
      :headers="[
        { name: 'Authorization', value: `Bearer ${auth.token?.access_token}` },
      ]"
      @uploaded="onUploadFinish"
      flat
    >
      <q-spinner class="relative-center" color="primary" size="28px" />
    </q-uploader>
  </div>
</template>

<script lang="ts">
import { IInvoice } from 'src/services/app/dto/InvoiceDTO';
import { useStore } from 'src/store';
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';

interface QUploadInfo {
  xhr: {
    response: string;
  };
}
export default defineComponent({
  name: 'PageIndex',
  setup() {
    const store = useStore();
    const auth = computed(() => store.state?.authentication);
    const router = useRouter();

    const onUploadFinish = async (info: QUploadInfo) => {
      const invoice = JSON.parse(info.xhr.response) as IInvoice;
      await router.push(`/fatura/${invoice.id}`);
    };

    return { auth, onUploadFinish };
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
