// pages/feedback/form/voice/voice.js
const util = require('../../../../util/util.js')
let recordTimeInterval
const recorderManager = wx.getRecorderManager()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recording: false, // 录音中
    hasRecord: false, // 已经录音
    recordTime: 0, // 录音时长
    playTime: 0, // 播放时长
    formatedRecordTime: '00:00:00', // 录音时间
  },
  cancel: function() {
    wx.navigateBack();
  },
  confirm: function() {
    const pages = getCurrentPages()
    const prevPage = pages[pages.length-2] // 上一页
    const voice_list = prevPage.data.voice_list;
    voice_list.push({
      path: this.data.tempFilePath,
      time: this.data.formatedRecordTime,
      recordTime: this.data.recordTime
    })
    prevPage.setData({voice_list});
    wx.navigateBack({
      delta: 1,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    // 监听录音开始事件
    recorderManager.onStart(() => { 
      console.log('recorderManage: onStart')
      // 录音时长记录 每秒刷新
      recordTimeInterval = setInterval(() => {
        const recordTime = that.data.recordTime += 1
        that.setData({
          formatedRecordTime: util.formatTime(that.data.recordTime),
          recordTime
        })
      }, 1000)
    });

    // 监听录音停止事件
    recorderManager.onStop((res) => {
      console.log('recorderManage: onStop')
      that.setData({
        hasRecord: true, // 录音完毕
        recording: false,
        tempFilePath: res.tempFilePath,
        formatedPlayTime: util.formatTime(that.data.playTime),
      })
      // 清除录音计时器
      clearInterval(recordTimeInterval)
    });
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
    if(this.data.recording) {
      this.stopRecord();
    }
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
  startRecord() {
    this.setData({ 
      recording: true // 录音开始
    })
    // 设置 Recorder 参数
    const options = {
      duration: 600000, // 持续时长
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'aac',
      frameSize: 50
    }
    recorderManager.start(options) // 开始录音
  },

  stopRecord() {
    recorderManager.stop(); // 停止录音
  },
})