Page({
  data: {
    PageCur: 'production'
  },
  navTo: function(){
    wx.navigateTo({
      url: '/pages/about/home/home',
    })
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  onShareAppMessage() {
    return {
      title: '明阳微信小程序demo',
    //imageUrl: '/images/share.jpg',
      path: '/pages/index/index'
    }
  },
})