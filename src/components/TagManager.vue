<template>
  <q-card class="bg-mp-white-0 mp-ubuntu fit">
    <q-card-section>
      <div class="row no-wrap items-center q-gutter-x-md">
        <q-icon name="sell" color="positive" size="sm" />
        <div class="text-mp-blue-1 text-subtitle1 text-weight-medium">
          Escolher Tags
        </div>
      </div>
      <q-separator />
    </q-card-section>
    <q-card-section class="q-gutter-y-sm">
      <q-select
        filled
        v-model="selectedTags"
        :max-values="3"
        :options="options"
        :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'"
        multiple
        use-chips
        label="Selecione as tags"
        hint="No máximo 3 tags."
      />
      <div class="row justify-center col">
        <q-btn
          rounded
          color="primary"
          text-color="positive"
          label="Adicionar Tags"
          size="sm"
          class="q-mb-xs-md col"
          v-close-popup
          @click="
            () => {
              $emit(
                'finishTagsSelection',
                selectedTags.map((t) => t.tag)
              );
              selectedTags = [];
            }
          "
        />
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row no-wrap items-center q-gutter-x-md">
        <q-icon name="sell" color="positive" size="sm" />
        <div class="text-mp-blue-1 text-subtitle1 text-weight-medium">
          Criar Tags
        </div>
      </div>
      <q-separator />
    </q-card-section>
    <q-card-section class="q-gutter-y-sm">
      <q-input
        v-model="newTagName"
        :maxlength="12"
        :error="tagAlreadyExists"
        error-message="Essa tag já existe :)"
        filled
        label="Insira a nova tag"
        hint="No máximo 12 caracteres."
        class="text-lowercase"
        @keydown="tagAlreadyExists = false"
      >
      </q-input>
      <div class="row justify-center col">
        <q-btn
          rounded
          color="primary"
          text-color="positive"
          label="Criar Tag"
          size="sm"
          class="q-mb-xs-md col"
          :loading="loading"
          @click="createTag"
        />
      </div>
    </q-card-section>
  </q-card>
</template>
<script lang="ts">
import { ITag } from 'src/services/app/dto/InvoiceDTO';
import { useStore } from 'src/store';
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  name: 'TagManager',
  emits: ['finishTagsSelection'],
  setup() {
    const store = useStore();
    const selectedTags = ref<{ label: string; tag: ITag }[]>([]);
    const options = computed<{ label: string; tag: ITag }[]>(() => {
      const tags = store.state.invoices.userTagList;
      return tags.map((t) => ({ label: t.name, tag: t }));
    });
    const newTagName = ref('');
    const loading = ref(false);
    const tagAlreadyExists = ref(false);

    return {
      selectedTags,
      options,
      newTagName,
      loading,
      tagAlreadyExists,
    };
  },
  methods: {
    async createTag() {
      try {
        if (
          this.options.some(
            (labeledTag) => labeledTag.tag.name === this.newTagName
          )
        ) {
          this.tagAlreadyExists = true;
          return;
        }

        this.tagAlreadyExists = false;
        this.loading = true;
        const tag = <ITag>await this.$store.dispatch('invoices/createTag', {
          name: this.newTagName,
        });
        this.loading = false;
        this.newTagName = '';

        if (this.selectedTags.length == 3) this.selectedTags.pop();
        this.selectedTags = [
          { label: tag.name, tag: tag },
          ...this.selectedTags,
        ];
      } catch (error) {
        this.$q.notify({
          type: 'error',
          message: 'Ocorreu um erro ao criar a tag. Por favor, tente depois.',
        });
      }
    },
  },
});
</script>
