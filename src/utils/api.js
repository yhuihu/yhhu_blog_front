import axios from 'axios'
import qs from 'qs'

const service = axios.create({
  baseURL: process.env.BASE_URL,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
})
// 默认为application/json
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// http request 拦截器
// 在request提交的时候会在request header中添加token
service.interceptors.request.use(
  config => {
    if (localStorage.getItem('token')) { // 判断token是否存在
      config.headers.Authorization = localStorage.getItem('token') // 将token设置成请求头
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
export const postRequest = (url, data) => {
  return service({
    url: url,
    method: 'post',
    data: qs.stringify(data)
  })
}
export const getRequest = (url, params) => {
  return service({
    url: url,
    method: 'get',
    params: params
  })
}
