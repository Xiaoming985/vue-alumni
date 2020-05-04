<template>
  <div>
    <el-input clearable size="small" v-model="inputKey" placeholder="根据内容查询" class="handle-input mr10"></el-input>
    <div class="handle-box">
      <el-select clearable size="small" v-model="select" placeholder="请选择" class="handle-select mr10">
        <el-option key="1" label="按用户名" value="1"></el-option>
        <el-option key="2" label="按手机号" value="2"></el-option>
      </el-select>
      <el-input clearable size="small" v-model="input" placeholder="根据账号或者用户名查找用户" class="handle-input mr10"></el-input>
      <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button size="small" type="danger" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
    </div>
    <el-table border size="mini" style="width: 955px" :header-cell-style="tableHeader" :cell-style="cellStyle" :data="tableData" 
      @selection-change="handleSelectionChange">
      <el-table-column align="center" prop="msgId" type="selection" width="55"></el-table-column>
      <el-table-column align="center" prop="userName" label="用户名" width="100"></el-table-column>
      <!-- <el-table-column align="center" prop="schoolName" label="学校" width="120"></el-table-column>
      <el-table-column align="center" prop="grade" label="年级" width="80"></el-table-column>
      <el-table-column align="center" prop="className" label="班级" width="80"></el-table-column> -->
      <el-table-column align="center" prop="content" label="留言内容" width="250"></el-table-column>
      <el-table-column align="center" label="图片" width="250">
        <template slot-scope="scope">
          <img :src="item" alt="" v-for="(item, index) in tableData[scope.$index].images" :key="index">
        </template>
      </el-table-column>
      <el-table-column align="center" prop="msgTime" label="留言时间" width="200"></el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteLeave(scope.$index, tableData, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :currentPage="currentPage" :pageSize="pageSize" :currentTotal="currentTotal"></Pagination>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "@/components/Pagination.vue";
export default {
  components: {
    Pagination
  },
  props: ["classId"],
  data() {
    return {
      inputKey: "",
      select: "",
      input: "",
      currentPage: 1,
      pageSize: 5,
      currentTotal: 0,
      tableData: [],
      selectedData: []
    }
  },
  computed: {
    ...mapGetters(["tableHeader","cellStyle"])
  },
  watch: {
    currentPage:function() {
      this.getLeaveByClassId();
    },
    pageSize:function() {
      this.getLeaveByClassId();
    }
  },
  methods: {
    async getLeaveByClassId() {
      let res = await this.$http.getLeaveByClassId({
        classId: this.classId,
        start: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      });
      if (res.status == 200) {
        this.tableData = res.data;
        this.tableData.forEach(item => {
          if (item.images) {
            item.images = item.images.trim().split(" ");
          }
        })
        this.currentTotal = res.data[0].leaveCount;
      }
    },
    handleSearch() {

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
          arr.push(item.msgId);
          that.tableData.forEach(async (item2, index2) => {
            if (item2 === item) {
              that.tableData.splice(index2, 1);
            }
          })
        });
        let str = arr.join(); // 数组转化成字符串,默认以 , 隔开
        let res = await this.$http.deleteLeave(this.$qs.stringify({msgId: str}));
        this.$message.success('删除成功!');
      }).catch(() => {
        this.$message.error('已取消删除!');        
      });
    },
    deleteLeave(index, rows, row) {
      this.$confirm('此操作不可逆, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        rows.splice(index, 1);
        this.currentTotal--;
        let res = await this.$http.deleteLeave(this.$qs.stringify({msgId: row.msgId}));
        this.$message.success('删除成功!');
      }).catch(() => {
        this.$message.error('已取消删除!');        
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.handle-box {
  padding: 10px 0;
}
.el-table {
  img {
    width: 60px;
    margin-left: 5px;
  }
}
</style>
