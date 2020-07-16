// pages/production/home/home.js
var pro_packages = require("../../../test-data/pro-packages.js").data;
var pro_list = require("../../../test-data/pro-list.js").data;
var pro_files = require("../../../test-data/pro-files.js").data;
var packages_len = pro_packages.length;
var list_len = pro_list.length;
var files_len = pro_files.length;
const app = getApp();
const db = wx.cloud.database();
//const appGlobal = getApp().globalData;
//添加files
for(var i = 0; i < list_len; i++) {
  var proId = pro_list[i].id;
  if(!pro_list[i].files)
    pro_list[i].files = []; //获取files
  for(var j = 0; j < files_len; j++){
    if(proId === pro_files[j].proId){
      var fileId = pro_files[j].fileId;
      pro_list[i].files.push({
        filename: fileId.substring(fileId.lastIndexOf("/")+1,fileId.length),
        fileid:  pro_files[j].fileId,
        url: pro_files[j].url,
      });
    }   
  }
}
//添加Pro

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeKey: 0,
    active: 1,
    curContent: 'proList', //proList为产品列表，detail为详情
    curPackageId: pro_packages.length?pro_packages[0].id:-1,
    curProId: -1,
    packages: pro_packages,
    list: pro_list,
    selectFiles: [],
    downloadFilePaths: [],
    sendEmailFiles: []
  },
  lookDetail(e) {
    this.setData({
      curContent: 'detail',
      curProId: e.currentTarget.dataset.proid
    })
  },
  detailBack(){
    this.setData({
      curContent: 'proList',
    })
  },
  tabSelect(e) {
    this.setData({
      curPackageId: e.currentTarget.dataset.id,
      curContent: 'proList',
    })
  },
  checkFiles(e) {
    const selects = e.detail.value;
    const selectFiles = [];
    for(let i = 0; i < selects.length; i++) {
      const select = selects[i];
      const name = select.substring(select.lastIndexOf("/")+1,select.length);
      const url = pro_files.filter(function(item){
        return item.fileId == fileId;
      })[0].url;
      selectFiles.push({
        fileId: select,
        name: name,
        url: url
      })
    }
    this.setData({
      selectFiles: selectFiles
    })
  },
  sendEmail() {
    const _self = this;
    const sendFiles = [];
    for(let i = 0; i < this.data.selectFiles.length; i++) {
      const fileId = this.data.selectFiles[i];
      if(this.data.sendEmailFiles.filter(function(item){
        return item.fileId == fileId.fileId
      }).length)
          continue; //判断文件是否已发送邮件
      else {
        sendFiles.push({
          filename: fileId.name,
          path: fileId.url
        });
        this.data.sendEmailFiles.push(fileId);
      }
    }
    wx.showLoading({
      title: '发送邮件中',
    })
    wx.cloud.callFunction({
      name: "sendEmail",
      data: {
        attachments: sendFiles
      }
    }).then( res => {
      this.setData({
        result: res
      })
      wx.hideLoading();
      wx.showToast({
        title: '成功',
      })
      console.log("发送成功",res);
    }).catch( err => {
      console.log("发送失败",err);
      wx.hideLoading();
    });
  },
  openFile(e){
    wx.openDocument({
      filePath: e.currentTarget.dataset.url,
      success: function (res) {
        console.log('打开文档成功')
      },
    });
  },
  loadFile: function(){
    const _self = this;
    const promises = [];
    for(let i = 0; i < this.data.selectFiles.length; i++) {
      const fileId = this.data.selectFiles[i];
      if(this.data.downloadFilePaths.filter(function(item){
        return item.fileId == fileId.fileId
      }).length)
        continue; //判断文件是否已下载
      promises.push(new Promise((resolve,reject) => {
        wx.downloadFile({
          url: fileId.url, //仅为示例，并非真实的资源
          success (res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {
                const tempFilePath = res.tempFilePath
                resolve({filePath: tempFilePath,
                title: fileId.name});
            }
          }
        })
      }))
    }
    Promise.all(promises).then( data => {
      this.setData({
        downloadFilePaths: data
      });
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //检测登录
    app.login(res => {
      if(!res){
        wx.redirectTo({
          url: '../../login/login',
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    app.login();
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