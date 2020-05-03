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

    <el-table border size="mini" style="width: 1080px" :header-cell-style="tableHeader" :cell-style="cellStyle" :data="tableData" 
      @selection-change="handleSelectionChange">
      <el-table-column align="center" prop="logId" type="selection" width="55"></el-table-column>
      <el-table-column align="center" prop="userName" label="用户名" width="100"></el-table-column>
      <el-table-column align="center" prop="schoolName" label="学校" width="120"></el-table-column>
      <el-table-column align="center" prop="grade" label="年级" width="80"></el-table-column>
      <el-table-column align="center" prop="className" label="班级" width="80"></el-table-column>
      <el-table-column align="center" prop="logTitle" label="日志标题" width="200"></el-table-column>
      <el-table-column align="center" prop="logTime" label="发布时间" width="200"></el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="primary" size="small">查看详情</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteLog(scope.$index, tableData, scope.row)">删除</el-button>
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
      select: "",
      input: "",
      tableData: [],
      selectedData: [],
      currentPage: 1,
      pageSize: 5,
      currentTotal: 0
    };
  },
  computed: {
    ...mapGetters(["tableHeader","cellStyle"])
  },
  created() {
    this.getLog({});
  },
  methods: {
    async getLog(obj) {
      let res = await this.$http.getLog({
        schoolId: obj.schoolId,
        grade: obj.grade,
        classId: obj.classId,
        userName: obj.userName,
        phone: obj.account,
        start: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      });
      if (res.status == 200) {
        this.tableData = res.data.logs;
        this.currentTotal = res.data.logCount; 
      }
    },
    handleSearch() {
      let obj = {};
      obj.schoolId = this.$refs.condition.shool;
      obj.grade = this.$refs.condition.grade;
      obj.classId = this.$refs.condition.cla;
      if (this.select == 1) {
        obj.userName = this.input.trim();
      } else if (this.select == 2) {
        obj.account = this.input.trim();
      }
      this.currentPage = 1;
      this.getLog(obj);
    },
    handleSelectionChange(data) {
      this.selectedData = data;
    },
    batchDelete() {
      let arr = [];
      let that = this;
      this.$confirm('此操作不可逆, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.selectedData.forEach((item,index) => {
          arr.push(item.logId);
          that.tableData.forEach(async (item2, index2) => {
            if (item2 === item) {
              that.tableData.splice(index2, 1);
            }
          })
        });
        let str = arr.join(); // 数组转化成字符串,默认以 , 隔开
        let res = await this.$http.deleteLog(this.$qs.stringify({logId: str}));
        this.$message.success('删除成功!');
      }).catch(() => {
        this.$message.error('已取消删除!');
      });
    },
    async deleteLog(index, rows, row) {
      this.$confirm('此操作不可逆, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        rows.splice(index, 1);
        this.currentTotal--;
        let res = await this.$http.deleteLog(this.$qs.stringify({
          logId: row.logId
        }));
        this.$message.success('删除成功!');
      }).catch(() => {
        this.$message.error('已取消删除!');        
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
