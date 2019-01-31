<template>
  <div class="layer-content">
    <div class="display-1">Match settings</div>
    <div class="breadcrumbs">
      <router-link :to="{name : 'Tennis'}">
        <span>Home</span>
      </router-link>
      | <span>New match</span>
    </div>
    <div class="players">
      <v-flex
        xs12
        sm6
        md6
      >
        <v-text-field
          label="Player 1"
          box
          v-model="matchSettings.player1"
          hide-details
        ></v-text-field>
      </v-flex>
      <div class="versus">VS</div>
      <v-flex
        xs12
        sm6
        md6
      >
        <v-text-field
          label="Player 2"
          box
          v-model="matchSettings.player2"
          hide-details
        ></v-text-field>
      </v-flex>
    </div>
    <div class="sub-header">
      <div class="title">Sets</div>
      <div class="actions">
        <v-btn
          color="success"
          icon
          @click="increaseSetCount()"
        >
          <v-icon>add</v-icon>
        </v-btn>
        <v-btn
          color="error"
          icon
          @click="decreaseSetCount()"
        >
          <v-icon>remove</v-icon>
        </v-btn>
      </div>
    </div>
    <div
      v-for="set in matchSettings.sets"
      :key="set"
      class="list"
    >
      <div class="list-header">
        <div class="title">Set {{set}}</div>
        <div class="actions">
          <div>
            <v-chip
              :color="matchSettings.setInfo[set].type == 'set' ? 'success' : 'secondary'"
              text-color="white"
              :selected="matchSettings.setInfo[set].type == 'set'"
              @click="matchSettings.setInfo[set].type = 'set'"
            >Set</v-chip>

            <v-chip
              :color="matchSettings.setInfo[set].type == 'tie' ? 'success' : 'secondary'"
              text-color="white"
              @click="matchSettings.setInfo[set].type = 'tie'"
            >Tiebreak</v-chip>

            <v-btn
              color="error"
              icon
              @click="decreaseSetCount()"
            >
              <v-icon>remove</v-icon>
            </v-btn>
          </div>
        </div>
      </div>

      <div class="list-info">
        <div
          class="set-settings"
          v-if="matchSettings.setInfo[set].type == 'set'"
        >
          Starter
        </div>
        <div v-else>
          Tiebreak
        </div>
      </div>
    </div>

    <div class="sub-header">
      <div class="title">Deuce</div>
      <div class="actions">
        <v-chip
          text-color="white"
          @click="matchSettings.deuce = 1"
          :color="matchSettings.deuce == 1 ? 'success' : 'secondary'"
        >Advantage</v-chip>

        <v-chip
          text-color="white"
          @click="matchSettings.deuce = 0"
          :color="matchSettings.deuce == 0 ? 'success' : 'secondary'"
        >Conclusive</v-chip>
      </div>
    </div>

    <v-btn
      color="primary"
      large
      @click="startNewMatch()"
    >
      Start new match
    </v-btn>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  name: "MatchSettingsComponent",
  props: {},
  computed: {},
  methods: {
    startNewMatch() {
      this.$store.dispatch("setMatchSettings", this.matchSettings);
      this.$router.push({ name: "New Match" });
    },
    increaseSetCount() {
      if (this.matchSettings.sets == 3) {
        return;
      }
      this.matchSettings.sets += 1;

      Vue.set(this.matchSettings.setInfo, this.matchSettings.sets, {
        type: "set",
        starterGames: 0
      });
    },
    decreaseSetCount() {
      if (this.matchSettings.sets == 0) {
        return;
      }

      this.matchSettings.sets -= 1;
    }
  },
  data() {
    return {
      matchSettings: {
        player1: "",
        player2: "",
        sets: 0,
        setInfo: {},
        deuce: 1
      }
    };
  }
};
</script>

<style lang="less" scoped>
.players {
  display: flex;
  align-items: center;
  margin: 30px 0;
  .versus {
    margin: 0 20px;
  }
}
.list {
  margin-bottom: 20px;
  .list-header {
    display: flex;
    align-items: center;
    background: #666;
    padding: 5px 20px;
    color: #fff;
    .actions {
      margin-left: auto;
    }
  }
  .list-info {
    padding: 10px;
    background: #eee;
  }
}
</style>