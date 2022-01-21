<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      reveal
      elevated
      class="text-white mp-header mp-ubuntu q-px-sm-sm q-px-md-xl q-py-xs"
    >
      <q-toolbar>
        <q-toolbar-title class="mp-logo-title"> Bora Dividir </q-toolbar-title>

        <div class="row q-gutter-md">
          <q-avatar
            color="bd-white-0"
            text-color="primary"
            v-if="auth.isLoggedIn"
            >{{ auth.user.username.charAt(0) }}</q-avatar
          >

          <q-btn
            dense
            flat
            round
            icon="menu"
            @click="toggleRightDrawer"
            color="positive"
          />
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
        <q-item clickable to="minhas-faturas">
          <q-item-section avatar>
            <q-icon name="credit_card" color="primary" />
          </q-item-section>
          <q-item-section> Minhas faturas </q-item-section>
        </q-item>
      </div>
    </q-drawer>

    <q-page-container class="q-px-sm-sm q-px-md-xl">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { ref, reactive, computed } from 'vue';
import { useStore } from 'src/store';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const formLogin = reactive({
      email: '',
      password: '',
    });
    const auth = computed(() => store.state?.authentication);
    const rightDrawerOpen = ref(!auth.value.isLoggedIn ? true : false);

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
      await router.push('/');
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
