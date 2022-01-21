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
      url="http://localhost:3000/upload"
      color="positive"
      style="width: 100%; height: 100%"
      class="bd-uploader"
      flat
    />
  </div>
</template>

<script lang="ts">
import { Todo, Meta } from 'components/models';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const todos = ref<Todo[]>([
      {
        id: 1,
        content: 'ct1',
      },
      {
        id: 2,
        content: 'ct2',
      },
      {
        id: 3,
        content: 'ct3',
      },
      {
        id: 4,
        content: 'ct4',
      },
      {
        id: 5,
        content: 'ct5',
      },
    ]);
    const meta = ref<Meta>({
      totalCount: 1200,
    });
    return { todos, meta };
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
