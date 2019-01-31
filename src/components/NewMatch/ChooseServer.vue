<template>
  <v-dialog
    v-model="isVisible"
    persistent
    width="500"
  >
    <v-card>
      <v-card-title
        class="headline grey lighten-2"
        primary-title
      >
        Choose player to serve
      </v-card-title>

      <v-card-text>
        <v-radio-group v-model="serverPlayer">
          <v-radio
            v-for="n in 2"
            :key="n"
            :label="settings['player' + n]"
            :value="n"
            @change="selectPlayer"
          ></v-radio>
        </v-radio-group>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          flat
          @click="$emit('close-dialog', serverPlayer)"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ChooseServe",
  props: ["dialog-visible"],
  computed: {
    settings() {
      return this.$store.state.match.matchSettings;
    },
    isVisible: {
      get() {
        console.log(this.dialogVisible);
        return this.dialogVisible;
      },
      set() {
        this.$emit("close-dialog");
      }
    }
  },
  methods: {
    selectPlayer(player) {
      console.log(player);
    }
  },
  data() {
    return {
      serverPlayer: null
    };
  }
};
</script>

<style lang="less" scoped>
</style>