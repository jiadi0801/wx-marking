// pages/ld-cropper/ld-cropper.js
// 手机的宽度
var windowWRPX = 750
// 拖动时候的 pageX
var pageX = 0
// 拖动时候的 pageY
var pageY = 0
// 像素比
var pixelRatio = windowWRPX / wx.getSystemInfoSync().screenWidth;
// 方框实际像素
var boxRealPx = 640

var prevDistance = 0;
var x0,y0,x1,y1;

const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pixelRatio,
    boxLeft: 55,
    boxTop: 55,
    boxWidth: 640,  // 盒的屏幕像素宽
    boxHeight: 640,
    cropperW: 750,
    cropperH: 750,

    // 图像缩放
    originScale: 1,
    imgOriginWidth: 1,
    imgOriginHeight: 1,
    imgWidth: 1,  // 图片的屏幕像素
    imgHeight: 1,

    cutPosX: 0,
    cutPosY: 0,

    wxLocalSrc: '', // 下载到本地的微信头像
    imgSrc: '',  // 头像
    tagSrc: '',  // 角标
    genSrc: '',  // 生成图片

    userInfo: {},
    biaoimg:[
      "../../images/1.png",
      "../../images/2.png",
      "../../images/3.png",
      "../../images/5.png",
      "../../images/4.png",
      "../../images/6.png",
      "../../images/7.png",
      "../../images/8.png",
      "../../images/9.png",
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

  chosethis({currentTarget}) {
    this.setData({
      tagSrc: this.data.biaoimg[currentTarget.dataset.index]
    });
  },

  disMove() {},

  chosePic() {
    wx.chooseImage({
      count: 1,
      success: res => {
        this.setData({
          imgSrc: res.tempFilePaths[0],
        });
        this.getImgInfo(res.tempFilePaths[0]);
      }
    })
  },

  getImgInfo(imgUrl) {
    wx.getImageInfo({
      src: imgUrl,
      success: res => {
        let {width, height} = res;
        let whratio = width / height;
        if (width < this.data.boxWidth || height < this.data.boxHeight) {
          if (height < width) {
            this.setData({
              imgOriginWidth: this.data.boxWidth,
              imgOriginHeight: this.data.boxWidth * whratio,
              imgHeight: this.data.boxWidth,
              imgWidth: this.data.boxWidth * whratio,
            });
          } else {
            this.setData({
              imgOriginWidth: this.data.boxWidth,
              imgOriginHeight: this.data.boxWidth / whratio,
              imgWidth: this.data.boxWidth,
              imgHeight: this.data.boxWidth / whratio,
            });
          }
        } else {
          this.setData({
            imgOriginWidth: width,
            imgOriginHeight: height,
            imgWidth: width,
            imgHeight: height,
          });
        }
      }
    });
  },

  contentStartMove({touches}) {
    if (touches.length !== 2) return;
    x0 = touches[0].pageX;
    y0 = touches[0].pageY;
    x1 = touches[1].pageX;
    y1 = touches[1].pageY;
    prevDistance = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
  },
  contentMoving({touches}) {
    if (touches.length !== 2) return;
    x0 = touches[0].pageX;
    y0 = touches[0].pageY;
    x1 = touches[1].pageX;
    y1 = touches[1].pageY;

    const distance = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
    const ratio = (1 + (distance - prevDistance) * 0.003);

    const {imgWidth, imgHeight} = this.data;
    const width = imgWidth * ratio;
    const height = imgHeight * ratio;

    // 1:1 没bug， 其他 有bug
    if (height < this.data.boxHeight || width < this.data.boxWidth) {
      const whratio = this.data.imgOriginWidth / this.data.imgOriginHeight;
      if (height < width) {
        this.setData({
          imgHeight: this.data.boxWidth,
          imgWidth: this.data.boxWidth * whratio,
        });
      } else {
        this.setData({
          imgWidth: this.data.boxWidth,
          imgHeight: this.data.boxWidth / whratio,
        });
      }
      return;
    }
    this.setData({
      imgHeight: height,
      imgWidth: width,
    });
    prevDistance = distance;
  },

  onGen() {
    if (!this.data.imgSrc) {
      wx.showToast({
        title: '请选择头像'
      });
      return;
    }
    if (!this.data.tagSrc) {
      wx.showToast({
        title: '请选择角标'
      });
      return;
    }
    wx.showLoading({
      title: '正在生成'
    });
    wx.createSelectorQuery().select('#imgRect').boundingClientRect(rect => {
      this.setData({
        cutPosX: Math.abs(rect.left),
        cutPosY: Math.abs(rect.top),
      });
      this.generate();
    }).exec()
  },
  generate() {
    try {
      const ctx_A = wx.createCanvasContext('myCanvas_A');
      var baseWidth = this.data.imgWidth; //图片放大之后的宽
      var baseHeight = this.data.imgHeight; //图片放大之后的高
      ctx_A.drawImage(this.data.imgSrc, -this.data.cutPosX*this.data.pixelRatio, -this.data.cutPosY*this.data.pixelRatio, baseWidth, baseHeight);//我们要在canvas中画一张和放大之后的图片宽高一样的图片
      ctx_A.drawImage(this.data.tagSrc, 0, 0, this.data.boxWidth, this.data.boxHeight);//我们要在canvas中画一张和放大之后的图片宽高一样的图片
      ctx_A.draw(false, () => {
        wx.hideLoading();
        wx.canvasToTempFilePath({ //调用方法，开始截取
          x: 0,
          y: 0,
          width: this.data.boxWidth,
          height: this.data.boxHeight,
          destWidth: this.data.boxWidth,
          destHeight: this.data.boxHeight,
          canvasId: 'myCanvas_A',
          success: res => {
            wx.hideLoading();
            const tmpPath = res.tempFilePath;
            wx.saveImageToPhotosAlbum({
              filePath: tmpPath,
              success: res => {
                wx.showToast({
                  title: '生成成功'
                });
                wx.previewImage({
                    urls: [tmpPath]
                });
              },
              fail: err => {
                console.log(err);
              }
            })
            this.setData({
              genSrc: res.tempFilePath
            });
          },
          fail: err => {
            console.log(err);
            wx.hideLoading();
          }
        })
      });
    } catch (e) {
      console.log(e)
    }
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
    if (!app.globalData.userInfo) return;
    console.log(app.globalData.userInfo)
    this.setData({
      userInfo: app.globalData.userInfo || {},
    });

    if (this.data.wxLocalSrc) return;

    let avatarUrl = app.globalData.userInfo.avatarUrl.replace(/132/, '0');
    wx.downloadFile({
      url: avatarUrl,
      success: res => {
        console.log(res.tempFilePath);
        this.setData({
          wxLocalSrc: res.tempFilePath,
          imgSrc: res.tempFilePath,
        });
        this.getImgInfo(res.tempFilePath);
      }
    });
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
    return {
      title: '听说你会换头像？',
      imageUrl: 'https://img10.360buyimg.com/uba/jfs/t22567/88/33870292/39514/82a70213/5b235b76Nf0bc188b.jpg'
    }
  }
})
