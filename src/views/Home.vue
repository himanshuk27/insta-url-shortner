<template>
  <q-page>
    <div class="col">
      <div class="row q-pa-sm">
        <div class="col-xs-12 col-sm-12 col-md-12">
          <!-- Link generator card -->
          <q-card>
            <q-card-section>
              <ValidationObserver v-slot="{ handleSubmit }">
                <div class="row justify-around q-mb-md">
                  <div class="url-input">
                    <ValidationProvider
                      name="url"
                      rules="required|isURL"
                      v-slot="{ errors }"
                    >
                      <!-- Url input -->
                      <q-input
                        name="url"
                        v-model="userInputUrl"
                        outlined
                        label="Url"
                        bottom-slots
                        v-on:keyup.enter="
                          handleSubmit(generateShortLinkRequest)
                        "
                      >
                        <template v-slot:append>
                          <q-icon name="http" />
                        </template>
                        <template v-slot:hint>
                          <p class="text-red">{{ errors[0] }}</p>
                        </template>
                      </q-input>
                    </ValidationProvider>
                  </div>
                  <div class="row q-pa-sm">
                    <ValidationProvider name="setCustomLink" rules="required">
                      <q-toggle
                        name="setCustomLink"
                        v-model="setCustomLink"
                        label="Set Custom Shortlink"
                        icon="edit"
                      />
                    </ValidationProvider>
                    <ValidationProvider name="setExpiry" rules="required">
                      <q-toggle
                        name="setExpiry"
                        icon="alarm"
                        v-model="setExpiry"
                        label="Set Expiry"
                      />
                    </ValidationProvider>
                  </div>
                  <div class="column justify-center">
                    <!-- short link generate button -->
                    <q-btn
                      outline
                      color="orange"
                      label="Generate Link"
                      :loading="queryLoading"
                      @click="handleSubmit(generateShortLinkRequest)"
                    >
                      <template v-slot:loading>
                        <q-spinner-gears class="on-left" />working...
                      </template>
                    </q-btn>
                  </div>
                </div>

                <div class="row justify-around">
                  <q-slide-transition>
                    <div class="row" v-show="setCustomLink">
                      <div class="text-subtitle1 q-pa-md">
                        http://insta.himanshu.cc/
                      </div>
                      <ValidationProvider
                        name="customShortLink"
                        rules="required_if:setCustomLink|length:6|customLinkAvailable"
                        v-slot="{ errors }"
                      >
                        <q-input
                          name="customShortLink"
                          v-model="customShortLink"
                          filled
                          label=" Custom shortlink"
                          bottom-slots
                          @input="customLinkAvailable = null"
                        >
                          <template v-slot:append>
                            <q-spinner-ios
                              v-if="customLinkLoading"
                              color="purple"
                            />
                          </template>
                          <template v-slot:hint>
                            <p class="text-red">
                              {{ errors[0] }}
                              {{
                                customLinkAvailable == false
                                  ? "Not available"
                                  : ""
                              }}
                            </p>
                          </template>
                        </q-input>
                      </ValidationProvider>
                      <div
                        v-if="
                          customShortLink &&
                            customShortLink.length == 6 &&
                            !customLinkAvailable
                        "
                        class="cursor-pointer text-subtitle2 text-grey-10 q-pa-md"
                        style="text-decoration: underline;"
                        @click="checkCustomLinkRequest"
                      >
                        Check availability
                      </div>
                      <div v-if="customLinkAvailable" class="q-pa-md">
                        <q-icon
                          name="done"
                          class="text-green"
                          style="font-size: 2em;"
                        />
                      </div>
                    </div>
                  </q-slide-transition>
                  <q-slide-transition>
                    <div class="row" v-show="setExpiry">
                      <div class="text-subtitle1 q-pa-md q-mr-sm">
                        Expiration Details:
                      </div>
                      <div class="row">
                        <ValidationProvider
                          name="expiryDate"
                          rules="required_if:setExpiry"
                          v-slot="{ errors }"
                        >
                          <q-input
                            v-model="expiryDate"
                            name="expiryDate"
                            placeholder="22 Feb 2020"
                            label="Date"
                            bottom-slots
                            readonly
                            @input="showDateEdit = true"
                          >
                            <template v-slot:hint>
                              <p class="text-red">{{ errors[0] }}</p>
                            </template>
                          </q-input>
                        </ValidationProvider>
                        <q-popup-proxy
                          v-model="showDateEdit"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="expiryDate"
                            minimal
                            @input="showDateEdit = false"
                            mask="DD-MMM-YYYY"
                            :options="dateValidation"
                          />
                        </q-popup-proxy>
                      </div>
                      <div class="q-mr-md" />
                      <div class="row">
                        <ValidationProvider name="expiryTime" rules="required">
                          <q-input
                            name="expiryTime"
                            v-model="expiryTime"
                            label="Time"
                            readonly
                            @input="showTimeEdit = true"
                          />
                        </ValidationProvider>
                        <q-popup-proxy
                          v-model="showTimeEdit"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-time
                            v-model="expiryTime"
                            @input="showTimeEdit = false"
                            :options="timeValidation"
                          />
                        </q-popup-proxy>
                      </div>
                    </div>
                  </q-slide-transition>
                </div>
                <q-separator class="q-my-lg" />
                <!-- Generated link details -->
                <div class="row" v-if="isLinkGenerated">
                  <p class="text-subtitle1">
                    Short Link: {{ generatedShortLink }}
                  </p>
                </div>
                <div class="row" v-if="isLinkGenerated">
                  <p class="text-subtitle1">Link: {{ userInputUrl }}</p>
                </div>
              </ValidationObserver>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="row q-pa-sm">
        <div class="col-xs-12 col-sm-12 col-md-12">
          <!-- link analytics table -->
          <q-table
            title="Link Analytics"
            :data="generatedShortLinks"
            :columns="columns"
            row-key="_id"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import {
  ValidationObserver,
  extend
} from "vee-validate/dist/vee-validate.full.esm";
import { ValidationProvider } from "vee-validate/dist/vee-validate.full.esm";
import moment from "moment";
import isURL from "validator/lib/isURL";

export default {
  name: "Home",
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data() {
    return {
      isLinkGenerated: false,
      userInputUrl: "",
      generatedShortLink: "",
      generatedShortLinks: [],
      expiryTime: "00:00",
      expiryDate: "",
      customShortLink: "",
      setCustomLink: false,
      setExpiry: false,
      showDateEdit: false,
      showTimeEdit: false,
      customLinkAvailable: null,
      customLinkLoading: false,
      queryLoading: false,
      axiosHeaders: {},
      columns: [
        {
          name: "url",
          label: "Http Url Address",
          align: "left",
          field: row => row.url,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "shortlink",
          label: "Short Link",
          align: "left",
          field: row => row.shortLink,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "expiryAt",
          label: "Expiry Date",
          align: "left",
          field: row =>
            row.expireAt
              ? moment(row.expireAt).format("DD-MMM-YYYY HH:mm")
              : "-",
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "userId",
          label: "User Id",
          align: "left",
          field: row => row.userId,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "createdAt",
          label: "Date Created",
          align: "left",
          field: row => moment(row.createdAt).format("DD-MMM-YYYY HH:mm"),
          format: val => `${val}`,
          sortable: true
        }
      ]
    };
  },
  methods: {
    async generateShortLinkRequest() {
      const expirationDate = this.setExpiry
        ? `${this.expiryDate} ${this.expiryTime}`
        : null;
      this.queryLoading = true;
      // api post request
      this.$api
        .post(
          "/shortlink/create",
          {
            url: this.userInputUrl,
            expirationDate,
            customShortLink: this.customShortLink,
            userId: "user1323"
          },
          { headers: this.axiosHeaders }
        )
        .then(response => {
          this.queryLoading = false;
          this.showAlertDialog(
            response.data.message,
            response.data.error ? "warning" : "done"
          );
          this.isLinkGenerated = true;
          this.generatedShortLink = response.data.shortLink.shortLink;
          this.fetchShortLinks();
        })
        .catch(error => {
          this.queryLoading = false;
          this.showAlertDialog(error, "error");
        });
    },
    async fetchShortLinks() {
      // fetch user url links history
      this.$api
        .post("/user/shortlinks", {
          userId: "asfd"
        })
        .then(response => {
          this.generatedShortLinks = response.data.shortlinks;
        })
        .catch(error => {
          this.showAlertDialog(error, "error");
        });
    },
    async checkCustomLinkRequest() {
      return new Promise((resolve, reject) => {
        this.customLinkLoading = true;
        this.$api
          .post("/shortlink/check-availability", {
            customShortLink: this.customShortLink,
            userId: "asfd"
          })
          .then(response => {
            this.customLinkLoading = false;
            this.customLinkAvailable = !response.data.match;
            resolve(!response.data.match);
          })
          .catch(error => {
            this.customLinkLoadin = false;
            this.showAlertDialog(error, "error");
            reject(error);
          });
      });
    },
    // toggle alert dialog
    showAlertDialog(message, type = null) {
      this.$emit("alert", { message, type });
    },
    // expiry date validation
    dateValidation(date) {
      // check if date before today
      return moment(date).isSameOrAfter(moment(), "day");
    },
    // expiry time validation
    timeValidation(hr, min) {
      const isInputDateToday = moment(this.expiryDate, "DD-MMM-YYYY").isSame(
        moment(),
        "day"
      );
      // if input date is today, time should be greater than current time
      if (isInputDateToday) {
        return moment(`${hr}:${min}`, "HH:mm ").isAfter(moment(), "minute");
      }
      return true;
    },
    setAxiosHeaders() {
      const token = this.$cookies.get("icUserToken");
      this.axiosHeaders = { Authorization: token };
      this.$api.defaults.headers.common["Authorization"] = token;
    },
    extendCustomRules() {
      extend("customLinkAvailable", () => {
        if (!this.setCustomLink) {
          return true;
        }
        if (this.customLinkAvailable == null) {
          return "Check availability";
        }
        if (!this.customLinkAvailable) {
          return "";
        }
        return true;
      });
      extend("isURL", value => {
        if (isURL(value)) {
          return true;
        }
        return "Enter valid url";
      });
    }
  },
  created() {
    // check if user is logged in
    const isUserLoggedIn = this.$cookies.get("icUserToken");
    if (!isUserLoggedIn || isUserLoggedIn == "") {
      window.location.replace("/#/auth");
    }

    // populate link analytics table
    this.fetchShortLinks();
    this.extendCustomRules();
    this.setAxiosHeaders();
  }
};
</script>

<style lang="sass" scoped>
.url-input
  max-width: 100%
  width: 600px
</style>
