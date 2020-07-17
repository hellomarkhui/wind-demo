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
    isEdit: false
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

  edit: function(){
    this.setData({
      isEdit: true
    })
  },

  commit: function(){
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
      title: '正在保存',
    })
    
    var submit = function(id){
      db.collection('user').doc(id).update({
        // data 字段表示需新增的 JSON 数据
        data: {
          nickname: that.data.nickname,
          name: that.data.name,
          email: that.data.email,
          company: that.data.company,
          job: that.data.job,
          tel: that.data.tel
        }
      }).then(res => {
        wx.hideLoading();
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        });
        that.setData({
          isEdit: false
        })
      }).catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: '保存失败',
          icon: 'none',
          duration: 1000
        });
      })
    }
    db.collection('user').where({
      _openid: app.globalData.openid
    }).get().then( res => {
      console.log(res);
      if(res.data.length == 1){
        submit(res.data[0]._id);
      }else {
        wx.hideLoading();
        wx.showToast({
          title: '保存失败',
          icon: 'none',
          duration: 1000
        });
      }
    }).catch( err => {
      wx.hideLoading();
        wx.showToast({
          title: '保存失败',
          icon: 'none',
          duration: 1000
        });
    })
  },

  cancel: function() {
    this.getUserInfo();
    this.setData({
      isEdit: false
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