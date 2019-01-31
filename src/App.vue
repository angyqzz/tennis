<template>
  <div id="app">
    <v-app light>
      <v-content>
        <router-view name="content" />
      </v-content>
    </v-app>
  </div>
</template>

<script>
import MatchSettingsComponent from "./components/MatchSettings";
export default {
  name: "app",
  components: {
    MatchSettingsComponent
  },
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  }
};
</script>

<style lang="less">
#app {
  .theme--light.application {
    background: none;
    .match-list {
      .v-list__tile__content {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
  }
  .v-dialog__container.absolute {
    position: absolute;
  }
  .breadcrumbs {
    margin: 20px 0;
  }
  .layer-content {
    width: 80%;
    margin: 0 auto;
    padding-top: 20px;
  }
  // width: 80%;
  // margin: 0 auto;
  // padding-top: 20px;
  .sub-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .actions {
      margin-left: auto;
    }
  }
}
</style>
