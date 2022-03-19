<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      reveal
      elevated
      class="text-white mp-header mp-ubuntu q-px-sm-sm q-px-md-xl q-py-xs"
    >
      <q-toolbar>
        <q-toolbar-title
          class="mp-logo-title cursor-pointer"
          @click="$router.push('/')"
        >
          MePaga
          <sup style="font-size: 12px">beta</sup>
        </q-toolbar-title>

        <div class="row q-gutter-md">
          <q-btn
            v-if="$q.screen.gt.sm"
            dense
            flat
            icon="newspaper"
            text-color="positive"
            label="Novidades"
            :to="{ name: 'News' }"
          >
            <q-badge color="orange" floating>4</q-badge>
          </q-btn>
          <q-avatar
            color="mp-white-0"
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
      :persistent="false"
      class="mp-drawer"
    >
      <div
        class="q-pa-md q-gutter-sm"
        v-if="!auth.isLoggedIn"
        style="height: 100%"
      >
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
        <q-input
          v-model="formLogin.confirmPassword"
          type="password"
          label="confirme a senha"
          v-if="isRegistering"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
        </q-input>
        <div class="column q-mt-md justify-between" style="height: 70%">
          <div class="column q-gutter-y-sm">
            <q-btn
              push
              color="positive"
              label="Entrar"
              class="col"
              align="center"
              :loading="auth.loading"
              @click="login"
            />
            <q-btn
              push
              color="primary"
              icon="img:images/google.svg"
              label="Entrar com o google"
              class="col"
              :loading="auth.loading"
              :href="googleAuth"
            />
          </div>

          <div>
            <q-item clickable :to="{ name: 'News' }">
              <q-item-section avatar>
                <q-icon name="newspaper" color="positive" />
              </q-item-section>
              <q-item-section>Novidades</q-item-section>
              <q-badge floating rounded color="positive">4</q-badge>
            </q-item>
            <q-item clickable :to="{ name: 'Help' }" v-if="!auth.isLoggedIn">
              <q-item-section avatar>
                <q-icon name="live_help" color="primary" />
              </q-item-section>
              <q-item-section> Ajuda </q-item-section>
            </q-item>
            <q-item clickable @click="showAbout = true">
              <q-item-section avatar>
                <q-icon name="help" color="primary" />
              </q-item-section>
              <q-item-section> Sobre o MePaga </q-item-section>
            </q-item>
          </div>
        </div>
      </div>
      <div class="column q-pa-md q-gutter-sm" v-else style="height: 100%">
        <q-item clickable :to="{ name: 'MyInvoices' }">
          <q-item-section avatar>
            <q-icon name="credit_card" color="primary" />
          </q-item-section>
          <q-item-section> Minhas faturas </q-item-section>
        </q-item>
        <q-item clickable :to="{ name: 'Help' }">
          <q-item-section avatar>
            <q-icon name="live_help" color="primary" />
          </q-item-section>
          <q-item-section> Ajuda </q-item-section>
        </q-item>
        <q-item clickable :to="{ name: 'News' }">
          <q-item-section avatar>
            <q-icon name="newspaper" color="positive" />
          </q-item-section>
          <q-item-section>Novidades</q-item-section>
          <q-badge floating rounded color="positive">4</q-badge>
        </q-item>
        <q-item clickable @click="logout">
          <q-item-section avatar>
            <q-icon name="logout" color="primary" />
          </q-item-section>
          <q-item-section> Sair </q-item-section>
        </q-item>
        <q-space />
        <div style="opacity: 0.8">
          <q-item clickable @click="showAbout = true">
            <q-item-section avatar>
              <q-icon name="help" color="primary" />
            </q-item-section>
            <q-item-section> Sobre o MePaga </q-item-section>
          </q-item>
        </div>
      </div>
    </q-drawer>

    <q-page-container class="q-px-sm-md q-px-md-xl">
      <router-view />
      <q-dialog v-model="showAbout">
        <q-card>
          <q-card-section class="q-gutter-y-md">
            <div class="text-h6">Sobre o MePaga</div>
            <div class="text-body2">
              O MePaga foi criado para ajudar minha namorada a calcular as
              compras feitas em seu cartão por amigos e familiares. Agora foi
              disponibilizado para ajudar outras pessoas a organizar suas
              faturas.
            </div>

            <div class="row q-gutter-sm">
              <q-btn
                icon="img:images/linkedin.svg"
                label="Flávio Lopes"
                target="_blank"
                href="https://www.linkedin.com/in/flaviovlopes/"
              />
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { ref, reactive, computed } from 'vue';
import { useStore } from 'src/store';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const isRegistering = ref(false);
    const formLogin = reactive({
      email: '',
      password: '',
      confirmPassword: '',
    });
    const $q = useQuasar();
    const auth = computed(() => store.state?.authentication);
    const rightDrawerOpen = ref(
      !auth.value.isLoggedIn && $q.screen.gt.xs ? true : false
    );
    const showAbout = ref(false);

    router.beforeEach(() => {
      rightDrawerOpen.value = false;
    });

    const toggleRightDrawer = () => {
      rightDrawerOpen.value = !rightDrawerOpen.value;
    };

    const login = async () => {
      await store.dispatch('authentication/login', {
        identifier: formLogin.email,
        password: formLogin.password,
      });
      rightDrawerOpen.value = false;
      await router.push({ name: 'MyInvoices' });
    };

    const logout = async () => {
      await store.dispatch('authentication/logout');
      await router.push('/');
    };

    return {
      rightDrawerOpen,
      formLogin,
      isRegistering,
      auth,
      showAbout,
      googleAuth: process.env.GOOGLE_AUTH,
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
