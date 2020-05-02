import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import http from './util/http'
import qs from 'qs'
import { Container,Aside,Menu,Submenu,MenuItem,MenuItemGroup,Header,Main,Footer,Icon,Button,Avatar,Form,FormItem,
  Upload,Message,MessageBox,Table,TableColumn,Input,Select,Option,Checkbox,Row,Col,Radio,RadioGroup,CheckboxButton,
  CheckboxGroup,DatePicker,TimePicker,Pagination,Dialog,Tag,Progress,Tabs,TabPane, Carousel, CarouselItem } from 'element-ui'

Vue.config.productionTip = false

Vue.prototype.$http = http;
Vue.prototype.$qs = qs;
Vue.prototype.$message = Message;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Icon);
Vue.use(Button);
Vue.use(Avatar);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Upload);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Checkbox);
Vue.use(Row);
Vue.use(Col);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.use(DatePicker);
Vue.use(TimePicker);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Progress);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Carousel);
Vue.use(CarouselItem);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
