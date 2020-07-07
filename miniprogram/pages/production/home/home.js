// pages/production/home/home.js
var pro_packages = require("../../../test-data/pro-packages.js").data;
var pro_list = require("../../../test-data/pro-list.js").data;
var pro_files = require("../../../test-data/pro-files.js").data;
var packages_len = pro_packages.length;
var list_len = pro_list.length;
var files_len = pro_files.length;

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
    list: pro_list
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

  }
})