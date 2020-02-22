<template>
  <q-page class="flex flex-center">
    <!-- Login Card -->
    <q-card class="auth-card">
      <q-card-section>
        <div class="row text-h6 justify-center">
          Welcome to Insta Url Shortner
        </div>
      </q-card-section>
      <!-- Login card tab -->
      <q-tabs v-model="tab" class="text-teal">
        <q-tab label="Login" name="login" />
        <q-tab label="Signup" name="signup" />
      </q-tabs>

      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <!-- Login tab content -->
        <q-tab-panel name="login">
          <ValidationObserver v-slot="{ handleSubmit }">
            <!-- email input -->
            <ValidationProvider
              name="email"
              rules="required|email"
              v-slot="{ errors }"
            >
              <div class="row justify-center q-mt-lg">
                <q-input
                  bottom-slots
                  name="email"
                  v-model="email"
                  class="text-input"
                  outlined
                  label="Email"
                >
                  <template v-slot:prepend>
                    <q-icon name="email" />
                  </template>
                  <template v-slot:hint>
                    <p class="text-red">{{ errors[0] }}</p>
                  </template>
                </q-input>
              </div>
            </ValidationProvider>
            <!-- password input -->
            <ValidationProvider
              name="password"
              rules="required"
              v-slot="{ errors }"
            >
              <div class="row justify-center q-mb-lg">
                <q-input
                  bottom-slots
                  name="password"
                  v-model="password"
                  class="text-input"
                  outlined
                  label="Password"
                  :type="isPwd ? 'password' : 'text'"
                  @click="handleSubmit(loginRequest)"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                  <template v-slot:hint>
                    <p class="text-red">{{ errors[0] }}</p>
                  </template>
                </q-input>
              </div>
            </ValidationProvider>
            <!-- login button -->
            <div class="row justify-center">
              <q-btn
                :loading="queryLoading"
                outline
                color="purple"
                label="Authenticate"
                @click="handleSubmit(loginRequest)"
              />
            </div>
          </ValidationObserver>
        </q-tab-panel>
        <!-- signup tab -->
        <q-tab-panel name="signup">
          <ValidationObserver v-slot="{ handleSubmit }">
            <!-- email input -->
            <ValidationProvider
              name="email"
              rules="required|email"
              v-slot="{ errors }"
            >
              <div class="row justify-center q-mt-lg">
                <q-input
                  bottom-slots
                  name="email"
                  v-model="email"
                  class="text-input"
                  outlined
                  label="Email"
                >
                  <template v-slot:prepend>
                    <q-icon name="email" />
                  </template>
                  <template v-slot:hint>
                    <p class="text-red">{{ errors[0] }}</p>
                  </template>
                </q-input>
              </div>
            </ValidationProvider>
            <!-- password 1 input -->
            <ValidationProvider
              name="password-1"
              rules="required"
              v-slot="{ errors }"
            >
              <div class="row justify-center">
                <q-input
                  bottom-slots
                  name="password-1"
                  v-model="password1"
                  class="text-input"
                  outlined
                  label="Password"
                  :type="isPwd ? 'password' : 'text'"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                  <template v-slot:hint>
                    <p class="text-red">{{ errors[0] }}</p>
                  </template>
                </q-input>
              </div>
            </ValidationProvider>
            <ValidationProvider
              name="password-2"
              rules="required"
              v-slot="{ errors }"
            >
              <div class="row justify-center">
                <!-- password 2 input -->
                <q-input
                  bottom-slots
                  name="password-2"
                  v-model="password2"
                  class="text-input"
                  outlined
                  label="Repeat Password"
                  :type="isPwd ? 'password' : 'text'"
                  @click="handleSubmit(signupRequest)"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                  <template v-slot:hint>
                    <p class="text-red">{{ errors[0] }}</p>
                  </template>
                </q-input>
              </div>
            </ValidationProvider>
            <!-- signup button -->
            <div class="row justify-center">
              <q-btn
                :loading="queryLoading"
                outline
                color="purple"
                label="Register"
                @click="handleSubmit(signupRequest)"
              />
            </div>
          </ValidationObserver>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import { ValidationProvider } from "vee-validate";
import { ValidationObserver } from "vee-validate";
import { extend } from "vee-validate";
import { required, email } from "vee-validate/dist/rules";

export default {
  name: "Auth",
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data() {
    return {
      tab: "login",
      isPwd: true,
      password: null,
      password1: null,
      password2: null,
      email: null,
      queryLoading: false
    };
  },
  methods: {
    authQuery(signup = false) {
      const url = signup ? "auth/signup" : "auth";
      this.queryLoading = true;

      // api post request
      this.$api
        .post(url, {
          email: this.email,
          password: this.password
        })
        .then(response => {
          this.queryLoading = false;
          this.showAlertDialog(
            response.data.message,
            response.data.error ? "error" : "done"
          );
        })
        .catch(error => {
          this.queryLoading = false;
          this.showAlertDialog(error, "error");
        });
    },
    // toggle alert dialog
    showAlertDialog(message, type = null) {
      this.$emit("alert", { message, type });
    },
    loginRequest() {
      this.authQuery();
    },
    signupRequest() {
      this.authQuery(true);
    }
  },
  created() {
    // import form validation rules
    extend("required", {
      ...required,
      message: "This field is required"
    });
    extend("email", email);
  }
};
</script>

<style lang="sass" scoped>
.auth-card
  width: 80%
  max-width: 600px

.text-input
  width: 100%
  max-width: 400px
</style>
