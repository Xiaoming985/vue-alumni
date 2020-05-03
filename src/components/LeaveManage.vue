<template>
  <div>
    <div id="batch">
      <Condition ref="condition"></Condition>
      <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
    </div>
    <el-table border size="mini" style="width: 730px" :header-cell-style="tableHeader" :cell-style="cellStyle" :data="tableData">
      <el-table-column align="center" prop="schoolName" label="学校" width="120"></el-table-column>
      <el-table-column align="center" prop="grade" label="年级" width="80"></el-table-column>
      <el-table-column align="center" prop="className" label="班级" width="80"></el-table-column>
      <el-table-column align="center" prop="leaveCount" label="留言数" width="100"></el-table-column>
      <el-table-column align="center" prop="latest" label="最近留言时间" width="200"></el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="140">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="toLeaveDetail(scope.$index)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :currentPage="currentPage" :pageSize="pageSize" :currentTotal="currentTotal"></Pagination>
  </div>
</template>

<script>
import Condition from "@/components/Condition.vue";
import Pagination from "@/components/Pagination.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    Condition,
    Pagination
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      currentTotal: 0,
      tableData: []
    };
  },
  computed: {
    ...mapGetters(["tableHeader","cellStyle"])
  },
  mounted() {
    let obj = {};
    obj.schooId = this.$refs.condition.school;
    obj.grade = this.$refs.condition.grade;
    obj.classId = this.$refs.condition.cla;
    obj.start = this.currentPage - 1;
    obj.pageSize = this.pageSize;
    this.getAllLeave(obj);
  },
  methods: {
    async getAllLeave(obj) {
      let res = await this.$http.getAllLeave(obj);
      if (res.status == 200) {
        this.tableData = res.data;
        this.currentTotal = this.tableData.length;
      }
    },
    handleSearch() {
      let obj = {
        schoolId: this.$refs.condition.school,
        grade: this.$refs.condition.grade,
        classId: this.$refs.condition.cla,
        start: this.currentPage - 1,
        pageSize: this.pageSize
      };
      this.getAllLeave(obj);
    },
    toLeaveDetail(index) {
      this.$router.push(`/index/leave-detail?classId=${this.tableData[index].classId}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.handle-box {
  margin-bottom: 10px;
}
#batch {
  display: flex;
  // justify-content: space-between;
  align-items: center;
  .el-button {
    margin-left: 10px;
  }
}
</style>
