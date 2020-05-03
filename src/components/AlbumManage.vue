<template>
  <div>
    <div class="handle-box">
      <el-select clearable size="small" v-model="select" placeholder="请选择" class="handle-select mr10">
        <el-option key="1" label="按用户名" value="1"></el-option>
        <el-option key="2" label="按手机号" value="2"></el-option>
      </el-select>
      <el-input clearable size="small" v-model="input" placeholder="根据账号或者用户名查找用户" class="handle-input mr10"></el-input>
      <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
    </div>
    <Condition ref="condition"></Condition>
    <el-button type="danger" icon="el-icon-delete" size="small" @click="batchDelete">批量删除</el-button>
  </div>
</template>

<script>
import Condition from "@/components/Condition.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    Condition
  },
  data() {
    return {
      select: "",
      input: ""
    };
  },
  computed: {
    ...mapGetters(["tableHeader","cellStyle"])
  },
  methods: {
    handleSearch() {

    },
    batchDelete() {

    }
  }
};
</script>

<style lang="scss" scoped>

</style>
