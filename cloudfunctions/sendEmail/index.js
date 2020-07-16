// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
//引入发送邮件的类库
var nodemailer = require('nodemailer');
//创建一个SMTP客户端配置
var config = {
  host: "smtp.qq.com" //邮箱的主机
  ,prot: 465 //邮箱的端口号
  ,secure: true//启用SSL协议 465端口true，其他端口false，看的官方文档
  ,auth: {
    user: "1106619766@qq.com" //邮箱
    ,pass: "duoyywmvsuqkgcjf" //邮箱授权码
  }
}
//创建SMTP客户端对象
var transporter =  nodemailer.createTransport(config);
// 云函数入口函数
exports.main = async (event, context) => {
  console.log("attachments: ", event.attachments);
   //创建一个邮件对象
   var mail = {
    from: "韦汉辉<1106619766@qq.com>" //发件人，随意写？
    ,subject: "来自明阳小程序的文件发送邮件" //邮件主题
    ,to: "weihanhui@mywind.com.cn"// 收件列表,可以多个，也就是群发，用逗号","隔开
    ,text: "" //发送文本
    ,html: "您需要的附件如下" //发送html代码
    ,attachments: event.attachments
  //   [
  //     {filename: event.name,
  //     path: event.path}
  //  ]
  }
  let res =  transporter.sendMail(mail);
  return res;
}