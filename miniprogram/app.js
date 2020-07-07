//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    this.globalData = {
      dateFormat: function(fmt, date) {
          let ret;
          const opt = {
              "Y+": date.getFullYear().toString(),        // 年
              "y+": date.getFullYear().toString(),        // 年
              "m+": (date.getMonth() + 1).toString(),     // 月
              "D+": date.getDate().toString(),            // 日
              "d+": date.getDate().toString(),            // 日
              "H+": date.getHours().toString(),           // 时 24小时制
              "h+": (date.getHours()>12?date.getHours()-1:date.getHours()).toString(),           // 时 12小时制
              "M+": date.getMinutes().toString(),         // 分
              "S+": date.getSeconds().toString(),         // 秒
              "s+": date.getSeconds().toString()          // 秒
              // 有其他格式化字符需求可以继续添加，必须转化成字符串
          };
          for (let k in opt) {
              ret = new RegExp("(" + k + ")").exec(fmt);
              if (ret) {
                  fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
              };
          };
          return fmt;
      }
    }
  }
})
