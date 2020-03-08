/**
 * ajax请求函数
 * 直接返回data数据
 */
import axios from 'axios'
export default function ajax(url='',data={},type='GET') {
  // console.log(data)
  return new Promise(function (resolve,reject) {
    let promise
    if(type === 'GET'){
      let dataStr = ''
      Object.keys(data).forEach(key => {
        dataStr += key + '=' + data[key] + '&'
      })
      if (dataStr !== ''){
        dataStr = dataStr.substring(0,dataStr.lastIndexOf('&'))
        url = url + '?' + dataStr
      }
      promise = axios.get(url)
      console.log(url)
    }else {
      promise = axios.post(url,data)
      // console.log(url,data)
    }

    promise.then(response => {
      resolve(response.data)
    }).catch(error => {
        reject(error)
      })
  })
}
