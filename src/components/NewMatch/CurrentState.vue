<template>
  <div>
    <div>Deuce #2</div>
    <table>
      <tbody>
        <template v-for="player in 2">
          <tr :key="player">
            <td>
              {{settings['player' + player]}}
              <v-icon
                small
                v-if="server == player"
                color="blue lighten-5"
              >trip_origin</v-icon>
            </td>
            <template v-for="set in activeSet">
              <td
                :key="set"
                v-if="sets[set]"
              >{{sets[set][player - 1]}}</td>
            </template>
            <td>{{currentState[player - 1]}}</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "CurrentStateComponent",
  props: ["data"],
  computed: {
    server() {
      return this.data.currentServe;
    },
    activeSet() {
      return this.data.activeSet;
    },
    currentState() {
      return this.data.currentState;
    },
    sets() {
      return this.data.sets;
    },
    settings() {
      return this.$store.state.match.matchSettings;
    }
  },
  methods: {},
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
table {
  border-spacing: 0;
  border-collapse: collapse;
  width: 100%;
  tr {
    td {
      padding: 10px;
      background: #1976d2;
      color: #fff;
      i {
        float: right;
        margin-top: 2px;
      }
      &:last-child {
        background: #fff;
        color: #222;
      }
      &:not(:first-child) {
        width: 40px;
        text-align: center;
      }
    }
  }
}
</style>