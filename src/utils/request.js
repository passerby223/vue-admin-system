import axios from 'axios'
import { getToken } from '@/utils/auth'
import { notification } from 'ant-design-vue'

const notice = (msg) => {
  notification.error({
    message: '错误',
    description: msg
  })
}

const service = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000/api' : 'http://127.0.0.1:8000/pro-api',
  timeout: 5000
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    if (getToken() !== undefined) {
      // let each request carry token
      // ['Authorization'] is a custom headers key
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  (error) => {
    console.log('req' + error)
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  (response) => {
    const resData = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (resData.code !== 20000) {
      notice(resData.message || '未知错误 ===> code!=20000')
      return Promise.reject(new Error(resData.message || '未知错误 ===> code!=20000'))
    } else {
      return resData
    }
  },
  (error) => {
    const resErrorData = error.response.data
    if (error.response.status === 400) {
      notice(JSON.stringify(resErrorData.message) || '未知错误 ===> 400')
    } else if (error.response.status === 401) {
      notice(resErrorData.message || '未知错误 ===> 401')
    } else if (error.response.status === 403) {
      notice(resErrorData.message || '未知错误 ===> 403')
    } else if (error.response.status === 404) {
      notice(resErrorData.message || '未知错误 ===> 404')
    } else if (error.response.status === 500) {
      notice('服务器出现了未知错误,请联系站点管理员')
    } else {
      notice(resErrorData.message || `未知错误 ===> ${error.response.status}`)
    }
    // console.log(error.message);
    return Promise.reject(error)
  }
)
export default service
