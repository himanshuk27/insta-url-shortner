<template>
  <q-dialog v-model="show">
    <q-card style="width: 300px">
      <q-card-section>
        <div v-if="type == 'done'" class="text-h6 text-green">
          <q-icon name="done" class="q-mr-sm" />Success
        </div>
        <div v-else-if="type == 'warning'" class="text-h6 text-orange">
          <q-icon name="warning" class="q-mr-sm" />
          {{ type.charAt(0).toUpperCase() + type.slice(1) }}
        </div>
        <div v-else-if="type == 'error'" class="text-h6 text-red">
          <q-icon name="error" class="q-mr-sm" />
          {{ type.charAt(0).toUpperCase() + type.slice(1) }}
        </div>
        <div v-else class="text-h6 text-red">
          <q-icon name="message" class="q-mr-sm" />Information
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">{{ message }}</q-card-section>

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat label="OK" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "AlertDialog",
  props: ["value", "message", "type"],
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  }
};
</script>
