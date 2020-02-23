<template>
  <q-page>
    <div class="col">
      <div class="row q-pa-sm">
        <div class="col-xs-12 col-sm-12 col-md-12">
          <q-card>
            <q-card-section>
              <q-input
                name="url"
                outlined
                label="Work in progress... (Analytics Page)"
                bottom-slots
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="row q-pa-sm justify-center">
        <div class="col-xs-8 col-sm-8 col-md-8">
          <q-card>
            <q-card-section>
              <canvas ref="myChart" width="400" height="400"></canvas>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import Chart from "chart.js";
export default {
  name: "Analytics",
  data() {
    return {
      browserData: [],
      browserAnalytics: {}
    };
  },
  methods: {
    getBrowserAnalytics() {
      this.$store
        .dispatch("postRequest", {
          url: "/shortlink/analytics"
        })
        .then(res => {
          if (res.data.analytics) {
            this.browserData = res.data.analytics;
            this.renderBrowserPieChart();
          }
        })
        .catch(error => {
          console.log("TCL: getBrowserAnalytics -> error", error);
        });
    },
    renderBrowserPieChart() {
      let datasets = [];
      let labels = [];
      this.browserData.forEach(element => {
        let labelIndex = labels.indexOf(element.browser);
        if (labelIndex < 0) {
          const newLabelIndex = labels.push(element.browser);
          labelIndex = newLabelIndex - 1;
        }
        const dataset = datasets[labelIndex];
        datasets[labelIndex] = dataset ? dataset + 1 : 1;
      });
      var ctx = this.$refs.myChart.getContext("2d");
      console.log("TCL: renderBrowserPieChart -> ctx", ctx);
      new Chart(ctx, {
        type: "pie",
        data: {
          datasets: [
            {
              data: datasets
            }
          ],
          labels
        }
      });
    }
  },
  created() {
    this.getBrowserAnalytics();
  }
};
</script>

<style lang="sass" scoped>
.url-input
  max-width: 100%
  width: 600px
</style>
