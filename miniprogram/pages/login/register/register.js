// pages/login/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      nickname: "",
      name: "",
      email: "",
      company: "",
      job: "",
      tel: "",
      password: "",
      confirmPassword: ""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  nicknameChange(e){
    this.setData({nickname: e.detail.detail.value})
  },
  passwordChange(e){
    this.setData({password: e.detail.detail.value})
  },
  confirmPasswordChange(e){
    this.setData({confirmPassword: e.detail.detail.value})
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
})