// pages/ld-cropper/ld-cropper.js
// 手机的宽度
var windowWRPX = 750
// 拖动时候的 pageX
var pageX = 0
// 拖动时候的 pageY
var pageY = 0
// 像素比
var pixelRatio = wx.getSystemInfoSync().pixelRatio
console.log(pixelRatio)
// 方框实际像素
var boxRealPx = 640

var prevDistance = 0;
var x0,y0,x1,y1;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    boxLeft: 55,
    boxTop: 55,
    boxWidth: 640,  // 盒的屏幕像素宽
    boxHeight: 640,
    cropperW: 750,
    cropperH: 750,

    // 图像缩放
    originScale: 1,
    imgOriginWidth: 750,
    imgOriginHeight: 1179,
    imgWidth: 1500,  // 图片的屏幕像素
    imgHeight: 2358,

    cutPosX: 0,
    cutPosY: 0,

    imgSrc: '../../assets/images/welcome.jpg',
    tagSrc: '',
    genSrc: '',

    tagList: ['./tags/6.png', './tags/7.png'],
  },

  chosethis({currentTarget}) {
    this.setData({
      tagSrc: this.data.tagList[currentTarget.dataset.index]
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
        wx.getImageInfo({
          src: res.tempFilePaths[0],
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
      }
    })
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
    wx.showLoading({
      title: '正在生成'
    });
    wx.createSelectorQuery().select('#imgRect').boundingClientRect(rect => {
      console.log(rect);
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
      ctx_A.drawImage(this.data.imgSrc, -this.data.cutPosX, -this.data.cutPosY, baseWidth/pixelRatio, baseHeight/pixelRatio);//我们要在canvas中画一张和放大之后的图片宽高一样的图片
      ctx_A.drawImage(this.data.tagSrc, 0, 0, this.data.boxWidth/pixelRatio, this.data.boxHeight/pixelRatio);//我们要在canvas中画一张和放大之后的图片宽高一样的图片
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
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: res=>{
                wx.showModal({
                  title: '生成成功',
                  content: '生成成功，去相册看看吧',
                })
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

  }
})
