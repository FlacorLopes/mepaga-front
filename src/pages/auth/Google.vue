<template>
  <q-page padding>
    <!-- content -->
  </q-page>
</template>

<script lang="ts">
import { api } from 'src/boot/axios';
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
export default defineComponent({
  // name: 'PageName'
  async setup() {
    const router = useRouter();
    const access_token = computed(
      () => router.currentRoute.value.query.access_token
    );

    if (access_token.value) {
      const response = await api.get(
        `http://localhost:1337/api/auth/google/callback?access_token=${
          access_token.value as string
        }`
      );
      console.log(response);
    }
  },
});
</script>
