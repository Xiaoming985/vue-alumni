<template>
  <div>
    <div class="handle-box">
      <el-select clearable size="small" v-model="select" placeholder="请选择" class="handle-select mr10">
        <el-option key="1" label="按姓名" value="1"></el-option>
        <el-option key="2" label="按用户名" value="2"></el-option>
        <el-option key="3" label="按手机号" value="3"></el-option>
      </el-select>
      <el-input clearable size="small" v-model="input" placeholder="根据账号/用户名/姓名查找用户" class="handle-input mr10"></el-input>
      <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
    </div>
    <Condition ref="condition"></Condition>
    <div class="third">
      <div>
        认证状态:
        <el-radio v-model="radio" label="0" border size="small">未认证</el-radio>
        <el-radio v-model="radio" label="1" border size="small">待审核</el-radio>
        <el-radio v-model="radio" label="2" border size="small">已认证</el-radio>
      </div>
      <div class="batch">
        <el-button type="primary" icon="el-icon-microphone" size="small">广播</el-button>
        <el-button type="danger" icon="el-icon-delete" size="small" @click="batchDelete">批量删除</el-button>
      </div>
    </div>
    
    <el-table border size="mini" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" 
      style="width: 100%" :header-cell-style="tableHeader" :cell-style="cellStyle" 
      @selection-change="handleSelectionChange">
      <el-table-column align="center" fixed prop="userId" type="selection" width="55"></el-table-column>
      <el-table-column align="center" fixed prop="name" label="姓名" width="100"></el-table-column>
      <el-table-column align="center" prop="tag" label="认证状态" width="100"
        :filters="[{ text: '未认证', value: 0 }, { text: '待审核', value: 1},{text: '已认证', value: 2}]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.tag === 0" type="info">未认证</el-tag>
          <el-tag v-else-if="scope.row.tag === 1" type="warning">待审核</el-tag>
          <el-tag v-else-if="scope.row.tag === 2" type="success">已认证</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="可供证明的图片" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.academic" alt="" @click="checkImg(scope.row.academic)">
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="schoolName" label="学校" width="120"></el-table-column>
      <el-table-column align="center" sortable prop="grade" label="年级" width="80"></el-table-column>
      <el-table-column align="center" sortable prop="className" label="班级" width="80"></el-table-column>
      <el-table-column align="center" prop="userName" label="用户名" width="80"></el-table-column>
      <el-table-column align="center" prop="gender" label="性别" width="80" 
        :filters="[{ text: '男', value: '男' }, { text: '女', value: '女' }]"
        :filter-method="filterGender"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="scope.row.gender === '男' ? 'info' : 'warning'" disable-transitions>{{scope.row.gender}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="birth" label="生日" width="100"></el-table-column>
      <el-table-column align="center" prop="phone" label="手机号" width="150"></el-table-column>
      <el-table-column align="center" prop="email" label="邮箱" width="200"></el-table-column>
      <el-table-column align="center" prop="address" label="地址" width="200"></el-table-column>
      <el-table-column align="center" prop="motto" label="个性签名" width="200"></el-table-column>
      
      <el-table-column align="center" fixed="right" label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="success" size="mini" icon="el-icon-circle-check" title="审核通过" 
            @click="pass(scope.row)" :disabled="scope.row.tag===1?false:true"></el-button>
          <el-button type="warning" size="mini" icon="el-icon-circle-close" title="审核不通过" 
            @click="noPass(scope.row)" :disabled="scope.row.tag===1?false:true"></el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit" title="编辑" 
            @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" title="删除" 
            @click.native.prevent="deleteRow(scope.$index, tableData, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :currentPage="currentPage" :pageSize="pageSize" :currentTotal="currentTotal"></Pagination>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
      <el-form ref="editForm" :model="editForm" label-width="70px">
        <el-form-item label="用户名:">
          <el-input size="small" v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="学校:">
          <el-select size="small" v-model="editForm.schoolId" clearable filterable  placeholder="请选择" class="myselect" @change="selectSchool">
            <el-option v-for="item in schoolOptions" :key="item.schoolId" :label="item.schoolName" :value="item.schoolId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级:">
          <el-select size="small" v-model="editForm.grade" clearable filterable  placeholder="请选择" class="myselect" @change="selectGrade">
            <el-option v-for="(item,index) in gradeOptions" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级:">
          <el-select size="small" v-model="editForm.classId" clearable filterable  placeholder="请选择" class="myselect">
            <el-option v-for="item in claOptions" :key="item.classId" :label="item.className" :value="item.classId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="可供证明的图片材料" width="30%" :visible.sync="imgVisible">
      <img src="" alt="" ref="bigImg">
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "./Pagination";
import Condition from "./Condition"
import {condition} from '../mixin/condition'
export default {
  mixins: [condition],
  components: {
    Pagination,
    Condition
  },
  data() {
    return {
      select: '', // 选择条件进行搜索
      input: '', // 输入框的搜索条件
      radio: '', // 选择的认证状态
      tableData: [], // 表格数据源
      selectedData: [], // 批量选择框
      currentPage: 1,
      pageSize: 5,
      currentTotal: 0,
      editVisible: false,
      imgVisible: false,
      editForm: {
        userId: '',
        name: '',
        schoolId: '',
        grade: '',
        classId: ''
      },
      schoolOptions: [],
      gradeOptions: [],
      claOptions: [],
    }
  },
  computed: {
    ...mapGetters(["tableHeader","cellStyle"])
  },
  created() {
    this.getUserInfo({});
    this.getSchool().then(res => {
      this.schoolOptions = res.data;
    });
  },
  methods: {
    handleSearch() { // 搜索按钮
      let userInfo = {};
      if(this.select == 1){
        userInfo.name = this.input.trim();
      } else if(this.select == 2){
        userInfo.userName = this.input.trim();
      } else if(this.select == 3){
        userInfo.phone = this.input.trim();
      }
      userInfo.schoolId = this.$refs.condition.school; // 获取子组件的值
      userInfo.grade = this.$refs.condition.grade;
      userInfo.classId = this.$refs.condition.cla;
      userInfo.tag = this.radio;
      this.getUserInfo(userInfo);
    },
    filterGender(value, row) { // 筛选男女
      return row.gender === value;
    },
    filterTag(value, row) { // 筛选认证状态
      return row.tag === value;
    },
    // 获取所有用户
    async getUserInfo(obj) {
      // let res = await this.$http.getAllUserInfo();
      let res = await this.$http.getUserInfo(obj);
      // console.log(res);
      this.tableData = res.data;
      this.currentTotal = this.tableData.length; // 获取数据长度
    },
    // 通过审核
    async pass(row) { 
      // alert(row.userId);
      let res = await this.$http.updateUserInfo(this.$qs.stringify({
        userId: row.userId,
        tag: 2
      }));
      this.$message.success(`审核通过`);
      this.getUserInfo(this.userInfo);
    },
    // 审核不通过
    async noPass(row) { 
      let res = await this.$http.updateUserInfo(this.$qs.stringify({
        userId: row.userId,
        classId: 0,
        tag: 0
      }));
      this.$message.error(`审核不通过`);
      this.getUserInfo(this.userInfo);
    },
    // 编辑操作
    handleEdit(index, row) {
      this.idx = index; // 用于保存时,提示修改了第几行
      for(let key in this.editForm) { // 取同名属性
        this.editForm[key] = row[key];
      }
      // this.editForm = row;
      this.editVisible = true;
      if (this.editForm.classId !== '') {
        this.selectSchool();
        this.selectGrade();
      }
    },
    // 保存编辑
    async saveEdit() {
      this.editVisible = false;
      let res = await this.$http.updateUserInfo(this.$qs.stringify({
        userId: this.editForm.userId,
        name: this.editForm.name,
        classId: this.editForm.classId
      }));
      if (res.status == 200) {
        this.$message.success(`修改第 ${this.idx + 1} 行成功`);
        this.getUserInfo(this.userInfo);
      }
    },
    // 删除操作
    async deleteRow(index, rows, row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let temp = index+(this.currentPage-1)*this.pageSize;
        rows.splice(temp, 1); // 前端分页,如果后端做分页的话rows.splice(index, 1);
        let res = await this.$http.deleteUser(this.$qs.stringify({userId: row.userId}));
        this.$message.success('删除成功!');
      }).catch(() => {
        this.$message.error('已取消删除!');        
      });
    },
    selectSchool() {
      this.getGradeBySchoolId(this.editForm.schoolId).then(res => {
        this.gradeOptions = res.data;
      });
    },
    selectGrade() {
      this.getClass(this.editForm.schoolId, this.editForm.grade).then(res => {
        this.claOptions = res.data;
      });
    },
    handleSelectionChange(data) {
      this.selectedData = data;
    },
    // 批量删除
    batchDelete() {
      let arr = [];
      let that = this;
      this.$confirm('此操作将永久删除这些用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.selectedData.forEach((item,index) => {
          arr.push(item.userId);
          that.tableData.forEach(async (item2, index2) => {
            if (item2 === item) {
              that.tableData.splice(index2, 1);
            }
          })
        });
        let str = arr.join(); // 数组转化成字符串,默认以 , 隔开
        let res = await this.$http.deleteUser(this.$qs.stringify({userId: str}));
        this.$message.success('删除成功!');
      }).catch(() => {
        this.$message.error('已取消删除!');        
      });
    },
    // 看大图
    checkImg(src) {
      this.imgVisible = true;
      this.$nextTick(() => {
        this.$refs.bigImg.src = src;
      });
    }
  },
}
</script>

<style lang="scss" scoped>
* {
  text-align: left;
}

.third {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.el-dialog{
  .el-input {
    width: 205px;
  }
}

.el-table {
  img {
    width: 60px;
    &:hover {
      cursor: pointer;
    }
  }
}

.el-dialog {
  img {
    width: 400px;
    margin: 0 auto;
  }
}
</style>