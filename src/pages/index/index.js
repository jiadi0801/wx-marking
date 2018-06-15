//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    headeimgsrc:'',
    currentindex:0,
    biaoimg:[
      "//img11.360buyimg.com/cms/jfs/t19969/362/1652156696/29821/248f5672/5b226a92N01a24507.png",
      "//img11.360buyimg.com/cms/jfs/t21997/41/1214225598/40075/5f4e4253/5b226a99N7478642b.png",
      "//img20.360buyimg.com/cms/jfs/t21643/24/1211538028/46855/7357ac12/5b227eb8N4ac8a3c2.png",
      "//img10.360buyimg.com/cms/jfs/t22912/322/9523523/87612/5902da12/5b226adaN776f92d1.png",
      "//img20.360buyimg.com/cms/jfs/t22291/137/1221077087/103382/fb5b41f0/5b226ae0N14d4fdd2.png",
      "//img30.360buyimg.com/cms/jfs/t20317/82/1218209974/215678/7557322e/5b226aecN9eb37f98.png",
      "//img30.360buyimg.com/cms/jfs/t20470/160/1208457540/203572/5932f68d/5b226b1dNff5808c5.png",
      "//img30.360buyimg.com/cms/jfs/t19987/145/1642640210/250877/6e8492b9/5b226b24N9b8fdbb6.png",
      "//img30.360buyimg.com/cms/jfs/t23185/26/10733535/69094/e784b716/5b226b29Naa4bb037.png"
    ],
    bottomimg:[
      "//img12.360buyimg.com/cms/jfs/t21640/28/1213004791/32137/61b7449b/5b228246N3619a7da.png",
      "//img14.360buyimg.com/cms/jfs/t21424/251/1233285981/33140/a1d5af36/5b228287N5f759965.png",
      "//img11.360buyimg.com/cms/jfs/t23398/35/12468599/34174/d1582c04/5b228299Ne06e58fc.png",
      "//img11.360buyimg.com/cms/jfs/t20116/105/1639329796/36168/8018c9c7/5b2282aaN22d909c6.png",
      "//img11.360buyimg.com/cms/jfs/t24175/81/11384076/36585/7f513a20/5b2282c0Nf076578b.png",
      "//img12.360buyimg.com/cms/jfs/t20791/276/1236354733/34605/5f3b6693/5b2282f3Nceb0c288.png",
      "//img10.360buyimg.com/cms/jfs/t23044/122/12079695/33301/19d0bbd5/5b2282deNcefaf6c3.png",
      "//img14.360buyimg.com/cms/jfs/t24484/156/14583120/39476/db0444c9/5b228303N6d1def01.png",
      "//img20.360buyimg.com/cms/jfs/t20593/195/1232200622/29797/dae042e4/5b228312N580974fc.png"
    ]
  },
  onLoad: function () {
    // 查看是否授权
    let that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              that.setData({
                userInfo: res.userInfo,
                headeimgsrc: res.userInfo.avatarUrl.replace(/132/, "0")
              })
            }
          })
        }
      }
    })
  },
  changeimg: function (event) {
    console.log(event);
    this.setData({
      currentindex: event.currentTarget.id
    })
  }
})
