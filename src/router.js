import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import MatchSettingsComponent from "./components/MatchSettings";
import TennisIntroComponent from "./components/TennisIntro";
import NewMatchComponent from "./components/NewMatch";

const routes = [{
  path: '/',
  redirect: '/tennis'
}, {
  path: '/tennis',
  name: 'Tennis',
  components: {
    content: TennisIntroComponent
  }
}, {
  path: '/match-settings',
  name: 'Match Settings',
  components: {
    content: MatchSettingsComponent
  }
}, {
  path: '/new-game',
  name: 'New Match',
  components: {
    content: NewMatchComponent
  },
  beforeEnter(to, from, next) {
    next();
  }
}];


export default new Router({
  routes
});
