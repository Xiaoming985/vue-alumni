<template>
  <div>
    <div class="log-title">{{ log.logTitle}}</div>
    <div class="log-content" ref="logContent"></div>
  </div>
</template>

<script>
export default {
  props: ["logId"],
  data() {
    return {
      log: {}
    };
  },
  methods: {
    async getLog() {
      let res = await this.$http.getLog({
        logId: this.logId,
        start: 0,
        pageSize: 1
      });
      if (res.status == 200) {
        this.log = res.data.logs[0];
        this.$refs.logContent.innerHTML = this.log.logContent;
        console.log(this.log);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.log-title {
  font-weight: bold;
  font-size: 18px;
  padding-bottom: 5px;
}
</style>
