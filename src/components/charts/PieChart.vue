<script>
import { Pie } from "vue-chartjs";
export default {
  name: "PieChart",
  extends: Pie,
  props: ["chartdata", "options"],
  mounted() {
    this.renderChart(this.chartdata);
  }
};
</script>
