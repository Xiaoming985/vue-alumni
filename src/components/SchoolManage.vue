<template>
  <div>
    <div class="box">
      <el-input clearable size="small" v-model="input" placeholder="根据学校名字查找" class="handle-input mr10"></el-input>
      <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
    </div>
    <div class="box">
      <el-button type="success" icon="el-icon-plus" size="small" @click="addSchool">新增</el-button>
      <el-button type="danger" icon="el-icon-delete" size="small" @click="batchDelete">批量删除</el-button>
    </div>
    <el-table border size="mini" :data="tableData" style="width: 630px" 
      :header-cell-style="tableHeader" :cell-style="cellStyle" @selection-change="handleSelectionChange">
      <el-table-column align="center" prop="schoolId" type="selection" width="70"></el-table-column>
      <el-table-column align="center" prop="schoolName" label="学校名称" width="205"></el-table-column>
      <el-table-column align="center" prop="schoolYear" label="建校年份" width="105"></el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" title="编辑" 
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" title="删除" 
            @click.native.prevent="deleteRow(scope.$index, tableData, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
      <el-form ref="editForm" v-model="editForm" label-width="100px">
        <el-form-item label="学校名称:">
          <el-input size="small" v-model="editForm.schoolName"></el-input>
        </el-form-item>
        <el-form-item label="建校年份:">
          <el-input size="small" v-model="editForm.schoolYear"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新增学校" :visible.sync="addVisible" width="30%">
      <el-form ref="addForm" v-model="addForm" label-width="100px">
        <el-form-item label="学校名称:">
          <el-input size="small" v-model="addForm.schoolName"></el-input>
        </el-form-item>
        <el-form-item label="建校年份:">
          <el-input size="small" v-model="addForm.schoolYear"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSchool">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      input: '',
      tableData: [], // 表格数据源
      selectedData: [], // 批量选择框
      editVisible: false,
      editForm: [],
      addForm: [],
      addVisible: false
    };
  },
  computed: {
    ...mapGetters(["tableHeader","cellStyle"])
  },
  created() {
    this.getSchool();
  },
  methods: {
    async getSchool() {
      let res = await this.$http.getSchool();
      if(res.status == 200) {
        this.tableData = res.data;
      }
    },
    async handleSearch() {
      let res = await this.$http.getSchool({schoolName: this.input.trim()});
      if(res.status == 200) {
        this.tableData = res.data;
      }
    },
    handleSelectionChange(data) {
      this.selectedData = data;
    },
    addSchool() {
      this.addForm = [];
      this.addVisible = true;
    },
    async saveSchool() {
      this.addVisible = false;
      let res = await this.$http.addSchool(this.$qs.stringify({
        schoolName: this.addForm.schoolName,
        schoolYear: this.addForm.schoolYear
      }));
      if (res.status == 200) {
        this.getSchool();
      }
    },
    handleEdit(index, row) {
      this.idx = index; // 用于保存时,提示修改了第几行
      // for(let key in this.editForm) { // 取同名属性
      //   this.editForm[key] = row[key];
      // }
      this.editForm = row;
      this.editVisible = true;
    },
    async saveEdit() {
      this.editVisible = false;
      let res = await this.$http.updateSchool(this.$qs.stringify({
        schoolId: this.editForm.schoolId,
        schoolName: this.editForm.schoolName,
        schoolYear: this.editForm.schoolYear
      }));
      if (res.status == 200) {
        this.$message.success(`修改第 ${this.idx + 1} 行成功`);
      }
    },
    deleteRow(index, rows, row) {
      this.$confirm('此操作不可逆, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let temp = index+(this.currentPage-1)*this.pageSize;
        rows.splice(temp, 1); // 前端假分页,如果后端做分页的话rows.splice(index, 1);
        let res = await this.$http.deleteSchool(this.$qs.stringify({schoolId: row.schoolId}));
        this.$message.success('删除成功!');
      }).catch(() => {
        this.$message.error('已取消删除!');      
      });
    },
    // 批量删除
    batchDelete() {
      let arr = [];
      let that = this;
      this.$confirm('此操作不可逆, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.selectedData.forEach((item,index) => {
          arr.push(item.schoolId);
          that.tableData.forEach(async (item2, index2) => {
            if (item2 === item) {
              that.tableData.splice(index2, 1);
            }
          })
        });
        let str = arr.join(); // 数组转化成字符串,默认以 , 隔开
        let res = await this.$http.deleteSchool(this.$qs.stringify({schoolId: str}));
        this.$message.success('删除成功!');
      }).catch(() => {
        this.$message.error('已取消删除!');        
      });
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  text-align: left;
}
.box {
  margin-bottom: 15px;
  display: flex;
}
</style>
