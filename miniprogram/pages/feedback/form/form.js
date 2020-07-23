// pages/feedback/form/form.js
const util = require('../../../util/util.js')
const db = wx.cloud.database();
const appGlobal = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeIndex: null,
    type: ['问题', '需求'],
    voice_list: [],
    fileList: [],
    imageList: [],
  },

  typeChange: function(e) {
    this.setData({
      typeIndex: e.detail.value
    })
  },

  formSubmit: function(e) {
    const that = this;
    var question = e.detail.value;
    question.date = appGlobal.dateFormat("yyyy-mm-dd HH:MM:SS",new Date());
    question.type = this.data.type[question.type];
    wx.showLoading({
      title: '正在提交',
    })
    //上传录音
    let promises1 = this.voiceUpLoad();
    //文件上传
    let promises2 = this.filesUpLoad()
    //图片上传
    let promises3 = this.imagesUpLoad()

    Promise.all(promises1).then( voices => {
      question.voice_list = voices;
      return Promise.all(promises2);
    }).then( files => {
      question.fileList = files
      return Promise.all(promises3);
    }).then( images => {
      question.imageList = images;
      that.submitDB(question);
    })
  },
  submitDB(question){
    db.collection('questionlist').add({
      // data 字段表示需新增的 JSON 数据
      data: question
    })
    .then(res => {
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 2000
      });
      //跳转到上一个页面
      wx.navigateBack();
    }).catch(err => {
      wx.showToast({
        title: '失败',
        icon: 'fail',
        duration: 2000
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
  },
  playVoice(e) {
    const path = e.currentTarget.dataset.path;
    const time = e.currentTarget.dataset.time;
    const recordtime = e.currentTarget.dataset.recordtime;
    wx.navigateTo({
      url: './playVoice/playVoice?path='+path+'&recordtime='+recordtime,
    })
  },
  //删除录音
  deleteVoice: function(e) {
    const index = e.currentTarget.dataset.index;
    this.data.voice_list.splice(index, 1)
    this.setData({
      voice_list: this.data.voice_list
    })
  },
  //文件上传
  fileRead(event) {
    const that = this;
    const files = event.detail.file;
    const fileList = this.data.fileList;
    if(files.length){
      files.forEach(file => {
        fileList.push({...file, url: file.path})
      })
    }
    this.setData({
      fileList
    })
  },
  fileDelete(e) {
    const index = e.detail.index;
    const {fileList} = this.data;
    fileList.splice(index, 1);
    this.setData({fileList})
  },
  //图片上传
  imageRead(event) {
    const that = this;
    const files = event.detail.file;
    const imageList = this.data.imageList;
    if(files.length){
      files.forEach(file => {
        imageList.push({...file, url: file.path})
      })
    }
    this.setData({
      imageList
    })
  },
  imageDelete(e) {
    const index = e.detail.index;
    const {imageList} = this.data;
    imageList.splice(index, 1);
    this.setData({imageList})
  },
  //文件上传
  filesUpLoad() {
    const that = this;
    const promises = []
    this.data.fileList.forEach( (item,index) => {
      //let suffix = /\.\w+$/.exec(item.path)[0]; // 正则表达式，返回文件扩展名
      promises.push(new Promise( (resolve, reject) => {
        wx.cloud.uploadFile({
          cloudPath: "files/"+item.name, // 上传至云端的路径
          filePath: item.path, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            console.log(index,res.fileID)
            resolve({
              fileFileID: res.fileID,
              fileName: item.name
            })
          },
          fail: console.error
        })
      }))
    });
    return promises
  },
  //图片上传
  imagesUpLoad() {
    const promises = []
    this.data.imageList.forEach( (item,index) => {
      let suffix = /\.\w+$/.exec(item.path)[0]; // 正则表达式，返回文件扩展名
      promises.push(new Promise( (resolve, reject) => {
        wx.cloud.uploadFile({
          cloudPath: "images/"+util.dateFormat('yyyymmdd-HHMMss',new 
          Date())+"-"+index+suffix, // 上传至云端的路径
          filePath: item.path, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            console.log(index,res.fileID)
            resolve({
              imageFileID: res.fileID
            })
          },
          fail: console.error
        })
      }))
    });
    return promises
  },
  //录音上传
  voiceUpLoad() {
    const promises = []
    this.data.voice_list.forEach( (item,index) => {
      promises.push(new Promise( (resolve, reject) => {
        let suffix = /\.\w+$/.exec(item.path)[0]; // 正则表达式，返回文件扩展名
        wx.cloud.uploadFile({
          cloudPath: "voice/"+util.dateFormat('yyyymmdd-HHMMss',new 
          Date())+"-"+index+suffix, // 上传至云端的路径
          filePath: item.path, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            console.log(index,res.fileID)
            resolve({
              voiceFileID: res.fileID,
              recordTime: item.recordTime
            })
          },
          fail: console.error
        })
      }))
    });
    return promises
  }
})