import { AuthResponseDTO } from 'src/services/auth/dto/AuthDTO';
import { MutationTree } from 'vuex';
import { AuthStateInterface } from './state';

const mutation: MutationTree<AuthStateInterface> = {
  setLoggedIn(state: AuthStateInterface, payload: AuthResponseDTO) {
    state.loading = false;
    state.isLoggedIn = true;
    state.user = {
      email: payload.user.email,
      username: payload.user.username,
      displayName: payload.user.displayName,
      hasGeneratedSecret: payload.user.hasGeneratedSecret,
    };
    state.token = {
      access_token: payload.jwt,
    };
  },
  setLoggedOut(state: AuthStateInterface) {
    state.isLoggedIn = false;
    state.user = null;
  },
  setLoading(state: AuthStateInterface, loading: boolean) {
    state.loading = loading;
  },
};

export default mutation;
