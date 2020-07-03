// pages/production/home/home.js
const app = getApp()
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    ProductionNavTop: 0,
    list: [],
    load: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tabSelect(e) {
      this.setData({
        TabCur: e.currentTarget.dataset.id,
        MainCur: e.currentTarget.dataset.id,
        ProductionNavTop: (e.currentTarget.dataset.id - 1) * 50
      })
    },
    ProductionMain(e) {
      let that = this;
      let list = this.data.list;
      let tabHeight = 0;
      if (this.data.load) {
        for (let i = 0; i < list.length; i++) {
          let view = wx.createSelectorQuery().select("#main-" + list[i].id);
          view.fields({
            size: true
          }, data => {
            list[i].top = tabHeight;
            tabHeight = tabHeight + data.height;
            list[i].bottom = tabHeight;     
          }).exec();
        }
        that.setData({
          load: false,
          list: list
        })
      }
      let scrollTop = e.detail.scrollTop + 20;
      for (let i = 0; i < list.length; i++) {
        if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
          that.setData({
            ProductionNavTop: (list[i].id - 1) * 50,
            TabCur: list[i].id
          })
          return false
        }
      }
    }
  },

  attached: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    let list = [{}];
    list = [
      {
        id: 0,
        name: "新能源场站监控产品包",
        childList: []
      },
      {
        id: 1,
        name: "新能源场站监控产品包",
        childList: []
      },
      {
        id: 2,
        name: "新能源场站监控产品包",
        childList: []
      }
    ];
    this.setData({
      list: list,
      listCur: list[0]
    })
  },
  ready: function() {
    wx.hideLoading();
  }
})
