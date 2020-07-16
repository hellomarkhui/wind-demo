// pages/about/userinfo/userinfo.js
const db = wx.cloud.database();
const app = getApp();
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
  },
  getUserInfo() {
    const that = this;
    db.collection('user').where({
      _openid: app.globalData.openid
    })
    .get().then(res => {
      if(res.data.length === 1){
        //已注册
        const info = res.data[0];
        that.setData(info);
      }
    }).catch(err => {
      console.log("判断注册状态失败"+err);
    })
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