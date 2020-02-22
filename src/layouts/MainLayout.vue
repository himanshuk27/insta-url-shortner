<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          round
          dense
          icon="menu"
          class="q-mr-sm"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>Insta Url Shortner</q-toolbar-title>

        <q-btn flat round dense icon="whatshot" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">Essential Links</q-item-label>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view @alert="showAlertDialog" />
    </q-page-container>
    <!-- Alert dialog component -->
    <alert-dialog
      v-model="alertDialogVisible"
      :value="Boolean"
      :type="alertDialogType"
      :message="alertDialogMessage"
    />
  </q-layout>
</template>

<script>
import AlertDialog from "../components/AlertDialog";

export default {
  name: "MainLayout",
  components: {
    AlertDialog
  },
  data() {
    return {
      alertDialogMessage: null,
      alertDialogType: null,
      alertDialogVisible: false,
      leftDrawerOpen: true
    };
  },
  methods: {
    showAlertDialog(data) {
      this.alertDialogMessage = data.message;
      this.alertDialogType = data.type;
      this.alertDialogVisible = true;
    }
  }
};
</script>
