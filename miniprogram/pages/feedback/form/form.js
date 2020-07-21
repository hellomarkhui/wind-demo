// pages/feedback/form/form.js
const db = wx.cloud.database();
const appGlobal = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeIndex: null,
    type: ['问题', '需求'],
    voice_list: [{path:"1",time: "00:05:00"},{path:"2",time: "00:08:00"}]
  },

  typeChange: function(e) {
    this.setData({
      typeIndex: e.detail.value
    })
  },
  formSubmit: function(e) {
    var question = e.detail.value;
    question.date = appGlobal.dateFormat("yyyy-mm-dd HH:MM:SS",new Date());
    question.type = this.data.type[question.type];
    wx.showLoading({
      title: '正在提交',
    })
    db.collection('questionlist').add({
      // data 字段表示需新增的 JSON 数据
      data: question
    })
    .then(res => {
      wx.hideLoading();
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 2000
      });
      //跳转到上一个页面
      wx.navigateBack();
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '失败',
        icon: 'none',
        duration: 1000
      });
    })
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
  addVoice() {
    wx.navigateTo({
      url: './voice/voice',
    })
  }
})