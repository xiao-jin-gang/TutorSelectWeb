import request from '@/utils/request'

// 院系秘书 初审导出表中的所有数据
export function exportCS(data) {
  return request({
    url: '/admin/export/cs',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
// 院系秘书  查看院系主管审核已审核 导出同意上分会的所有数据
export function exportSFH(data) {
  return request({
    url: '/admin/export/sfh',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

// 院系秘书  录入复审名单 导出学院分会同意的所有数据
export function exportSXYFH(data) {
  return request({
    url: '/admin/export/sxyfh',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

// 院系秘书  录入复审名单 导出学院分会同意的所有数据
export function exportFinOrg(data) {
  return request({
    url: '/admin/export/finalOrg',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}


// 研究生院管理员   导出同意上校会的的所有名单
export function exportQualification(data) {
  return request({
    url: '/admin/export/qualification',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
// 研究生院管理员   导出学位委员会通过的所有名单
export function exportFinalistGraduate(data) {
  return request({
    url: '/admin/export/finalListGraduate',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
// 研究生院管理员   导出学同意上校分会的的所有名单
export function getFinalList() {
  return request({
    url: '/admin/export/getFinalList',
    method: 'post',
    responseType: 'blob'
  })
}

