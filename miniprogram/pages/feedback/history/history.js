// pages/feedback/history/history.js
const db = wx.cloud.database();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    question: {
      type: "",
      name: "",
      describe: "",
      factory: "",
      industry: "",
      comment: "",
      date: "",
    },
    
    isCard: true,
    comment_list:[],
    comment_list2: [],
    comment_text: null,
    reply_id: '0',
    placeholder:'请评价',
    now_reply_name: null,
    type: '0', //0为评价，1为回复评价，2为回复评价的回复
    now_parent_id: '0',
    now_reply: '0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.showLoading({
      title: '加载中',
    })
    db.collection('questionlist').doc(options.id).get().then(
      res => {
        this.setData({
          question: res.data
        });
        this.init();
        wx.hideLoading();
      }
    ).catch(err => {
      wx.hideLoading();
      console.log(err)
    });
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              that.setData({
                userinfo: res.userInfo
              })
            }
          })
        }
      }
      ,fail(){
        console.log("未授权登录");
      }
    })
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

  replyComment:function(e){
    var id = e.currentTarget.dataset.cid
    var name = e.currentTarget.dataset.name
    
    var type = e.currentTarget.dataset.type
    var parent_id = e.currentTarget.dataset.pid
    this.setData({
      now_reply: id,
      now_reply_name: name,
      now_reply_type: type,
      now_parent_id: parent_id,
      focus: true,
      placeholder: '回复' + name+":"
    })
  },
  getCommentText: function (e) {
    var val = e.detail.value;
    this.setData({
      comment_text: val
    });
  },
onReplyBlur: function (e) {
    var that = this;
    const text = e.detail.value.trim();
    if (text === '') {
      that.setData({
        now_reply: '0',
        now_reply_name: null,
        now_reply_type: '0',
        now_parent_id: '0',
        placeholder: "写评价",
        focus: false
      });
    }
  },
  
  sendComment:function(e){
    var that= this
    var comment_list = that.data.comment_list  //获取data中的评论列表
    var comment_list2 = that.data.comment_list2  //获取data中的回复列表
    var comment_pr_id = that.data.question._id //
    var comment_text = that.data.comment_text  //获取当前的评论幸喜
    var userinfo = that.data.userinfo   //获取当前的用户信息
    var comment_user_name = userinfo.nickName  //用户昵称
    var comment_user_avatar = userinfo.avatarUrl //用户头像
    var timestamp = Date.parse(new Date()); //时间戳
    var create_time = app.globalData.dateFormat('yyyy年mm月dd日', new Date())  //格式化时间戳
    var reply_id = that.data.reply_id //获取回复的评论id
    var reply_name = null
    var parent_id = '0'
    var reply_id = that.data.now_reply
    if (reply_id != '0'){ //回复 不是评论
      var reply_type = that.data.now_reply_type
      parent_id = that.data.now_parent_id //回复的是哪个id
      if (parent_id != '0') { //
        if (reply_type == '1'){
          parent_id = reply_id
        }else{
          reply_name = that.data.now_reply_name
        }
      }
    }else{

    }
    var comment_detail = {}
  //  comment_detail.comment_id = new_id //通过保存数据库后获取id
    comment_detail.comment_user_name = comment_user_name
    comment_detail.comment_user_avatar = comment_user_avatar
    comment_detail.comment_text = comment_text
    comment_detail.comment_time = create_time
    comment_detail.reply_id = reply_id
    comment_detail.parent_id = parent_id
    comment_detail.reply_name = reply_name
    comment_detail.comment_pr_id = comment_pr_id
    this.submitComment(comment_detail).then(res => {
      comment_detail._id = res //通过保存数据库后获取id
      if (comment_detail.parent_id != '0' ){
        comment_list2.push(comment_detail)
      }else{
        comment_list.unshift(comment_detail)
      }
      that.setData({
        comment_text:null,
        now_reply: 0,
        now_reply_name: null,
        now_reply_type: 0,
        now_parent_id: 0,
        placeholder: "写评价",
        comment_list,
        comment_list2
      })
    }).catch( err => {
      wx.showToast({
        title: '评论失败',
      })
    })
  },
  //将评价写入数据库
  submitComment: function(comment) {
    return new Promise( (resolve, reject) => {
      db.collection("comment").add({
        data: comment
      }).then( res => {
        resolve(res._id);
      })
    });
  },
  //初始化数据
  init: function(){
    const that = this;
    db.collection('comment').where({
      comment_pr_id: that.data.question._id
    }).get({
      success: function(res) {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        console.log(res.data)
        const comment_list = res.data.filter((item, index, items) => {
          return item.parent_id == '0' && item.reply_id == '0';
        })
        comment_list.reverse();
        const comment_list2 = res.data.filter((item, index, items) => {
          return item.parent_id != '0' && item.reply_id != '0';
        })
        that.setData({
          comment_list: comment_list,
          comment_list2: comment_list2
        })
      }
    })
  }
})