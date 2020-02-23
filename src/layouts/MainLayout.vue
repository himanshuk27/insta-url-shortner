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
          v-if="$route.path != '/auth'"
        />

        <q-toolbar-title>Insta Url Shortner</q-toolbar-title>

        <q-btn
          v-if="$route.path != '/auth'"
          flat
          small
          label="Logout"
          @click="logout"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="$route.path != '/auth'"
      :width="250"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-scroll-area class="fit">
        <q-list>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>Home</q-item-section>
          </q-item>

          <q-separator />
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="show_chart" />
            </q-item-section>
            <q-item-section>Analytics</q-item-section>
          </q-item>

          <q-separator />
          <q-item clickable v-ripple @click="logout">
            <q-item-section avatar>
              <q-icon name="power_settings_new" />
            </q-item-section>
            <q-item-section>Logout</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-footer elevated>
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-overline">© 2020, himanshuk27@gmail.com</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

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
    },
    logout() {
      this.$store.commit("logUserOut");
      this.$router.push({ path: "/auth" });
    }
  }
};
</script>
