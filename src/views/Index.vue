<template>
    <el-container>
      <el-header>
        <div class="system-logo">
          <img src="../assets/images/logo.png" alt="" class="logo">
          <span>校友录</span>
        </div>
        <el-avatar :size="30" :src="headImage" shape="square"></el-avatar>
        <span>{{userName}}</span>
        <i class="el-icon-monitor"></i>
        <i class="el-icon-news"></i>
        <i class="el-icon-share"></i>
        <i class="el-icon-question"></i>
        <i class="el-icon-switch-button" @click="quit"></i>
      </el-header>
      <el-container>
        <el-aside width="230px">
          <SideMenu2 :menus="menus"></SideMenu2>
        </el-aside>
        <el-main>
          <Tabs></Tabs>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
import { mapGetters } from "vuex";
import SideMenu2 from '../components/SideMenu2'
import Tabs from '../components/Tabs'
export default {
  components: {
    SideMenu2,
    Tabs
  },
  data() {
    return {
      menus: [
        {
          title: '我的信息',
          name: 'userInfo',
          path: '/index/user-info',
          icon: 'el-icon-user'
        },
        {
          title: '学校管理',
          name: 'schoolManage',
          path: '/index/school-manage',
          icon: 'el-icon-school'
        },
        {
          title: '班级管理',
          name: 'classManage',
          path: '/index/class-manage',
          icon: 'el-icon-data-board'
        },
        {
          title: '用户管理',
          name: 'userManage',
          path: '/index/user-manage',
          icon: 'el-icon-s-custom'
        },
        {
          title: '留言管理',
          name: 'leaveManage',
          path: '/index/leave-manage',
          icon: 'el-icon-chat-dot-round'
        },
        {
          title: '日志管理',
          name: 'logManage',
          path: '/index/log-manage',
          icon: 'el-icon-notebook-1'
        },
        {
          title: '相册管理',
          name: 'albumManage',
          path: '/index/album-manage',
          icon: 'el-icon-picture-outline'
        },
      ]
    }
  },
  computed: {
    ...mapGetters(["headImage","userName"])
  },
  created() {
    
  },
  methods: {
    async quit() {
      this.$confirm('客官请留步!', '提示', {
        confirmButtonText: '去意已决',
        cancelButtonText: '留下来再喝一杯',
        type: 'warning'
      }).then(async () => {
        await this.$http.logout();
        this.$message.success('退出成功!');
      }).catch(() => {
        this.$message.error('已取消退出!');        
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  height: 100vh;
}

.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #fff;
  box-shadow: 0px 0px 5px 5px rgba(0,0,0,.3);
  text-align: center;
  line-height: 60px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .el-avatar {
    // vertical-align: middle;
    margin-right: 5px;
    background-color: #fff;
  }
  i {
    font-size: 25px;
    // vertical-align: middle;
    margin-left: 15px;
  } 
  .system-logo{
    display: inline-block;
    position: absolute;
    left: 50px;
    .logo {
      width: 60px;
      height: 60px;
      vertical-align: middle;
    }
    span {
      color: white;
      font-weight: bold;
      font-size: 20px;
    }
  }
  i:hover {
    cursor: pointer;
  }
}

.el-aside {
  background-color: #D3DCE6;
  // color: #333;
  text-align: center;
  box-shadow: 0px 10px 5px 5px rgba(0,0,0,.3);

  // .el-menu li:not(:last-child) {
  //   // border-bottom: 1px solid grey;
  // }
}

.el-main {
  // background-color: #E9EEF3;
  color: #333;
  // text-align: center;
}
</style>
