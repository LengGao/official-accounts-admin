import axios from '@/utils/request'
import qs from 'qs'

export function getList (params) {
  return {
    url: '/table/list',
    method: 'get',
    params
  }
}

// 上课点
export const campus = () => axios.get('/campus/all')
// 消息推送
export const timerCreate = data => axios.post('/push/timer-create', data)
// 可操作公众号信息
export const usableClient = () => axios.get('/wx-clients/usable-client')
// 根据类型获取数据字典 学生年级:STUDENT_GRADE,推送对象:PUSH_TARGET,插入数据:INSERT_DATA
export const types = query => axios.get(`/types?${qs.stringify(query)}`)

// 公号信息分页查询
export const wxClients = data =>
  axios.get('/wx-clients', {
    params: data
  })
// 微信模板信息分页查询
export const wxTemplates = (clientId, data) =>
  axios.get(`/wx-clients/${clientId}/wx-templates`, {
    params: data
  })
// 禁用数据字典(字段管理)
export const banTypes = id => axios.get(`/ban?id=${id}`)
// 区域查询
export const region = query => axios.get('/region', { params: query })
// 校区查询
export const allCampus = () => axios.get('/campus/all')
// 缓存推送数据
export const msgCache = params => axios.post('/push/pre-message-cache', params)
// 获取二维码
export const preQrCode = query => axios.get('/push/pre-send', { params: query })
// 推送历史
export const history = query => axios.get('/push/page', { params: query })
// 启用暂停任务
export const pushStatus = (timerId, query) =>
  axios.get(`/push/${timerId}/status`, { params: query })
// 立即发送任务
export const sendTask = timerId => axios.get(`/push/${timerId}/push`)
// 删除任务
export const delTask = timerId => axios.get(`/push/${timerId}/delete`)
// 区域查询全部
export const getAllRegion = query =>
  axios.get('/region/province', { params: query })
// 公众号粉丝情况
export const fansDetail = clientId => axios.get(`/wx-clients/${clientId}/Usage`)
// 新增公众号
export const createClient = query => axios.get('/wx-clients/insert', { params: query })
// 删除公众号
export const deleteClient = clientId => axios.get(`/wx-clients/${clientId}/delete`)

// 系统管理
// 增加用户
export const saveUser = params => axios.post('/sys-users/save', { ...params })
// 增加角色
/*
{
  "menuIds": "string",
  "sysRoleId": 0,
  "sysRoleName": "string",
  "wxClientIds": "string"
}
*/
export const saveRole = params => axios.post('/sys-roles/save')
// 用户总数
export const totalUser = query =>
  axios.get('/sys-users/page', { params: query })
// 角色管理d
export const totalRole = query =>
  axios.get('/sys-roles/page', { params: query })
// 搜索用户
export const searchUser = query =>
  axios.get('/sys-users/page', { params: query })
// 搜索角色
export const searchRole = query =>
  axios.get('/sys-roles/page', { params: query })
// 禁用用户
/**
 * sysUserId
 * enable 0 可用 1 禁用
 */
export const disableUser = params =>
  axios.post('/sys-users/enable', qs.stringify(params))

// 删除角色
/**
 * roleId
 */
export const deleteRole = params =>
  axios.post('/sys-roles/delete', qs.stringify(params))
// 修改用户
/**
 * {
  "department": "string",
  "id": 0,
  "manager": "string",
  "password": "string",
  "sysRoleIds": "string",
  "username": "string"
}
 */
export const modifyUser = params => axios.post('/sys-users/update', params)
// 修改角色
/**
 * {
  "menuIds": "string",
  "sysRoleId": 0,
  "sysRoleName": "string",
  "wxClientIds": "string"
}
 */
export const modifyRole = params => axios.post('/sys-roles/update', params)
