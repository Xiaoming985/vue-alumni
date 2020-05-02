<template>
  <div :class="['main-container',{'right-panel-active':shift}]">    
    <!-- 表单容器 -->
    <div class="form-container sign-up-container"> 
      <div>
        <h1>注册</h1>
        <!-- <span>或使用邮箱注册</span> -->
        <!-- <input type="text" placeholder="用户名" v-model="register.userName" @blur="checkUserName"> -->
        <!-- <input class="error" disabled="disabled" v-model="msg.userName"> -->
        <input type="text" placeholder="账号,请使用手机号进行注册" v-model="register.account" @blur="checkAccount">
        <input class="error" disabled="disabled" v-model="msg.account">
        <input type="password" placeholder="密码" v-model="register.password" @blur="checkPassword">
        <input class="error" disabled="disabled" v-model="msg.password">
        <input type="password" placeholder="确认密码" v-model="register.repassword" @keyup="checkPassword">
        <input class="error" disabled="disabled" v-model="msg.repassword">
        <button @click="onRegist">注册</button>
      </div>
    </div>
    <div class="form-container sign-in-container">
      <div>
        <h1>登录</h1>
        <!-- <span>或使用您的帐号</span> -->
        <input type="text" placeholder="账号" v-model="user.account">
        <input type="password" placeholder="密码" v-model="user.password">
        <div class="rememberMe">
          <el-checkbox v-model="remember">记住我</el-checkbox>
          <a href="#">忘记密码？</a>
        </div>
        <button @click="onLogin">登录</button>
      </div>
    </div>
    <!-- 覆盖容器 -->
    <div class="overlay-container">
      <div class="overlay">
        <div class="overlay-panel overlay-left">
          <h1>已有帐号?</h1>
          <p>让我们一起来玩耍吧</p>
          <button class="ghost" id="signIn" @click="toLogin">去登录</button>
        </div>
        <div class="overlay-panel overlay-right">
          <h1>没有帐号?</h1>
          <p>立即注册加入我们，和我们一起开始旅程吧</p>
          <button class="ghost" id="signUp" @click="toRegist">去注册</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shift: false, // 转换标志
      remember: false, // 记住我
      user: { // 登录信息
        account: '',
        password: '',
      },
      register: { // 注册信息
        account: '',
        password: '',
        repassword: ''
      },
      msg: { // 错误提示信息
        account: '',
        password: '',
        repassword: ''
      }
    }
  },
  created() {
    this.user.account = localStorage.getItem("account");
    if(localStorage.getItem("remember") != null) {
      this.remember = true;
      this.user.password = localStorage.getItem("pwd");
    }
  },
  watch: {
    
  },
  methods:{
    toLogin() {
      this.shift = false; // 转换至登录页
    },
    toRegist() {
      this.shift = true; // 转换至注册页
    },
    // 检验账号是否为空,格式是否正确,是否存在
    async checkAccount() {
      let reg_phone = /^1[3456789]\d{9}$/;
      if (this.register.account === "") {
        this.msg.account = "账号不能为空";
      }else if(!reg_phone.test(this.register.account)) {
        this.msg.account = "手机号码格式不正确";
      } else { // 不为空且格式正确时,验证账号是否存在
        let res = await this.$http.getUserByAccount({account: this.register.account});
        // console.log(res);
        if(res.status == 200) {
          this.msg.account = "账号已存在";
        } else {
          this.msg.account = "";
        }
      }
    },
    // 检验密码
    checkPassword(){
      if(this.register.password !== this.register.repassword) {
        this.msg.repassword = "密码不一致";
      } else {
        this.msg.repassword = "";
      }
      if (this.register.password === "") {
        this.msg.password = "密码不能为空";
      } else {
        this.msg.password = "";
      }
    },
    // 登录按钮,发送请求
    async onLogin() {
      if (this.user.account !== "" && this.user.password !== "") {
        let res = await this.$http.login(this.$qs.stringify(this.user));
        console.log(res); 
        if(res.status == 200) {
          localStorage.setItem("account",this.user.account); // 默认记住账号
          if(this.remember == true) { // 是否记住密码
            localStorage.setItem("pwd",this.user.password);
            localStorage.setItem("remember",true);
          } else {
            localStorage.removeItem("pwd");
            localStorage.removeItem("remember");
          }
          this.$router.push("/index"); // 登录成功,跳转至首页
        } else {
          this.$alert(res.msg, '出错啦!!!', {
            confirmButtonText: '确定',
            callback: action => {}
          });
        }
      }
    },
    // 注册事件
    async onRegist() {
      // this.checkUserName();
      this.checkAccount();
      this.checkPassword();
      if(this.msg.account !== "" || this.msg.repassword !== "") {
        this.$message.warning('请输入正确信息!');
      } else {
        let res = await this.$http.regist(this.$qs.stringify(this.register));
        if(res.status == 200) {
          // 注册成功
          this.$alert('注册成功,现在就去登录吧!', '提示:', {
            confirmButtonText: '确定',
            callback: action => {this.toLogin();}
          });
        } else {

        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
* {
  box-sizing: border-box; /* 盒子宽高包含padding和border */
  // box-sizing: content-box; /* 盒子宽高不包含padding和border */
}

h1 {
  font-weight: bold;
  margin: 0;
}

p {
  font-size: 14px;
  line-height: 20px;
  letter-spacing: .5px; // 增加或减少字符间的空白(字符间距)
  margin: 20px 0 30px;
}

span {
  font-size: 12px;
}

a {
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
}

.main-container {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, .25), 0 10px 10px rgba(0, 0, 0, .22);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  overflow: hidden;
  width: 768px;
  max-width: 100%; // 最大宽度是窗口宽度
  min-height: 480px;
}

.form-container>div {
  background: #fff;
  display: flex;
  flex-direction: column; // 设置纵轴为主轴
  padding:  0 50px;
  height: 100%;
  justify-content: center; // 主轴的对齐方式
  align-items: center; // 侧轴的对齐方式
  text-align: center;
}

.form-container input {
  background: #eee;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
  outline: none;
  font-size: 15px;
}

.sign-in-container {
  .rememberMe {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    a {
      margin: 0;
      &:hover {
        color: blue;
      }
      &:active {
        color: red;
      }
    }
  }
}

.sign-up-container input {
  margin: 0;
}

.sign-up-container .error {
  height: 20px;
  color: red;
  font-size: 15px;
  background-color: transparent;
}

button {
  border-radius: 20px;
  // border: 1px solid #ff4b2b;
  // background: #ff4b2b;
  border: 1px solid #00dbde;
  background: linear-gradient(to right, #00dbde, #fc00ff);
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase; // 控制文本的大小写,uppercase仅有大写
  transition: transform 80ms ease-in;
  cursor: pointer;
}

button:active {
  transform: scale(.95); // 缩放
}

button:focus {
  outline: none; // 点击时不显示轮廓(位于边框外围)
}

button.ghost { // 类名选择器,与元素名之间没有空格,加空格则会使得.ghost为button的后代
  background: transparent;
  border-color: #fff;
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all .6s ease-in-out;
}

.sign-in-container { // 登录表单
  left: 0;
  width: 50%;
  z-index: 2;
}

.sign-up-container { // 注册表单
  left: 0;
  width: 50%;
  z-index: 1;
  opacity: 0;
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform .6s ease-in-out;
  z-index: 100;
}

.overlay {
  // background: linear-gradient(to right, #ff4b2b, #ff416c) no-repeat 0 0 / cover; // 渐变色(从左到右)
  background: linear-gradient(to right, #00dbde, #fc00ff) no-repeat 0 0 / cover;
  color: #fff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateY(0);
  transition: transform .6s ease-in-out;
}

.overlay-panel {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 40px;
  height: 100%;
  width: 50%;
  text-align: center;
  transform: translateY(0);
  transition: transform .6s ease-in-out;
}

.overlay-right {
  right: 0;
  transform: translateY(0);
}

.overlay-left {
  transform: translateY(-20%);
}

/* Move signin to right */
.main-container.right-panel-active .sign-in-container {
  transform: translateY(100%); 
}

/* Move overlay to left */
.main-container.right-panel-active .overlay-container { // 把覆盖容器左移
  transform: translateX(-100%);
}

/* Bring signup over signin */
.main-container.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
}

/* Move overlay back to right */
.main-container.right-panel-active .overlay { // 把覆盖容器的可视部分右移(覆盖容器宽度*2=可视部分宽度)
  transform: translateX(50%); // 即把"去注册"页面更换成"去登录"页面
}

/* Bring back the text to center */
.main-container.right-panel-active .overlay-left {
  transform: translateY(0); // 覆盖原来的translateY(20%)属性,即垂直位置不变
}

/* Same effect for right */
.main-container.right-panel-active .overlay-right {
  transform: translateY(20%);
}
</style>
