// pages/login/login.js
const app = getApp();
const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nickname: "",
    name: "",
    email: "",
    company: "",
    job: "",
    tel: "",
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  nicknameChange(e){
    this.setData({nickname: e.detail.detail.value})
  },
  nameChange(e){
    this.setData({name: e.detail.detail.value})
  },
  emailChange(e){
    this.setData({email: e.detail.detail.value})
  },
  companyChange(e){
    this.setData({company: e.detail.detail.value})
  },
  jobChange(e){
    this.setData({job: e.detail.detail.value})
  },
  telChange(e){
    this.setData({tel: e.detail.detail.value})
  },

   // 提交注册信息到数据库
   signUp() {
    const that = this;
    if(''== this.data.nickname){
      return ;
    }
    if(''==this.data.name){
      return ;
    }
    if(''==this.data.email){
      return ;
    }
    wx.showLoading({
      title: '正在注册',
    })
    db.collection('user').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        nickname: this.data.nickname,
        name: this.data.name,
        email: this.data.email,
        company: this.data.company,
        job: this.data.job,
        tel: this.data.tel
      }
    })
    .then(res => {
      wx.hideLoading();
      wx.showToast({
        title: '注册成功',
        icon: 'success',
        duration: 2000
      });
      app.globalData.isSignUp = true;
      app.globalData.isLogin = true;
      wx.switchTab({
        url: '../production/home/home',
      })
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '注册失败',
        icon: 'none',
        duration: 1000
      });
    })
  },
  getUserInfo(){
    const that = this;
    // 查看是否授权
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          that.setData({
            isAuth: true
          })
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              that.setData(res.userInfo)
            }
          })
        }
      }
      ,fail(){
        console.log("未授权登录");
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})