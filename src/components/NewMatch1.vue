<template>
  <div class="match-grid">
    <div class="match">
      <div>
        <table>
          <tbody>
            <template v-for="player in 2">
              <tr :key="player">
                <td>{{settings['player' + player]}} <v-icon
                    small
                    v-if="currentServe == 'player' + player"
                    color="primary"
                  >lens</v-icon>
                </td>
                <template v-for="set in currentMatch.activeSet">
                  <td
                    :key="set"
                    v-if="currentMatch.sets[set]"
                  >{{currentMatch.sets[set][player - 1]}}</td>
                </template>
                <td>{{currentState[player - 1]}}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div>
        <div
          v-if="!currentServe"
          class="serve-choose"
        >
          <h2>Choose player to serve</h2>
          <div class="button-actions">
            <template v-for="player in 2">
              <v-btn
                :key="player"
                color="primary"
                outline
                large
                @click="currentServe = 'player' + player"
              >
                {{settings['player' + player]}}
              </v-btn>
            </template>
          </div>
        </div>
        <div
          v-else
          class="game-counters"
        >
          <template v-for="player in 2">
            <div
              :key="player"
              class="player-panel"
            >
              <h4>{{settings['player' + player]}}</h4>
              {{serveToggler}}
              <v-btn-toggle
                v-model="serveToggler"
                v-if="currentServe == 'player' + player"
              >
                <v-btn
                  flat
                  @click="serve(player, 1)"
                >
                  <v-icon> filter_1</v-icon>
                </v-btn>
                <v-btn
                  flat
                  @click="serve(player, 2)"
                >
                  <v-icon> filter_2</v-icon>
                </v-btn>
                <v-btn
                  flat
                  @click="serve(player, 3)"
                >
                  <v-icon color="error">close</v-icon>
                </v-btn>
                <v-btn
                  flat
                  @click="serve(player, 4)"
                >
                  <v-icon>star</v-icon>
                </v-btn>
              </v-btn-toggle>
              <v-btn
                :key="player"
                block
                class="counter"
                color="primary"
                @click="addPoint(player)"
              >
                {{currentState[player - 1]}}
              </v-btn>
            </div>
            <!-- <v-btn
              :key="player"
              @click="addPoint(player)"
            >
              {{currentState[player - 1]}}
            </v-btn> -->
          </template>
        </div>
      </div>
    </div>
    <div class="match-stats">
      <v-card
        class="mb-4"
        v-for="player in 2"
        :key="player"
      >
        <v-card-title>
          <h4>{{settings['player' + player]}}</h4>
        </v-card-title>
        <v-list
          one-line
          class="match-list"
        >
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>First serve: </v-list-tile-title>
              <v-list-tile-content class="align-end">{{statistics['player' + player].firstServe.success + '/' + statistics['player' + player].firstServe.total}}</v-list-tile-content>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>First serve %: </v-list-tile-title>
              <v-list-tile-content class="align-end">{{calculatePercentage(player, 'firstServe')}}%</v-list-tile-content>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>Second serve: </v-list-tile-title>
              <v-list-tile-content class="align-end">{{statistics['player' + player].secondServe.success + '/' + statistics['player' + player].secondServe.total}}</v-list-tile-content>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>Second serve %: </v-list-tile-title>
              <v-list-tile-content class="align-end">{{calculatePercentage(player, 'secondServe')}}%</v-list-tile-content>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>Double faults: </v-list-tile-title>
              <v-list-tile-content class="align-end">{{statistics['player' + player].secondServe.total - statistics['player' + player].secondServe.success}}</v-list-tile-content>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>Aces: </v-list-tile-title>
              <v-list-tile-content class="align-end">{{statistics['player' + player].aces}}</v-list-tile-content>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider />
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>Forced errors: </v-list-tile-title>
              <v-list-tile-content class="align-end">{{statistics['player' + player].forcedErrors}}</v-list-tile-content>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>Unforced errors: </v-list-tile-title>
              <v-list-tile-content class="align-end">{{statistics['player' + player].unforcedErrors}}</v-list-tile-content>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </div>
  </div>
</template>

<script>
let gamePoints = [0, 15, 30, 40];
import moment from "moment";
import Vue from "vue";
export default {
  name: "NewMatchComponent",
  props: {},
  computed: {
    settings() {
      return this.$store.state.match.matchSettings;
    }
  },
  mounted() {
    let now = moment();

    this.currentMatch.startTime = now;

    for (let key in this.settings.setInfo) {
      Vue.set(this.currentMatch.sets, key, [0, 0]);
    }
  },
  methods: {
    calculatePercentage(player, type) {
      if (this.statistics["player" + player][type].total == 0) {
        return 0;
      }

      return (
        (this.statistics["player" + player][type].success * 100) /
        this.statistics["player" + player][type].total
      ).toFixed(2);
    },
    serve(player, type) {
      let opponent = player == 2 ? 1 : 2;
      switch (type) {
        case 1:
          this.statistics["player" + player].firstServe.success += 1;
          this.statistics["player" + player].firstServe.total += 1;
          break;
        case 2:
          this.statistics["player" + player].firstServe.success -= 1;
          this.statistics["player" + player].secondServe.success += 1;
          this.statistics["player" + player].secondServe.total += 1;
          break;
        case 3:
          this.statistics["player" + player].secondServe.success -= 1;
          this.addPoint(opponent);
          break;
        case 4:
          this.statistics["player" + player].aces += 1;
          this.addPoint(player);
          break;
      }
    },
    addPoint(player) {
      let currentPoint = this.currentState[player - 1];
      let currentPointIndex = gamePoints.indexOf(currentPoint);
      let nextPoint =
        currentPointIndex !== -1 ? gamePoints[currentPointIndex + 1] : null;

      Vue.set(this, "serveToggler", null);

      console.log(this.serveToggler);
      let opponent = player == 2 ? 0 : 1;

      let finishSet = () => {
        this.currentMatch.activeSet += 1;
        console.log("set done!");
      };
      let finishGame = player => {
        let activeSet = this.currentMatch.activeSet;
        let sets = this.currentMatch.sets;
        Vue.set(sets[activeSet], player - 1, sets[activeSet][player - 1] + 1);
        this.currentState = [0, 0];

        let currentServer = this.currentServe.split("player");
        this.currentServe = "player" + (currentServer[1] == "2" ? 1 : 2);

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
      // if (nextPoint == gamePoints.length - 1) {
      //   if (this.currentState[otherPerson - 1] !== currentPoint) {
      //     //   if (this.currentState[otherPerson - 1] == 'AD') {
      //     //        Vue.set(this.currentState, otherPerson - 1, 40);
      //     //   }
      //     Vue.set(
      //       this.currentMatch.sets[this.currentMatch.activeSet],
      //       player - 1,
      //       this.currentMatch.sets[this.currentMatch.activeSet][player - 1] + 1
      //     );
      //     this.currentState = [0, 0];
      //   } else {
      //     if (this.settings.deuce == 1) {
      //       Vue.set(this.currentState, player - 1, "AD");
      //     }
      //   }
      //   console.log(player);
      //   return;
      // }
      // Vue.set(this.currentState, player - 1, gamePoints[nextPoint + 1]);
      // console.log(this.currentState);
    }
  },
  data() {
    return {
      currentMatch: {
        currentServe: "",
        activeSet: 1,
        sets: {}
      },
      currentServe: "",
      serveToggler: null,
      activeSet: 1,
      currentState: [0, 0],
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
// .match-grid {
//   display: grid;
//   grid-template-columns: auto 400px;
//   height: 100vh;
//   padding: 20px;
//   background: #222222;
//   .match-stats {
//     height: 100vh;
//     overflow: hidden;
//     overflow-y: scroll;
//   }
//   .match {
//     display: grid;
//     grid-template-rows: 300px auto;
//     .serve-choose {
//       height: 100%;
//       padding: 10px;
//       background: #222;
//       font-size: 20px;
//       color: #eee;
//       display: flex;
//       flex-direction: column;
//       justify-content: center;
//       align-items: center;
//       h2 {
//         margin-bottom: 20px;
//       }
//       .button-actions {
//         align-self: center;
//         justify-self: center;
//         display: flex;
//         flex-direction: column;
//       }
//     }
//     .game-counters {
//       height: 100%;
//       padding: 10px;
//       background: #222;
//       color: #eee;
//       display: grid;
//       grid-template-columns: 50% 50%;
//       .player-panel {
//         padding: 20px;
//         h4 {
//           font-size: 20px;
//           margin-bottom: 20px;
//         }
//         .counter {
//           font-size: 80px;
//           height: 300px;
//         }
//       }
//     }
//     table {
//       border-spacing: 0;
//       border-collapse: collapse;
//       tr {
//         td {
//           padding: 10px;
//           border: 1px solid #222;
//           background: #222;
//           color: #fff;
//           text-transform: uppercase;
//           i {
//             margin-left: 10px;
//           }
//           &:last-child {
//             background: #fff;
//             color: #222;
//           }
//         }
//       }
//     }
//   }
// }
</style>