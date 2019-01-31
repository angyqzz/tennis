import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);

const match = {
  state: {
    matchSettings: {}
  },
  mutations: {
    SET_MATCH_SETTINGS: (state, settings) => {
      state.matchSettings = settings;
    }
  },
  actions: {
    setMatchSettings(context, settings) {
      context.commit('SET_MATCH_SETTINGS', settings);
    }
  }
}


const store = new Vuex.Store({
  modules: {
    match
  },
  strict: true,
  plugins: []
});

export default store;
