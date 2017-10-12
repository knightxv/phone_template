
export default {
    // 本地用
    'GET /config': {
        JavaWebPublicServerUrl: '192.168.2.108:8080', // 192.168.1.108:8080
    },

    // /*
    //     备注：返回的图片要是完成路径或者域名底下的相对路径 eg: /public/picture/banner-1.jpg
    //  */
    // /*
    //     轮播的图片
    //  */
    // 'GET /gamePlatform/navbarSwiperList': [
    //     {
    //         gameId: 23,
    //         gamePicture: '/picture/banner-1.jpg'
    //     },
    //     {
    //         gameId: 23,
    //         gamePicture: '/picture/banner-1.jpg'
    //     },
    //     {
    //         gameId: 23,
    //         gamePicture: '/picture/banner-1.jpg'
    //     },
    //     {
    //         gameId: 23,
    //         gamePicture: '/picture/banner-1.jpg'
    //     }
    // ],
    // /*
    //     推荐游戏
    //  */
    // 'GET /gamePlatform/gameRecommendList': [
    //     {
    //         gameIcon: '/picture/icon.png',
    //         gameName: '阿当比鸡',
    //         gameStar: 5,
    //         gameSize: '35.5M',
    //         gameStatu: '阿当比鸡玩的刺激d！',
    //         gameId: 23
    //     },
    // ],
    // /*
    //     得到游戏详情
    //     gameId
    // */
    // 'GET /gamePlatform/gameDetailInfo': {
    //     gameName: '阿当比鸡',
    //     gameIcon: '/picture/icon.png',
    //     downAndroid: 'https://fir.im/ns3t', // 游戏第三方下载链接
    //     downIos: 'https://itunes.apple.com/us/app/小吆湖南棋牌-湖南特色玩法-多种玩法集合/id1220747741', // ios的下载链接
    //     reserve: 'http://cdn.xiaoyaogame.cn/apk/com.tencent.tmgp.xyhnqpg0322.apk_1.2.apk', // android下载包
    //     gameSize: '39.5M',
    //     downCount: '5万次',
    //     gameVersion: '11.3.0',
    //     gameStar: 5,
    //     gameIntroduce: '游戏介绍',
    //     characteristic: '新版特性',
    //     publicDataTime: 1507531145366, // 发布日期
    //     developer: '厦门当当猫网络科技有限公司', // 开发者
    //     gameScreenshot: [
    //         '/detail/picture/hnqp-banner01.jpg',
    //         '/detail/picture/hnqp-banner02.jpg',
    //         '/detail/picture/hnqp-banner03.jpg',
    //         '/detail/picture/hnqp-banner04.jpg'
    //     ] // 游戏截图
    // },

    /*
        总管理登录
        loginID
        password
    */
    'GET /spreadApi/general/login': {
        status: 'success',
        Msg: '',
        data: null,
    },
     /*
        总管理登出
    */
    'GET /spreadApi/general/logout': {
        status: 'success',
        Msg: '',
        data: null,
    },

    'GET /spreadApi/getVerifyCode': {
        status: 'success',
        Msg: '',
        data: null,
    },

    /*
        获取用户数据
    */
    'GET /spreadApi/general/getUserInfo': {
        status: 'success',
        Msg: '',
        data: {
            
            // cashCountlog: 0, // 已提成（文档没要求）
            canCashCount: 0, // 余额（元）
            proxyid: 2, // 代理id
            inviteCode: 132032, // 邀请码
            
            commissionRate: 15, // 当前提成比例
            prizeByExtension: 500, // 推广人数奖励(元)
            openDay: 10, // 开通天数
            commissionByAgent: 2, // 代理充值提成（元）
            commissionOfToday: 0, // 今日提成（元）
            commissionOfYesterDay: 0, // 昨日提成（元）

            wechat_acc: 'wechatCode', // 提现所用的微信号
            positionName: '福建省 泉州市', // 位置
            cardNumber: '23fdgfd', // 银行卡号
            bankCardName: 'dsfsd', // 银行卡名字
            bankName: '工商银行', // 银行
            bankOfDeposit: 'fdsf', // 开户银行
        },
    },



    /*
        (代理页面)控制首页的显示和隐藏
        @ query : type : 1 奖励页面 2 代理公告 3 总代理公告
    */
    'GET /ddm/phone/api/getHtmlText': {
        status: 'success',
        Msg: '',
        data: {
        htmlText: '介绍代理有奖励：在申请代理时介绍人邀请码填写您的邀请码， 您将获得该代理永久充值10%钻石石奖励！详询美女客服5200', // 公告信息
        },
    },

    /*
        提成记录
    */
    'GET /spreadApi/general/commissionRecord': {
        status: 'success',
        Msg: '',
        data: [
            {
                agentName: '代理名', // 代理名
                agentCode: 123320, // 代理邀请码
                commissionCount: 34, // 提成金额
                agentRechargeTime: 0, // 代理充值时间
            },
        ]
    },

    /*
        余额提现记录
    */
    'GET /spreadApi/general/cashRecord': {
        status: 'success',
        Msg: '',
        data: [
            {
                createTime: 1504527287992, //提取时间（时间戳）
                cashCount: 34, // 提现金额
                result: 0, // 0待审核 1已通过 2已拒绝
            },
            {
                createTime: 1506498557344, //提取时间（时间戳）
                cashCount: 34, // 提现金额
                result: 0, // 0待审核 1已通过 2已拒绝
            },
        ]
    },

    /*
    我的下级代理
  */
  'GET /spreadApi/general/myUnderAgents': {
    status: 'success',
    Msg: '',
    data: [
        {
            underAgentName: 'fdff', // 下级代理名称
            agentInviteCode: '124355', // 代理商邀请码
            allRechargeCount: 334, // 总充值数
            rechargeCountOfToday: 43, // 今日的充值数
            CommissionOfAll: 434, //总提成金额
            CommissionOfToday: 23, // 今日提成金额
        },
    ]
  },

  /*
    修改代理密码
    @query : oldPsd : 旧密码
    @query : newPsd : 新密码
  */
  'GET /spreadApi/general/editPassword': {
    status: 'success',
    Msg: '',
    data: null
  },

  /*
    提现金额
    @query : cashCount 提现金额
    @query : userName 开户姓名
    @query : cardNumber : 开户卡号
    @query : bankName : 银行名字
    @query : bankOfDeposit : 银行开户行
    @qeury : positionName : 市级地点名字
    @query : wechatNumber : 微信名 
  */
  'GET /spreadApi/general/cash': {
    status: 'success',
    Msg: '',
    data: null
  },

    /*
        注册
        @query : phone : 电话号码
        @query : pCode ： 上级邀请码
        @query : wechatCode : 微信号码
        @query : verifyCode : 验证码
        @query : registerProvince : 微信号码
        @query : registerCity : 验证码
    */
    'GET /spreadApi/register': {
        status: 'success',
        Msg: '',
        data: null
    },

    /*
        通过id得到用户邀请码
        @query: id
    */
    'GET /spreadApi/getinveteCodeById': {
        status: 'success',
        Msg: '',
        data: {
            pCode: '1', // 用户邀请码
        }
    },



















/*
    登录
    @query : loginID
    @query : password
   */
  'GET /spreadApi/login': {
    status: 'success',
    Msg: '',
    data: {}
},
/*
获取个人信息
*/
'GET /spreadApi/getUserInfo': {
    status: 'success',
    Msg: '',
    data: {
      bankCardName: null,
      bankName: null,
      bankOfDeposit: null,
      canCashCount: 0,
      cardNumber: null,
      cashCountlog: 0,
      inviteCode: null,
      masonry: 0,
      positionName: null,
      proxyid: 2,
      rechargeOfToday: 0,
      rechargeOfYesterDay: 0,
      ranking: 3,
    }
},
/*
会员充值记录
*/
'GET /spreadApi/rechargeRecordOfMenber': {
    status: 'success',
    Msg: '',
    data: [
        {
            heroID: '12', // 玩家id
            diamond: 123, // 充值数量
            timeTick: 4734, //充值的时间戳
        }
    ]
},
/*
得到商品列表
*/
'GET /spreadApi/getMasonryGoods': {
status: 'success',
Msg: '',
data: [
    {
        shopId: 1, // 商品的id，暂时只有 1~6用于对应商品图片
        goodsInfo: '5000个砖石售价300元',
        goodsIco: '', // 
    }
]
},
/*
代理充值
@query : goodsId
*/
'GET /spreadApi/recharge': {
status: 'success',
Msg: '',
data: null
},
/*
余额充值
@query : goodsId
*/
'GET /spreadApi/balanceRecharge': {
status: 'success',
Msg: '',
data: null
},
/*
代理充值记录
*/
'GET /spreadApi/underAgentsChargeLog': {
status: 'success',
Msg: '',
data: [
    {
        agentName: '代理名称',
        rechargeCount: '343', // 充值数量
        chargeMoney: '2323',
        rechargeTime: 1505107807359, // 充值时间，（时间戳）
    }
]
},
/*
提现金额
@query : cashCount 提现金额
@query : userName 开户姓名
@query : cardNumber : 开户卡号
@query : bankName : 银行名字
@query : bankOfDeposit : 银行开户行
@qeury : positionName : 市级地点名字
@query : wechatNumber : 微信名 
*/
'GET /spreadApi/cash': {
status: 'success',
Msg: '',
data: null
},

/*
余额提现记录
*/
'GET /spreadApi/cashRecord': {
status: 'success',
Msg: '',
data: [
  {
      id: 343, // 编号
      expressiveTime: 1504527287992, //提取时间（时间戳）
      cashType: 0, // 提现类型 0 :微信 1：支付宝
      cashCount: 34, // 提现金额
      result: 0, // 0待审核 1已通过 2已拒绝
  },
]
},
/*
我的下级代理
*/
'GET /spreadApi/myUnderAgents': {
status: 'success',
Msg: '',
data: [
    {
        underAgentName: 'fdff', // 下级代理名称
        agentInviteCode: '124355', // 代理邀请码
        allRechargeCount: 334, // 总充砖数
        rechargeCountOfToday: 43, // 今日的充砖数
        CommissionOfAll: 434, //总提成砖石
        CommissionOfToday: 23, // 今日提成砖石

    }
]
},

/*
修改代理密码
@query : oldPsd : 旧密码
@query : newPsd : 新密码
*/
'GET /spreadApi/editPassword': {
status: 'success',
Msg: '',
data: null
},

/*
通过id得到用户名
@query: heroID
*/
'GET /spreadApi/getPlayerInfoById': {
status: 'success',
Msg: '',
data: {
    userName: '用户名',
    avatar: '', // 头像
}
},
/*
通过金额得到钻石
@query : money
*/
'GET /spreadApi/getDiamondsByMoney': {
status: 'success',
Msg: '',
data: {
  diamond: '3434', //钻石数
}
},
/*
给玩家充值
@query : HeroID id
@query : money 充值数量
@chargeType  : 0微信 1支付宝
@serverID: 游戏的serverId
@query: pid: 代理id
*/
'GET /spreadApi/recharge_for_player': {
status: 'success',
Msg: '',
data: null
},
/*
给代理充值
@query : HeroID id
@query : money 充值数量
@type  : 0微信 1支付宝
*/
'GET /spreadApi/recharge': {
status: 'success',
Msg: '',
data: null
},

/*
通过id得到用户邀请码
@query: id
*/
'GET /spreadApi/getinveteCodeById': {
status: 'success',
Msg: '',
data: {
    pCode: '1', // 用户邀请码
}
},
/*
退出
*/
'GET /spreadApi/logout': {

},

// -----WEB2--------
/*
应用中心游戏列表
*/
'GET /ddm/phone/api/games': {
status: 'success',
Msg: '',
data: [
  {
    gameId: 'ddbj', // 游戏id
    gameIcon: 'http://www.900.com/13z.jpg', // 游戏图标链接
    gameName: '当当比鸡',
    start: 5, // 5星评价
    gameInfo: '当当比鸡微信/QQ客服：336767', // 游戏信息
  }
]
},

/*
@query : gameId
*/
'GET /ddm/phone/api/gamesList': {
status: 'success',
Msg: '',
data: {
  start: 5, // 5星评价
  gameName: '当当比鸡',
  gameInfo: '当当比鸡微信/QQ客服：336767',
  applyTipInfo: '小伙伴们，成为代理邀请好友，可获得充值提成呦！',
  iosShopDownLink: 'http://baidu.com', // ios苹果id
  androidDownLink: 'http://baidu.com', // 安卓下载链接
  iosDownLink: 'http://baidu.com',
  gameIcon: 'http://www.900.com/13z.jpg',
  gameId: 'ddbj',
}
},

/*
(代理页面)控制首页的显示和隐藏
@ query : type : 1 奖励页面 2 代理公告 3 总代理公告
*/
'GET /ddm/phone/api/getHtmlText': {
status: 'success',
Msg: '',
data: {
  htmlText: 'hehe', // 公告信息
},
},


};
