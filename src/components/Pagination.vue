<template>
  <el-pagination
    background
    small
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="[5, 10, 15, 20, 40]"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="currentTotal">
  </el-pagination>
</template>

<script>
export default {
  props:["currentPage","pageSize","currentTotal"],
  data: () => {
    return {
      // currentPage: 1, //当前页数,默认第一页
      // pageSize: 5,
      // currentTotal: 0
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$parent.pageSize = val;
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.$parent.currentPage = val;
      console.log(`当前页: ${val}`);
    }
  }
}
</script>