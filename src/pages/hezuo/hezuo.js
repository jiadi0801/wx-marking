//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    // 用户头像
    userInfoimg: '//img14.360buyimg.com/cms/jfs/t23863/203/35300054/215678/7557322e/5b234f70Ndd444df0.png'
  },
  showQRcode() {
    wx.previewImage({
      urls: ['http://img20.360buyimg.com/cms/jfs/t20608/2/1274206724/61254/717a1bb3/5b236336N62927c72.jpg'],
      fail: err => {
        console.log(err)
      }
    });
  },
  onLoad: function () {
  },
  onShow: function () {
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path: '/pages/index/index',
      title: '一起换个618头像，给京东618打call吧',
      imageUrl: 'https://img10.360buyimg.com/uba/jfs/t22567/88/33870292/39514/82a70213/5b235b76Nf0bc188b.jpg'
    }
  }
})
