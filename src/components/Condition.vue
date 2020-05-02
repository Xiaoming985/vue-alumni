<template>
  <div class="op">
    学校：
    <el-select size="small" v-model="school" clearable filterable  placeholder="请选择" class="myselect" @change="selectSchool">
      <el-option v-for="item in schoolOptions" :key="item.schoolId" :label="item.schoolName" :value="item.schoolId"></el-option>
    </el-select>
    年级：
    <el-select size="small" v-model="grade" clearable filterable  placeholder="请选择" class="myselect" @change="selectGrade">
      <el-option v-for="(item,index) in gradeOptions" :key="index" :label="item" :value="item"></el-option>
    </el-select>
    班级：
    <el-select size="small" v-model="cla" clearable filterable  placeholder="请选择" class="myselect">
      <el-option v-for="item in claOptions" :key="item.classId" :label="item.className" :value="item.classId"></el-option>
    </el-select>
  </div>
</template>

<script>
import {condition} from '../mixin/condition'
export default {
  mixins: [condition],
  data() {
    return {
      school: '', // 选择的学校 即option绑定的value
      schoolOptions: [
        // {
        //   value: '选项一',
        //   label: '广东海洋大学'
        // }
      ],
      grade: '', // 选择的年级
      gradeOptions: [],
      cla: '', // 选择的班级
      claOptions: [],
    }
  },
  created() {
    this.getSchool().then(res => { //this.getSchool返回的是个promise对象,用then方法接受返回值
      // console.log(res);
      this.schoolOptions = res.data;
    });
  },
  methods: {
    selectSchool() { //选择的学校变更时,查询包含的年级
      this.getGradeBySchoolId(this.school).then(res => {
        this.gradeOptions = res.data;
      });
    },
    selectGrade() {
      this.getClass(this.school, this.grade).then(res => {
        this.claOptions = res.data;
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.op {
  margin: 15px 0;
}
</style>