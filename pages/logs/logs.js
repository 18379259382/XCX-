// register.js
var API_URL = "https://IP/wechat/insertUser.php";
var _app = getApp();
var util = require("../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    registBtnTxt: "注册",
    registBtnBgBgColor: "#318EE2",
    getSmsCodeBtnTxt: "获取验证码",
    getSmsCodeBtnColor: "#318EE2",
    // getSmsCodeBtnTime:60,
    btnLoading: false,
    registDisabled: false,
    smsCodeDisabled: false,
    inputUserName: '',
    inputPassword: '',
    phoneNum: ''

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

  },
  formSubmit: function (e) {
    var param = e.detail.value;
    this.mysubmit(param);
  },
  mysubmit: function (param) {
    var flag = this.checkUserName(param.username) && this.checkName(param) && this.checkSmsCode(param)
    var that = this;
    if (flag) {
      var nickname = getApp().globalData.userInfo.nickName;
      var gender = getApp().globalData.userInfo.gender;
      var province = getApp().globalData.userInfo.province;
      var phone = param.username.trim();
      var realname = param.name.trim();
      //提交服务器
      wx.login({
        success: function (res) {
          if (res.code) {
            var code = res.code;
            wx.request({
              url: API_URL,
              data: {
                nickname: nickname,
                gender: gender,
                province: province,
                phone: phone,
                realname: realname,
                js_code: code,
              },
              method: 'GET',
              header: {
                'content-type': 'application/json'
              }, // 设置请求的 header
              success: function (res) {
                // success
                that.setregistData1();
                console.log("JSON:" + res.data);
                setTimeout(function () {
                  wx.showToast({
                    title: res.data.msg + '',
                    icon: res.data.result == 1 ? 'success' : 'warn',
                    duration: 1500
                  });
                  that.setregistData2();
                  if (res.data.result == 1) {
                    getApp().globalData.userSign = 1;
                  }

                  wx.navigateBack({

                  })
                  //that.redirectTo(param);
                }, 2000);
              },
              fail: function () {
                that.setregistData1();
                setTimeout(function () {
                  wx.showToast({
                    title: '失败',
                    icon: 'warn',
                    duration: 1500
                  });
                  that.setregistData2()
                }, 2000);
              },
              complete: function () {
                // complete
              }
            })
          }
        }
      })


    }
  },
  getPhoneNum: function (e) {
    var value = e.detail.value;
    this.setData({
      phoneNum: value
    });
  },
  setregistData1: function () {
    this.setData({
      registBtnTxt: "注册中",
      registDisabled: !this.data.registDisabled,
      registBtnBgBgColor: "#999",
      btnLoading: !this.data.btnLoading
    });
  },
  setregistData2: function () {
    this.setData({
      registBtnTxt: "注册",
      registDisabled: !this.data.registDisabled,
      registBtnBgBgColor: "#318EE2",
      btnLoading: !this.data.btnLoading
    });
  },
  checkUserName: function (param) {
    var phone = util.regexConfig().phone;
    var inputUserName = param.trim();
    if (phone.test(inputUserName)) {
      return true;
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入正确的手机号码'
      });
      return false;
    }
  },
  checkName: function (param) {
    var userName = param.username.trim();
    var name = param.name.trim();
    if (name.length <= 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入姓名'
      });
      return false;
    } else {
      return true;
    }
  },
  getSmsCode: function () {

    var that = this;
    var count = 60;
   
      var si = setInterval(function () {
        if (count > 0) {
          count--;
          that.setData({
            getSmsCodeBtnTxt: count + ' s',

            smsCodeDisabled: true
          });
        } else {
          that.setData({
            getSmsCodeBtnTxt: "获取验证码",
    
            smsCodeDisabled: false
          });
          count = 60;
          clearInterval(si);
        }
      }, 1000);
    

  },
  checkSmsCode: function (param) {
    var smsCode = param.smsCode.trim();
    var tempSmsCode = '000000';//演示效果临时变量，正式开发需要通过wx.request获取
    if (smsCode != tempSmsCode) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入正确的短信验证码'
      });
      return false;
    } else {
      return true;
    }
  },
  redirectTo: function (param) {
    //需要将param转换为字符串
    param = JSON.stringify(param);
    wx.redirectTo({
      url: '../main/index?param=' + param//参数只能是字符串形式，不能为json对象
    })
  }
})