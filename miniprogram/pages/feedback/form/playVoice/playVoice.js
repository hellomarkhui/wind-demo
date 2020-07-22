// pages/feedback/form/playVoice/playVoice.js
const util = require('../../../../util/util.js')
const innerAudioContext = wx.createInnerAudioContext();

let playTimeInterval
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playing: false, // 播放中
    pause: false, //暂停
    playTime: 0, // 播放时长
    formatedPlayTime: '00:00:00', // 播放时间
    recordTime: 0,
    formatedRecordTime: '00:00:00', // 录音时间
    path: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    console.log(options);
    const path = options.path
    const recordTime = parseInt(options.recordtime)
    this.setData({
      path,
      recordTime,
      formatedRecordTime: util.formatTime(recordTime)
    });
    // 监听播放开始事件
    innerAudioContext.onPlay(() => {
      playTimeInterval = setInterval(() => {
        const playTime = that.data.playTime + 1
        if(that.data.playTime == that.data.recordTime) {
          that.stopVoice();
        } else {
          that.setData({
            formatedPlayTime: util.formatTime(playTime),
            playTime
          })
        }
      }, 1000);
    });

    innerAudioContext.onStop(() => {
      
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
    if(this.data.playing || this.data.pause) {
      this.stopVoice();
      this.setData({
        playing: false,
        pause: false,
      })
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
  playVoice() {
    innerAudioContext.src = this.data.path;
    this.setData({
      playing: true,
      pause: false,
    }, () => {
      innerAudioContext.play();
    })
    
  },

  pauseVoice() {
    clearInterval(playTimeInterval)
    innerAudioContext.pause();
    this.setData({
      playing: false,
      pause: true
    })
  },

  stopVoice() {
    clearInterval(playTimeInterval)
    innerAudioContext.stop();
    this.setData({
      playing: false,
      pause: false,
      formatedPlayTime: util.formatTime(0),
      playTime: 0
    })
  },
})