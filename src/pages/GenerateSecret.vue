<template>
  <div class="q-pt-md-xl q-pt-xs-sm q-px-md-md q-px-xs-sm mp-ubuntu">
    <div class="row-sm column-xs q-gutter-x-sm q-gutter-y-md col">
      <div
        class="q-pa-sm bg-mp-white-0 rounded-borders col q-gutter-y-sm shadow-1"
      >
        <div
          class="text-xs-subtitle1 text-weight-regular text-mp-blue-1"
          :class="
            $q.screen.gt.xs ? 'text-h6' : 'text-subtitle1 text-weight-medium'
          "
        >
          O MePaga se preocupa com sua privacidade
        </div>
        <div
          class="text-mp-lightblue-0 q-pr-xl"
          :class="$q.screen.gt.xs ? 'text-body' : 'text-caption'"
        >
          Antes de começar a organizar suas faturas, <br />
          é necessário que você salve sua chave de segurança.
          <br />
          <br />

          Nós não temos acesso à descrição de suas compras, e essa chave é usada
          para criptografá-las.<br />
          Não se preocupe. Isso só é necessário uma vez. Apenas mantenha sua
          chave salva no email ou outro local seguro. <br />
          <br />
          <ins>Essa não é sua senha de acesso.</ins> Ela será usada para exibir
          detalhes sensíveis de suas faturas. <br /><br />
          Para facilitar, ela ficará salva neste navegador até você sair do
          MePaga.
        </div>
        <div :class="{ 'q-mt-xl': $q.screen.gt.sm }">
          <q-form @submit.prevent="handleSumbit">
            <div class="column q-gutter-y-sm">
              <input
                type="text"
                name="chave_mepaga"
                value="chave_mepaga"
                hidden
                style="display: none"
              />
              <q-input
                v-model="secretData.secret"
                filled
                :type="isPwd ? 'password' : 'text'"
                bg-color="positive"
                name="secret"
                disable
              >
                <template v-slot:prepend>
                  <q-icon name="vpn_key" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
              <q-input
                filled
                type="text"
                name="user"
                dense
                disable
                bg-color="positive"
                label-color="primary"
                :label="secretData.email"
              >
                <template v-slot:prepend>
                  <q-icon name="mail" />
                </template>
              </q-input>
              <q-btn
                type="submit"
                label="Enviar pro meu email e acessar o MePaga"
                color="primary"
                class="col"
                :disable="!check"
              />
              <q-checkbox
                label="Confirmo a geração de minha chave de segurança"
                v-model="check"
              />
            </div>
          </q-form>
        </div>
      </div>
      <q-img src="images/security-key.svg" class="security-img" />
    </div>
  </div>
</template>
<script lang="ts">
import { useQuasar } from 'quasar';
import { AuthService } from 'src/services/auth/AuthService';
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const authService = new AuthService();

export default defineComponent({
  name: 'GenerateSecret',
  setup() {
    const secretData = ref({
      secret: '',
      email: '',
    });
    const $q = useQuasar();
    const router = useRouter();

    const handleSumbit = async () => {
      try {
        await authService.confirmSecretGeneration(secretData.value.secret);
        authService.setSecretCookie(secretData.value.secret);
        await router.push('/');
      } catch (error) {
        $q.notify({
          type: 'error',
          message:
            'Ocorreu um erro ao confirmar sua chave. Tente novamente atualizando a página.',
        });
      }
    };
    onMounted(async () => {
      $q.loading.show({
        spinnerColor: 'positive',
      });
      secretData.value = await authService.generateSecret();
      $q.loading.hide();
    });
    return {
      email: 'user@mail.com',
      check: ref(false),
      save: ref(true),
      secretData,
      isPwd: ref(true),
      router,
      handleSumbit,
    };
  },
});
</script>
<style lang="scss" scoped>
.security-img {
  max-width: 40%;

  @media (max-width: $breakpoint-xs-max) {
    max-width: 80%;
    align-self: center;
  }
}
</style>
