<template>
  <div class="new-match">
    <v-toolbar
      dark
      color="primary"
    >
      <v-btn
        icon
        class="hidden-xs-only"
        router-link
        :to="{name : 'Match Settings'}"
      >
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title> New Match</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat>Pause</v-btn>
        <v-btn flat>Finish Match</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <div class="match-dashboard">
      <div class="match-controllers">
        <div class="match-state">
          <div class="state">
            <current-state-component :data="{currentServe, currentState, activeSet, sets}"></current-state-component>
          </div>
          <div
            class="time"
            v-if="matchDuration"
          >
            <div class="label">Match duration</div>
            {{matchDuration.get("hours") +":"+ matchDuration.get("minutes") + ":"+ matchDuration.get("seconds")}}
          </div>
          <div class="time">
            <div class="label">Game duration</div>12:30
          </div>
        </div>
        <game-controller
          :data="{currentServe, statistics, currentState}"
          @add-point="addPoint"
        ></game-controller>
      </div>
      <div class="match-stats">
        {{statistics}}
      </div>
    </div>
    <choose-serve
      :dialog-visible="serveDialogVisible"
      @close-dialog="selectServe"
    ></choose-serve>
  </div>
</template>

<script>
import moment from "moment";
import ChooseServe from "./NewMatch/ChooseServer";
import CurrentStateComponent from "./NewMatch/CurrentState";
import GameController from "./NewMatch/Controller";
import Vue from "vue";

let now;
let gamePoints = [0, 15, 30, 40];
export default {
  name: "NewMatchComponent",
  props: {},
  components: {
    CurrentStateComponent,
    GameController,
    ChooseServe
  },
  computed: {
    settings() {
      return this.$store.state.match.matchSettings;
    }
  },
  mounted() {
    if (!this.currentServe) {
      now = moment();
      this.openServeDialog();
      for (let key in this.settings.setInfo) {
        this.sets[key] = [0, 0];
      }
      setInterval(() => {
        this.matchDuration = moment.duration(moment().diff(now));
      }, 500);
    }
  },
  methods: {
    addPoint(player) {
      let currentPoint = this.currentState[player - 1];
      let currentPointIndex = gamePoints.indexOf(currentPoint);
      let nextPoint =
        currentPointIndex !== -1 ? gamePoints[currentPointIndex + 1] : null;

      let opponent = player == 2 ? 0 : 1;

      let finishSet = () => {
        this.activeSet += 1;
        console.log("set done!");
      };

      let finishGame = player => {
        let activeSet = this.activeSet;
        let sets = this.sets;

        Vue.set(sets[activeSet], player - 1, sets[activeSet][player - 1] + 1);
        this.currentState = [0, 0];

        let currentServe = this.currentServe;
        this.currentServe = this.currentServe == 2 ? 1 : 2;

        let max = sets[activeSet].reduce((a, b) => {
          return Math.max(a, b);
        });

        let diff = Math.abs(
          sets[activeSet][player - 1] - sets[activeSet][opponent]
        );

        let setMax = 6;

        if (max == 5 && diff == 0) {
          setMax = 7;
        }

        switch (max) {
          case 6:
            if (diff >= 2) {
              finishSet();
            }
            break;
        }

        // if (max == 6 && diff)

        // if (max == setMax) {
        //   finishSet();
        // }
      };
      let startTieBreak = () => {};

      if (currentPointIndex == -1) {
        // AD
        finishGame(player);
      } else {
        if (currentPointIndex == gamePoints.length - 1) {
          //IF 40
          if (this.currentState[opponent] == "AD") {
            // if opponent have advantage
            Vue.set(this.currentState, opponent, 40);
          } else {
            if (this.currentState[opponent] == currentPoint) {
              // if 40:40
              if (this.settings.deuce == 1) {
                // add advantage
                Vue.set(this.currentState, player - 1, "AD");
              } else {
                // finish game
                finishGame(player);
              }
            } else {
              finishGame(player);
            }
          }
        } else {
          Vue.set(this.currentState, player - 1, nextPoint);
        }
      }
    },
    selectServe(player) {
      this.currentServe = player;
      this.serveDialogVisible = false;
    },
    openServeDialog() {
      this.serveDialogVisible = true;
    }
  },
  data() {
    return {
      currentServe: null,
      matchDuration: null,
      currentState: [0, 0],
      activeSet: 1,
      sets: {},
      serveDialogVisible: false,
      statistics: {
        player1: {
          firstServe: {
            success: 0,
            total: 0
          },
          secondServe: {
            success: 0,
            total: 0
          },
          aces: 0,
          forcedErrors: 0,
          unforcedErrors: 0
        },
        player2: {
          firstServe: {
            success: 0,
            total: 0
          },
          secondServe: {
            success: 0,
            total: 0
          },
          aces: 0,
          forcedErrors: 0,
          unforcedErrors: 0
        }
      }
    };
  }
};
</script>

<style lang="less" scoped>
.new-match {
  background: #222;
}
.match-dashboard {
  height: calc(100vh - 64px);
  display: grid;
  grid-template-columns: auto 400px;
  .match-controllers {
    color: #fff;
    display: grid;
    grid-template-rows: 120px auto;
    .match-state {
      display: grid;
      grid-template-columns: auto minmax(100px, max-content) minmax(
          100px,
          max-content
        );

      .state {
        margin: 10px 20px;
        align-self: end;
      }

      .time {
        font-size: 60px;
        padding: 10px 20px;
        position: relative;
        margin-top: 20px;
        .label {
          font-size: 14px;
          position: absolute;
          opacity: 0.89;
          top: 0;
        }
      }
    }
  }
  .match-stats {
    background: #eee;
    height: calc(100vh - 64px);
    overflow: hidden;
    overflow-y: scroll;
  }
}
</style>