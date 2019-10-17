import Vue from 'vue'

import format from 'date-fns/format'
// import moment from 'moment'

Vue.filter('dateFormat',function (value,formatStr='yyyy-mm-dd HH:mm:ss') {
  // return moment(value).format(pattern)
  return format(value,formatStr)
})
