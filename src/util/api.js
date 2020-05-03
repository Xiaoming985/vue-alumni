const ALUMNI_API = {
  // 登录
  login: {
    method: 'post',
    url: '/loginController/login'
  },
  // 注册
  regist: {
    method: 'post',
    url: '/loginController/regist'
  },
  logout: {
    method: 'post',
    url: '/loginController/logout'
  },
  // 修改密码
  updatePassword:{
    method: 'post',
    url: '/loginController/updatePassword'
  },
  // 按条件获取用户信息
  getUserInfo: {
    method: 'get',
    url: '/userController/getUserInfo'
  },
  // 根据账号获取用户
  getUserByAccount: {
    method: 'get',
    url: '/userController/getUserByAccount'
  },
  // 获取登录用户的用户信息(根据用户id获取)
  getMyInfo: {
    method: 'get',
    url: '/userController/getMyInfo'
  },
  // 提交用户信息
  updateUserInfo: {
    method: 'post',
    url: '/userController/updateUserInfo'
  },
  // 按条件获取学校
  getSchool: {
    method: 'get',
    url: '/schoolController/getSchool'
  },
  // 获取年级
  getGradeBySchoolId: {
    method: 'get',
    url: '/classController/getGradeBySchoolId'
  },
  // 获取班级
  getClass: {
    method: 'get',
    url: '/classController/getClass'
  },
  // (管理员)删除用户
  deleteUser: {
    method: 'post',
    url: '/userController/deleteUser'
  },
  uploadHead: {
    method: 'post',
    url: '/userController/uploadHead'
  },
  updateSchool: {
    method: 'post',
    url: '/schoolController/updateSchool'
  },
  deleteSchool: {
    method: 'post',
    url: '/schoolController/deleteSchool'
  },
  updateClass: {
    method: 'post',
    url: '/classController/updateClass'
  },
  deleteClass: {
    method: 'post',
    url: '/classController/deleteClass'
  },
  getAllLeave: {
    method: 'get',
    url: '/leaveController/getAllLeave'
  },
  getLeaveByClassId: {
    method: 'get',
    url: '/leaveController/getLeaveByClassId'
  },
  deleteLeave: {
    method: 'post',
    url: '/leaveController/deleteLeave'
  }
}

export default ALUMNI_API