<template>
  <div>
    <div id="batch">
      <Condition ref="condition"></Condition>
      <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
    </div>
    <el-table border size="mini" style="width: 701px" :header-cell-style="tableHeader" :cell-style="cellStyle" :data="tableData">
      <el-table-column align="center" prop="schoolName" label="学校" width="120"></el-table-column>
      <el-table-column align="center" prop="grade" label="年级" width="80"></el-table-column>
      <el-table-column align="center" prop="className" label="班级" width="80"></el-table-column>
      <el-table-column align="center" prop="leaveCount" label="留言数" width="100"></el-table-column>
      <el-table-column align="center" prop="latest" label="最近留言时间" width="200"></el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="toLeaveDetail(scope.$index)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :currentPage="currentPage" :pageSize="pageSize" :currentTotal="currentTotal"></Pagination>

    <el-dialog title="留言详情" :visible.sync="editVisible" width="70%">
      <LeaveDetail :classId="classId" ref="leaveDetail"></LeaveDetail>
    </el-dialog>
  </div>
</template>

<script>
import Condition from "@/components/Condition.vue";
import Pagination from "@/components/Pagination.vue";
import LeaveDetail from "@/components/LeaveDetail.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    Condition,
    Pagination,
    LeaveDetail
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 5,
      currentTotal: 0,
      tableData: [],
      editVisible: false,
      classId: ''
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
      this.classId = this.tableData[index].classId;
      this.editVisible = true;
      this.$nextTick(() => {
        this.$refs.leaveDetail.getLeaveByClassId();
      });
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
