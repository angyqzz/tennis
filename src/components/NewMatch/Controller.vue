<template>
  <div class="game-controllers">
    <div class="serve-controllers">
      <template v-for="player in 2">
        <div
          :key="player"
          class="serve"
        >
          <div class="title mb-3">{{settings['player' + player]}}</div>

          <div
            class="serve-actions"
            :class="{'hidden' : server !== player}"
          >
            <div
              v-ripple
              v-for="n in serveTypes"
              :key="n.type"
              :class="n.class"
              :disabled="n.disabled"
              :selected="currentServe == n.type"
              @click="serve(player, n.type)"
            >
              <v-icon>{{n.icon}}</v-icon>
              <span class="label">{{n.label}}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="point-controllers">
      <template v-for="player in 2">
        <div
          v-ripple
          :key="player"
          class="point"
          @click="openPointTypeSelector()"
        >
          {{currentState[player - 1]}}
        </div>
      </template>
    </div>
    <point-type
      :dialog-visible="pointTypeDialog"
      @close-dialog="addTypeToPoint"
      v-if="pointTypeDialog"
    ></point-type>
  </div>
</template>

<script>
import PointType from "./PointTypeDialog";
export default {
  name: "GameController",
  props: ["data"],
  components: {
    PointType
  },
  computed: {
    server() {
      return this.data.currentServe;
    },
    currentState() {
      return this.data.currentState;
    },
    statistics() {
      return this.data.statistics;
    },
    settings() {
      return this.$store.state.match.matchSettings;
    }
  },
  methods: {
    openPointTypeSelector() {
      this.pointTypeDialog = true;
    },
    addTypeToPoint(type) {
      this.pointTypeDialog = false;
    },
    addPoint(player) {
      this.currentServe = null;
      this.serveTypes.forEach((el, i) => {
        if (i == 0) {
          el.disabled = false;
        } else {
          el.disabled = true;
        }
      });
      this.$emit("add-point", player);
    },
    serve(player, type) {
      if (this.serveTypes[type - 1].disabled) {
        return false;
      }
      let opponent = player == 2 ? 1 : 2;
      this.currentServe = type;
      switch (type) {
        case 1:
          this.statistics["player" + player].firstServe.success += 1;
          this.statistics["player" + player].firstServe.total += 1;
          this.serveTypes[0].disabled = true;
          this.serveTypes[1].disabled = false;
          this.serveTypes[3].disabled = false;
          break;
        case 2:
          this.statistics["player" + player].firstServe.success -= 1;
          this.statistics["player" + player].secondServe.success += 1;
          this.statistics["player" + player].secondServe.total += 1;
          this.serveTypes[1].disabled = true;
          this.serveTypes[2].disabled = false;
          this.serveTypes[3].disabled = false;
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
    }
  },
  data() {
    return {
      pointTypeDialog: false,
      currentServe: null,
      serveTypes: [
        {
          type: 1,
          icon: "filter_1",
          label: "First serve",
          class: "basic",
          disabled: false
        },
        {
          type: 2,
          icon: "filter_2",
          label: "Second serve",
          class: "basic",
          disabled: true
        },
        {
          type: 3,
          icon: "close",
          label: "Double fault",
          class: "fault",
          disabled: true
        },
        {
          type: 4,
          icon: "star",
          label: "Ace",
          class: "ace",
          disabled: true
        }
      ]
    };
  }
};
</script>

<style lang="less" scoped>
.game-controllers {
  display: grid;
  grid-template-rows: 150px auto;
  .serve-controllers {
    display: grid;
    grid-template-columns: repeat(auto-fill, 50%);
    .serve {
      margin: 0 20px;
      align-self: end;
      .serve-actions {
        height: 80px;
        display: grid;
        grid-template-columns: repeat(auto-fill, 25%);
        &.hidden {
          opacity: 0;
          visibility: hidden;
        }
        & > div {
          i {
            color: #fff;
            margin: 6px 0;
          }
          cursor: pointer;
          color: #fff;
          margin: 5px;
          border: 2px solid #1976d2;
          border-radius: 4px;
          background: fade(#1976d2, 20%);
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          &.fault {
            border: 2px solid #f44336;
            background: fade(#f44336, 20%);
          }
          &.ace {
            border: 2px solid #43a047;
            background: fade(#43a047, 20%);
          }
          &[disabled="disabled"] {
            cursor: not-allowed;
            border: 2px solid #bdbdbd;
            background: fade(#fafafa, 20%);
          }
          &[selected="selected"] {
            box-shadow: inset 10px 10px 37px 0px rgba(0, 0, 0, 0.75);
          }
          .label {
            font-size: 12px;
          }
        }
      }
    }
  }
  .point-controllers {
    display: grid;
    grid-template-columns: repeat(auto-fill, 50%);
    .point {
      margin: 20px;
      border: 2px solid #1976d2;
      border-radius: 4px;
      background: fade(#1976d2, 20%);
      font-size: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
}
</style>