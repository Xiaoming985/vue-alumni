import Vue from 'vue'
import Vuex from 'vuex'
// 引入router,在vuex内使用router跳转
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    headImage: localStorage.getItem("headImage")?localStorage.getItem("headImage"):'',
    userName: localStorage.getItem("userName")?localStorage.getItem("userName"):'',
    tabList: [],
    TabsValue: '',
    tableHeader: { // 表头样式
      background:'#eef1f6',
      color:'#000',
    },
    cellStyle: { // 表格的单元格样式
      color: '#000',
    }
  },
  mutations: {
    init(state, userInfo) {
      // state.headImage = userInfo.headImage;
      // state.userName = userInfo.userName;
      localStorage.setItem("headImage",userInfo.headImage);
      localStorage.setItem("userName",userInfo.userName);
    },
    editTabs: (state, obj) => {
      // 浅拷贝 state.tabsPage
      let arr = Array.from(state.tabList);
      // 判断数组内会否为空
      if(arr.length !== 0) {
        // 使用Array.some去判断会否存在对象信息
        var even = function(obj) {
          return arr.some(item => { // some() 方法用于检测数组中的元素是否满足指定条件（函数提供）
            return item.name === obj.name;
          });
        };
        // even方法如果对象存在返回true,不存在返回false
        // 加!触发true代码块
        if(!even(obj)) { //如果不存在将对象push进数组内
          // 将tabs所需参数push进arr数组
          arr.push(obj);
          // 赋值给tabList参数
          state.tabList = arr;
          // 赋值给TabsValue参数
          state.TabsValue = obj.name;
          // 跳转
          router.push({name: obj.name});
        } else { // 如果存在,则只做跳转选中
          state.TabsValue = obj.name;
          router.push({name: obj.name});
        }
      } else {
        arr.push(obj);
        state.tabList = arr;
        state.TabsValue = obj.name;
        router.push({name: obj.name});
      }
    }
  },
  actions: {
    // 注册action
    editTabs(context, obj) {
      context.commit('editTabs', obj);
    }
  },
  modules: {
  },
  getters:{
    headImage(state) {
      return state.headImage;
    },
    userName(state) {
      return state.userName;
    },
    tableHeader(state) {
      return state.tableHeader;
    },
    cellStyle(state) {
      return state.cellStyle;
    }
  }
})
