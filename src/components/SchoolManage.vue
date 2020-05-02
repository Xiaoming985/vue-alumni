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
      this.editForm = [];
      this.editVisible = true;
    },
    batchDelete() {

    },
    handleEdit(index, row) {
      this.idx = index; // 用于保存时,提示修改了第几行
      // for(let key in this.editForm) { // 取同名属性
      //   this.editForm[key] = row[key];
      // }
      this.editForm = row;
      this.editVisible = true;
    },
    saveEdit() {
      
    },
    deleteRow(index, rows, row) {

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
