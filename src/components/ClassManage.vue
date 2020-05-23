<template>
  <div>
    <div class="box">
      <el-input clearable size="small" v-model="input" placeholder="根据班级名字查找" class="handle-input mr10"></el-input>
      <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
    </div>
    <div class="box">
      学校：
      <el-select size="small" v-model="school" clearable filterable  placeholder="请选择" class="myselect" @change="selectSchool">
        <el-option v-for="item in schoolOptions" :key="item.schoolId" :label="item.schoolName" :value="item.schoolId"></el-option>
      </el-select>
      年级：
      <el-select size="small" v-model="grade" clearable filterable  placeholder="请选择" class="myselect">
        <el-option v-for="(item,index) in gradeOptions" :key="index" :label="item" :value="item"></el-option>
      </el-select>
    </div>
    <div class="box">
      <el-button type="success" icon="el-icon-plus" size="small" @click="addClass">新增</el-button>
      <el-button type="danger" icon="el-icon-delete" size="small" @click="batchDelete">批量删除</el-button>
    </div>
    <el-table border size="mini" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" 
      style="width: 780px" :header-cell-style="tableHeader" :cell-style="cellStyle" @selection-change="handleSelectionChange">
      <el-table-column align="center" prop="classId" type="selection" width="70"></el-table-column>
      <el-table-column align="center" prop="schoolName" label="学校名称" width="205"></el-table-column>
      <el-table-column align="center" prop="grade" label="年级" width="104"></el-table-column>
      <el-table-column align="center" prop="className" label="班级名称" width="150"></el-table-column>
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
          <el-select disabled size="small" v-model="editForm.schoolId" clearable filterable  placeholder="请选择" class="myselect">
            <el-option v-for="item in schoolOptions" :key="item.schoolId" :label="item.schoolName" :value="item.schoolId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级:">
          <el-input size="small" v-model="editForm.grade"></el-input>
        </el-form-item>
        <el-form-item label="班级名称:">
          <el-input size="small" v-model="editForm.className"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新建班级" :visible.sync="addVisible" width="30%">
      <el-form ref="editForm" v-model="addForm" label-width="100px">
        <el-form-item label="学校名称:">
          <el-select size="small" v-model="addForm.schoolId" clearable filterable  placeholder="请选择" class="myselect" @change="selectSchool">
            <el-option v-for="item in schoolOptions" :key="item.schoolId" :label="item.schoolName" :value="item.schoolId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级:">
          <el-input size="small" v-model="addForm.grade"></el-input>
        </el-form-item>
        <el-form-item label="班级名称:">
          <el-input size="small" v-model="addForm.className"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveClass">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {condition} from '../mixin/condition'
export default {
  mixins: [condition],
  data() {
    return {
      input: '',
      tableData: [], // 表格数据源
      selectedData: [], // 批量选择框
      currentPage: 1,
      pageSize: 5,
      currentTotal: 0,
      school: '', // 选择的学校 即option绑定的value
      schoolOptions: [],
      grade: '', // 选择的年级
      gradeOptions: [],
      editForm: [],
      editVisible: false,
      addForm: [],
      addVisible: false
    };
  },
  computed: {
    ...mapGetters(["tableHeader","cellStyle"])
  },
  created() {
    this.getSchool().then(res => { //this.getSchool返回的是个promise对象,用then方法接受返回值
      this.schoolOptions = res.data;
    });
    this.getClass().then(res => {
      this.tableData = res.data;
    });
  },
  methods: {
    async handleSearch() {
      let obj = {};
      obj.schoolId = this.school;
      obj.grade = this.grade;
      obj.className = this.input.trim();
      let res = await this.$http.getClass(obj);
      this.tableData = res.data;
    },
    selectSchool() { //选择的学校变更时,查询包含的年级
      this.getGradeBySchoolId(this.school).then(res => {
        this.gradeOptions = res.data;
      });
    },
    handleSelectionChange(data) {
      this.selectedData = data;
    },
    addClass() {
      this.addForm = [];
      this.addVisible = true;
    },
    async saveClass() {
      this.addVisible = false;
      let res = await this.$http.addClass(this.$qs.stringify({
        schoolId: this.addForm.schoolId,
        grade: this.addForm.grade,
        className: this.addForm.className
      }));
      if (res.status == 200) {
        this.getClass().then(res => {
          this.tableData = res.data;
        });
      }
    },
    handleEdit(index, row) {
      this.idx = index; // 用于保存时,提示修改了第几行
      this.editForm = row;
      this.editVisible = true;
    },
    async saveEdit() {
      this.editVisible = false;
      let res = await this.$http.updateClass(this.$qs.stringify({
        classId: this.editForm.classId,
        className: this.editForm.className,
        grade: this.editForm.grade
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
        rows.splice(index, 1);
        let res = await this.$http.deleteClass(this.$qs.stringify({classId: row.classId}));
        this.$message.success('删除成功!');
      }).catch(() => {
        this.$message.error('已取消删除!');        
      });
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
          arr.push(item.classId);
          that.tableData.forEach(async (item2, index2) => {
            if (item2 === item) {
              that.tableData.splice(index2, 1);
            }
          })
        });
        let str = arr.join(); // 数组转化成字符串,默认以 , 隔开
        let res = await this.$http.deleteClass(this.$qs.stringify({classId: str}));
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
.box:nth-child(2) {
  display: flex;
  align-items: center;
}
.el-dialog{
  .el-input {
    width: 205px;
  }
}
</style>
