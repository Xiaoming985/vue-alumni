<template>
  <el-tabs v-model="TabsValue" type="border-card" @tab-click="clickTab($event)" @tab-remove="removeTab">
    <el-tab-pane label="首页">
      <span slot="label"><i class="el-icon-guide"></i>首页</span>
      <el-carousel :interval="4000" type="card" height="300px">
        <el-carousel-item v-for="(item,index) in imgList" :key="index">
          <img :src="item.src" alt="">
        </el-carousel-item>
      </el-carousel>
    </el-tab-pane>
    <el-tab-pane v-for="(item,index) in tabList" :key="index" :name="item.name" closable>
      <span slot="label"><i :class="item.icon"></i>{{item.title}}</span>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
// import bus from '../util/bus'
export default {
  data() {
    return {
      imgList: [
        {src: require('../assets/images/1.jpg')},
        {src: require('../assets/images/2.jpg')},
        {src: require('../assets/images/3.jpg')},
        {src: require('../assets/images/4.jpg')},
        {src: require('../assets/images/5.jpg')},
        {src: require('../assets/images/6.jpg')}
      ]
      // TabsValue: '',
      // tabList: []
    }
  },
  computed: {
    // 监听vuex保存的数据
    tabList: {
      get() {
        return this.$store.state.tabList;
      },
      set(val) {
        this.$store.state.tabList = val;
      }
    },
    TabsValue: {
      get() {
        return this.$store.state.TabsValue;
      },
      set(val) {
        this.$store.state.TabsValue = val;
      }
    }
  },
  mounted() {
    
  },
  methods: {
    clickTab(event) {
      // console.log(event);
      this.$router.push({name: event.name});
    },
    removeTab(targetName) { // targetName即被删除的标签的 name
      let tabs = this.tabList;
      let activeName = this.TabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.TabsValue = activeName;
      this.tabList = tabs.filter(tab => tab.name !== targetName);
      // 删除时跳转不再停留被删除页
      this.$router.push({name: activeName});
    }
  }
}
</script>

<style lang="scss" scoped>
.el-carousel__item img {
  width: 620px;
  height: 300px;
}
</style>
