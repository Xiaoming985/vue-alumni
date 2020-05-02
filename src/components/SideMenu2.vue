<template>
  <el-menu :default-active="$router.name" background-color="#D3DCE6" text-color="#333" active-text-color="#fff">
    <el-menu-item :index="item.name" v-for="(item,index) in menus" :key="index" @click="addTabs(item)">
      <template slot="title"><i :class="item.icon"></i>{{item.title}}</template>
    </el-menu-item>
  </el-menu>
</template>

<script>
// import bus from '../util/bus'
import { mapActions } from 'vuex'
export default {
  props: ['menus'],
  methods: {
    // 调用 注册vuex内注册的editTabs方法
    ...mapActions({
      addTabs: 'editTabs'
    })
  }
}
</script>

<style lang="scss" scoped>
.el-menu-item {
  font-size: 16px;
  font-weight: bold;

  i {
    font-size: 25px;
    color: #333;
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
