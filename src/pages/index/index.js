//logs.js
const app = getApp();
Page({
  data: {
  },
  onGotUserInfo({detail}) {
    if (!detail.userInfo) {
      wx.showToast({
        title: '您拒绝了授权'
      });
    } else {
      app.globalData.userInfo = detail.userInfo;
      wx.navigateTo({
        url: '../ld-cropper/ld-cropper'
      });
    }
  },
  onLoad: function () {
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '听说你会换头像？',
      imageUrl: 'https://img10.360buyimg.com/uba/jfs/t22567/88/33870292/39514/82a70213/5b235b76Nf0bc188b.jpg'
    }
  }
})
