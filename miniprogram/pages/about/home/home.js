// pages/about/home/home.js
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
    isSignUp: false,
    current: "signin"
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
  // signChange ({ detail }) {
  //   this.setData({
  //       current: detail.key
  //   });
  // },
  // 提交注册信息到数据库
  signUp() {
    const that = this;
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
      that.setData({
        isSignUp: true
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

  getLoginInfo() {
    const that = this;
    //登录状态
    const p1 = new Promise((resolve, reject) => {
      try {
        const openid = wx.getStorageSync('openid')
        if (openid) {
          //已有openid
          resolve(openid)
        }else {
          //获取openid
          wx.cloud.callFunction({
            name: "login"
          }).then( res => {
            console.log(res.result);
            //把openid存起来
            try {
              wx.setStorageSync('openid', res.result.openid)
            } catch (e) { }
            resolve(res.result.openid);
          }).catch(err => {
            reject("云函数调用错误:"+err);
          })
        }
      } catch (e) {
        reject("getStore错误");
      }
    });
    //从数据库获取登录信息
    p1.then( openid => {
      return new Promise((resolve, reject) => {
        db.collection('user').where({
          _openid: openid
        })
        .get().then(res => {
          console.log(res.data)
          if(res.data.length === 1){
            //已注册
            const info = res.data[0];
            info.isSignUp = true;
            that.setData(info);
          }
          resolve()
        }).catch(err => {
          console.log("判断注册状态失败"+err);
          reject()
        })
      });
      //查询数据库用户信息
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.getLoginInfo();
  },

  bindGetUserInfo (e) {
   // console.log(e.detail.userInfo)
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