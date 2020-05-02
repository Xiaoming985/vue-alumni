<template>
  <div class="menu-list">
    <router-link v-for="(item,index) in menus" :key="index" :to="item.path" class="menu-option">
      <i :class="item.icon"></i>
      <div class="text">{{item.title}}</div>
    </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menus: [
        {
          title: '我的信息',
          path: '/index/user-info',
          icon: 'el-icon-user'
        },
        {
          title: '学校管理',
          path: '/index/school-manage',
          icon: 'el-icon-school'
        },
        {
          title: '班级管理',
          path: '',
          icon: 'el-icon-data-board'
        },
        {
          title: '用户管理',
          path: '/index/user-manage',
          icon: 'el-icon-s-custom'
        },
        {
          title: '留言管理',
          path: '',
          icon: 'el-icon-chat-dot-round'
        },
        {
          title: '日志管理',
          path: '',
          icon: 'el-icon-notebook-1'
        },
        {
          title: '相册管理',
          path: '',
          icon: 'el-icon-picture-outline'
        },
      ],
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-list {
  position: absolute;
  top: 20%;
  left: 0;
  z-index: 100;
  box-shadow: 0px 0px 5px 5px rgba(0,0,0,.3);
}
.menu-option {
  display: block;
  color: black;
  text-decoration: none;
  cursor: pointer;
  position: relative;
  &:hover i{
    color: #ffa502;
    background-color: #ced6e0;
  }
  &:hover .text{
    left: 60px;
  }
  i {
    display: block;
    width: 60px;
    text-align: center;
    height: 60px;
    line-height: 60px;
    background: #f1f1f1;
    // color: #b9b9b9;
    font-weight: 6  00;
    font-size: 25px;
    transition: 0.6s;/*规定过渡效果需要多少时间*/
  }
  .text{
    position: absolute; // 子绝父相
    height: 60px;
    width: 200px;
    background: #ced6e0;
    top: 0;
    z-index: -1;
    left: -140px;
    // color: #fff;
    font-weight: bold;
    line-height: 60px;
    text-align: center;
    transition: 0.6s;
  }
}
</style>