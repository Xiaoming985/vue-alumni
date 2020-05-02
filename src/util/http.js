import axios from 'axios'
import service from './api'
axios.defaults.withCredentials=true

// service 循环遍历输出不同的请求方法
let instance = axios.create({
    baseURL: 'http://localhost:8081/alumni',
    timeout: 1000
})
const http = {};//包裹请求方法的容器

// 请求格式的统一; key 即service中的子元素,即各个api
for(let key in service) {
    let api = service[key]; //有url和method
    //async作用:避免进入会掉地狱
    /*
        await 表达式会暂停当前 async function 的执行，等待 Promise 处理完成。
        (1)若 Promise 正常处理(fulfilled)，其回调的resolve函数参数作为 await 表达式的值，继续执行 async function。
        (2)若 Promise 处理异常(rejected)，await 表达式会把 Promise 的异常原因抛出。
        (3)另外，如果 await 操作符后的表达式的值不是一个 Promise，则返回该值本身。
    */

    // key指的是http对象的键，后面的函数即相对应的值
    http[key] = async function(
        params, // 请求参数
        config = {} // 配置参数
    ) {
        //不同请求的判断
        let response = {}; //请求的返回值
        if(api.method === 'put' || api.method === 'post' || api.method === 'patch'){
            try{
                response = await instance[api.method](api.url, params, config)
            }catch(err){
                response = err
            }
        }else if(api.method === 'delete' || api.method === 'get'){
            config.params = params
            try{
                response = await instance[api.method](api.url, config)
            }catch(err){
                response = err
            }
        }
        return response; // 返回响应值
    }
}

// 请求拦截器的添加
instance.interceptors.request.use(config=>{
    // 发起请求前做些什么
    return config
},()=>{
    // 请求错误

})

// 响应拦截器
instance.interceptors.response.use(res=>{
    //请求成功
    return res.data
},()=>{
  return res.data
})

export default http