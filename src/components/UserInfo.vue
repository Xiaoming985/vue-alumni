<template>
  <el-form :label-position="labelPosition" label-width="80px" status-icon :rules="rules">
    <el-form-item label="头像:" class="avatarBox">
      <div class="progress" v-if="showProgress">
        <el-progress type="circle" :percentage="progressPercent" :width="80"></el-progress>
      </div>
      <el-upload
        ref="upload"
        class="avatar-uploader"
        action="#"
        accept="image/png,image/jpg,image/jpeg"
        :auto-upload="true"
        :limit="1"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
        :http-request="uploadHead"
        :on-success="handleAvatarSuccess"
      >
        <!-- <img :src="userInfo.headImage" class="avatar"> -->
        <img v-if="userInfo.headImage" :src="userInfo.headImage" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
    <el-row>
      <el-col :span="8">
        <el-form-item label="用户名:">
          <el-input v-model="userInfo.userName" placeholder="用户名"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="真实姓名:">
          <el-input v-model="userInfo.name" placeholder="填写真实姓名,有利于同学认出你哦!"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="性别:">
          <el-radio-group v-model="userInfo.gender">
            <el-radio border label="男"></el-radio>
            <el-radio border label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    
    <el-row>
      <el-col :span="8">
        <el-form-item label="生日:">
          <el-date-picker
            v-model="userInfo.birth"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系电话:" prop="phone">
          <el-input
            placeholder="请输入手机号"
            prefix-icon="el-icon-phone"
            v-model="userInfo.phone"
            autocomplete="off">
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="邮箱:" prop="email">
          <el-input
            placeholder="请输入可用邮箱"
            prefix-icon="el-icon-message"
            v-model="userInfo.email"
            autocomplete="off">
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="住址:">
      <el-input
        placeholder="请输入现居地址"
        prefix-icon="el-icon-location"
        v-model="userInfo.address"
        style="width: 500px;">
      </el-input>
    </el-form-item>
    <el-form-item label="个人签名:">
      <el-input
        placeholder="秀出你的个性,你就是这条gai最靓的仔!"
        prefix-icon="el-icon-edit"
        maxlength="50"
        show-word-limit
        v-model="userInfo.motto"
        style="width: 800px;">
      </el-input>
    </el-form-item>

  <el-row>
      <el-col :span="7">
        <el-form-item label="我的学校:">
          <el-select v-model="school" clearable filterable  placeholder="请选择" class="myselect" @change="selectSchool" :disabled="disabled">
            <el-option v-for="item in schoolOptions" :key="item.schoolId" :label="item.schoolName" :value="item.schoolId"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="我的年级:">
          <el-select v-model="grade" clearable filterable  placeholder="请选择" class="myselect" @change="selectGrade" :disabled="disabled">
            <el-option v-for="(item,index) in gradeOptions" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="我的班级:">
          <el-select v-model="cla" clearable filterable  placeholder="请选择" class="myselect" :disabled="disabled">
            <el-option v-for="item in claOptions" :key="item.classId" :label="item.className" :value="item.classId"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <el-tag v-if="tag==0" type="info">未认证</el-tag>
        <el-tag v-else-if="tag==1" type="danger">审核中</el-tag>
        <el-tag v-else-if="tag==2" type="success">已认证</el-tag>
        <i class="el-icon-refresh refresh" v-if="show" @click="refresh"></i>
        <i class="el-icon-loading refresh" v-else></i>
      </el-col>
    </el-row>

    <el-form-item>
      <el-button type="primary" @click="updateInfo">提交</el-button>
      <span class="tips">注:学校&班级选定后无法修改,请谨慎做出选择!</span>
    </el-form-item>
  
  </el-form>
</template>

<script>
import {condition} from '../mixin/condition'

export default {
  mixins: [condition],
  data() {
    // 验证手机号
    var validatePhone = (rule, value, callback) => {
      let reg_phone = /^1[3456789]\d{9}$/;
      if(!reg_phone.test(this.phone)) {
        callback(new Error("手机号码格式不正确"));
      } else {
        callback();
      }
    };
    // 验证邮箱
    var validateEmail = (rule, value, callback) => {
      let reg_email = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if(!reg_email.test(this.email)) {
        callback(new Error("邮箱格式不正确"));
      } else {
        callback();
      }
    };
    return {
      labelPosition: 'right', // label对齐方式left/right/top
      showProgress: false,
      progressPercent: 0,
      userInfo: { // 用户信息
        userName: '',
        name: '',
        gender: '',
        birth: '',
        phone: '',
        email: '',
        address: '',
        motto: '',
        headImage: '', // 头像
      },
      rules: {
        phone: [{ validator: validatePhone, trigger: 'blur' }],
        email: [{ validator: validateEmail, trigger: 'blur' }],
      },
      school: '', // 选择的学校 即option绑定的value
      schoolOptions: [],
      grade: '', // 选择的年级
      gradeOptions: [],
      cla: '', // 选择的班级
      claOptions: [],
      disabled: false,
      tag: '',
      show: true,
    };
  },
  created() {
    this.getSchool().then(res => {
      this.schoolOptions = res.data;
    });
    this.getUserInfo();
  },
  methods: {
    // 上传图片前的过滤
    beforeAvatarUpload(file) {
      const isJPEG = file.type === 'image/jpeg';
      const isJPG = file.type === 'image/jpg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isJPEG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG/JPEG/PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return (isJPG||isJPEG||isPNG) && isLt2M;
    },
    async uploadHead(f) {
      this.showProgress = true;
      // console.log(f);
      let fd = new FormData();//通过form数据格式来传
      fd.append("file", f.file); //传文件
      // console.log(fd.get('file'));
      let res = await this.$http.uploadHead(fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: progressEvent => {
          // progressEvent.loaded:已上传文件大小
          // progressEvent.total:被上传文件的总大小
          this.progressPercent = (progressEvent.loaded / progressEvent.total * 100)
        }
      });
      console.log(res);
      if(this.progressPercent == 100) {
        this.showProgress = false;
        this.progressPercent = 0;
        this.getUserInfo();
      }
    },
    handleAvatarSuccess(res, file) {
      this.$refs.upload.clearFiles(); // 清空文件列表
      this.userInfo.headImage = URL.createObjectURL(file.raw);
    },
    selectSchool(e) {
      console.log(e);
      this.getGradeBySchoolId(this.school).then(res => {
        this.gradeOptions = res.data;
      });
    },
    selectGrade() {
      this.getClass(this.school, this.grade).then(res => {
        this.claOptions = res.data;
      });
    },
    refresh() {
      this.show = false;
      this.getUserInfo();
      setTimeout(()=>{
        this.show = true;
      },1000)
    },
    // 获取用户信息
    async getUserInfo() {
      let res = await this.$http.getMyInfo();
      // console.log(res);
      if(res.status == 200) {
        for(let key in this.userInfo) { // 取同名属性
          this.userInfo[key] = res.data.userInfo[key];
        }
        this.$store.commit("init", this.userInfo);
        this.tag = res.data.userInfo.tag;
        // this.userInfo = {...res.data.userInfo};
        if(res.data.userInfo.classId == null || res.data.userInfo.classId == '' || res.data.userInfo.classId == 0) {
          
        } else {
          this.school = res.data.userInfo.schoolId;
          this.selectSchool();
          this.grade = res.data.userInfo.grade;
          this.selectGrade();
          this.cla = res.data.userInfo.classId;
          this.disabled = true;
        }
      }
    },
    // 修改我的信息
    async updateInfo() {
      if(this.tag == 0 && this.cla !== '') { // 未认证,且选择的班级不为空时,提交认证
        this.userInfo.classId = this.cla;
        this.userInfo.tag = 1;
        console.log(this.userInfo);
      } else {
        
      }
      let res = await this.$http.updateUserInfo(this.$qs.stringify(this.userInfo));
      if(res.status == 200){
        this.$alert("提交成功", '提示:', {confirmButtonText: '确定'});
        this.getUserInfo();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  font-weight: bold;
  text-align: left;
  // margin: 20px 100px;
  .avatarBox {
    display: flex;
    align-items: center;
  }
  .el-input {
    width: 250px;
  }
  .el-radio:hover {
    border-color: #409EFF;
  }
}

.progress {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  // display: inline-block;
}

.avatar-uploader {
  display: inline-block;
  border: 1px dashed #d9d9d9;
  // border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 98px;
  height: 98px;
  background-color: #fff;
}
.avatar-uploader:hover {
  border-color: #409EFF;
  .avatar-uploader-icon {
    color: #409EFF;
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 98px;
  height: 98px;
  line-height: 98px;
  text-align: center;
}
.avatar {
  width: 98px;
  // height: 98px;
  display: block;
  background-position: center;
  // background-size: cover;
}
.tips {
  color: red;
  display: inline-block;
  margin-left: 30px;
}
.refresh {
  cursor: pointer;
  margin-left: 10px;
  font-weight: bolder;
  &:hover {
    color: red;
  }
}
</style>