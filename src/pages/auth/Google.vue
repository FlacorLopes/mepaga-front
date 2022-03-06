<template>
  <q-page padding>
    <!-- content -->
  </q-page>
</template>

<script lang="ts">
import { AuthService } from 'src/services/auth/AuthService';
import { useStore } from 'src/store';
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';

const authService = new AuthService();
export default defineComponent({
  // name: 'PageName'
  setup() {
    const router = useRouter();
    const store = useStore();
    const access_token = computed(
      () => router.currentRoute.value.query.access_token
    );

    if (access_token.value) {
      void authService
        .googleLogin(<string>access_token.value)
        .then((response) => {
          store.commit('authentication/setLoggedIn', response);
          void router.push('/');
        });
    }
  },
});
</script>
