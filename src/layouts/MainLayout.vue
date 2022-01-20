<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      reveal
      elevated
      class="text-white mp-header mp-ubuntu q-px-xl q-py-xs"
    >
      <q-toolbar>
        <q-toolbar-title class="mp-logo-title"> Bora Dividir </q-toolbar-title>

        <div class="row q-gutter-md">
          <q-avatar color="primary" text-color="white" v-if="auth.isLoggedIn">{{
            auth.user.username.charAt(0)
          }}</q-avatar>

          <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="rightDrawerOpen"
      :width="280"
      side="right"
      bordered
      class="mp-drawer"
    >
      <div class="q-pa-md q-gutter-sm" v-if="!auth.isLoggedIn">
        <q-input v-model="formLogin.email" type="email" label="email">
          <template v-slot:prepend>
            <q-icon name="mail" />
          </template>
        </q-input>
        <q-input v-model="formLogin.password" type="password" label="senha">
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
        </q-input>
        <q-btn
          push
          color="positive"
          icon="login"
          label="Login"
          :loading="auth.loading"
          @click="login"
        />
      </div>
      <div class="q-pa-md q-gutter-sm" v-else>
        <q-item clickable @click="logout">
          <q-item-section avatar>
            <q-icon name="logout" color="primary" />
          </q-item-section>
          <q-item-section> Sair </q-item-section>
        </q-item>
      </div>
    </q-drawer>

    <q-page-container class="q-px-xl">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { ref, reactive, computed } from 'vue';
import { useStore } from 'src/store';

export default {
  setup() {
    const store = useStore();
    const rightDrawerOpen = ref(true);
    const formLogin = reactive({
      email: '',
      password: '',
    });
    const auth = computed(() => store.state?.authentication);
    const toggleRightDrawer = () => {
      rightDrawerOpen.value = !rightDrawerOpen.value;
    };

    const login = async () => {
      await store.dispatch('authentication/login', {
        identifier: formLogin.email,
        password: formLogin.password,
      });
    };

    const logout = async () => {
      await store.dispatch('authentication/logout');
    };

    return {
      rightDrawerOpen,
      formLogin,
      auth,
      toggleRightDrawer,
      login,
      logout,
    };
  },
};
</script>
<style lang="scss">
.mp-header {
  background: $mepaga-blue-1;
}

.mp-logo-title {
  font-size: 3em;
  font-weight: 400;
}

.mp-drawer {
  background: $mepaga-white-0;
}
</style>
