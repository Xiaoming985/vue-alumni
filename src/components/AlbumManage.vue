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
    <div style="margin-bottom: 10px;">
      相册类型:
      <el-radio v-model="radio" label="0" border size="small">个人相册</el-radio>
      <el-radio v-model="radio" label="1" border size="small">班级相册</el-radio>
      <el-button type="danger" icon="el-icon-delete" size="small" @click="batchDelete">批量删除</el-button>
    </div>
    
    <el-table border size="mini" style="width: 1186px" :header-cell-style="tableHeader" :cell-style="cellStyle" :data="tableData" 
      @selection-change="handleSelectionChange">
      <el-table-column align="center" prop="albumId" type="selection" width="55"></el-table-column>
      <el-table-column align="center" prop="userName" label="用户名" width="100"></el-table-column>
      <el-table-column align="center" prop="schoolName" label="学校" width="120"></el-table-column>
      <el-table-column align="center" prop="grade" label="年级" width="80"></el-table-column>
      <el-table-column align="center" prop="className" label="班级" width="80"></el-table-column>
      <el-table-column align="center" label="相册类型" width="80">
        <template slot-scope="scope">
          {{ tableData[scope.$index].classId?"班级相册":"个人相册" }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="albumName" label="相册名称" width="100"></el-table-column>
      <el-table-column align="center" prop="albumDesc" label="相册描述" width="200"></el-table-column>
      <el-table-column align="center" label="相册封面" width="120">
        <template slot-scope="scope">
          <img :src="tableData[scope.$index].albumCover" alt="">
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="primary" size="small">查看详情</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small"
            @click="deleteAlbum(scope.$index, tableData, scope.row)">删除</el-button>
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
      radio: "",
      currentPage: 1,
      pageSize: 5,
      currentTotal: 0,
      tableData: [],
      selectedData: []
    };
  },
  computed: {
    ...mapGetters(["tableHeader","cellStyle"])
  },
  watch: {
    currentPage:function() {
      this.getAlbum();
    },
    pageSize:function() {
      this.getAlbum();
    }
  },
  mounted() {
    this.getAlbum();
  },
  methods: {
    async getAlbum() {
      let res;
      let obj = {
        userName: this.select == 1?this.input:"",
        phone: this.select == 2?this.input:"",
        schoolId: this.$refs.condition.school,
        grade: this.$refs.condition.grade,
        classId: this.$refs.condition.cla,
        start: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      };
      if (this.radio === "0") {
        res = await this.$http.getUserAlbum(obj);
      } else if (this.radio === "1") {
        res = await this.$http.getClassAlbum(obj);
      } else {
        res = await this.$http.getAlbum(obj);
      }
      if (res.status == 200) {
        this.tableData = res.data.albums;
        this.currentTotal = res.data.albumCount;
      }
    },
    handleSearch() {
      this.getAlbum();
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
          arr.push(item.albumId);
          that.tableData.forEach(async (item2, index2) => {
            if (item2 === item) {
              that.tableData.splice(index2, 1);
            }
          })
        });
        let str = arr.join(); // 数组转化成字符串,默认以 , 隔开
        let res = await this.$http.deleteAlbum(this.$qs.stringify({albumId: str}));
        this.$message.success('删除成功!');
      }).catch(() => {
        this.$message.error('已取消删除!');        
      });
    },
    deleteAlbum(index, rows, row) {
      this.$confirm('此操作不可逆, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        rows.splice(index, 1);
        this.currentTotal--;
        let res = await this.$http.deleteAlbum(this.$qs.stringify({albumId: row.albumId}));
        this.$message.success('删除成功!');
      }).catch(() => {
        this.$message.error('已取消删除!');        
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-table {
  img {
    width: 80px;
  }
}
</style>
