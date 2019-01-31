<template>
  <div class="intro">
    <div class="intro-wrapper">
      <div class="display-1">Tennis stats</div>
      <div class="subheading">v1.0.0</div>
      <div class="actions">
        <v-btn
          flat
          outline
          color="primary"
          router-link
          :to="{name : 'Match Settings'}"
        >New Match</v-btn>

        <v-btn
          flat
          outline
          color="primary"
        >Upload stats data</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TennisIntroComponent",
  props: {},
  computed: {},
  methods: {},
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
.intro {
  height: 100vh;
  background: url("./../assets/bg.jpg") no-repeat;
  background-size: cover;
  display: grid;
  grid-template-columns: 200px 400px auto;
  grid-template-rows: 25% auto 25%;
  .intro-wrapper {
    width: 400px;
    background: rgba(0, 0, 0, 0.7);
    grid-column-start: 2;
    grid-row-start: 2;
    color: #fff;
    padding: 20px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    .actions {
      display: flex;
      flex-direction: column;
      margin-top: auto;
    }
  }
}
</style>