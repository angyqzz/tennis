<template>
  <v-dialog
    class="absolute"
    v-model="isVisible"
    persistent
    width="500"
  >
    <v-card>
      <v-card-title
        class="headline grey lighten-2"
        primary-title
      >
        Select point type
      </v-card-title>

      <v-card-text>

      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          flat
          @click="$emit('close-dialog')"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "PointType",
  props: ["dialog-visible"],
  computed: {
    settings() {
      return this.$store.state.match.matchSettings;
    },
    isVisible: {
      get() {
        return this.dialogVisible;
      },
      set() {
        this.$emit("close-dialog");
      }
    }
  },
  methods: {},
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
</style>