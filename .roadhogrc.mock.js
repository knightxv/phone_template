export default {
    // 本地用
    'GET /config' : {
        JavaWebPublicServerUrl: '192.168.2.101:8000', // 192.168.2.66:8080 120.77.87.4:8080
    },

    /*
        总管理登录
        @query : loginID
        @qyeru : password
        @query : registerProvince : 注册省份
        @query : registerCity : 注册城市
    */
    'GET /spreadApi/general/login' : {
        status: 'success',
        Msg: '',
        data: null
    },
    /*
        总管理登出
    */
    'GET /spreadApi/general/logout' : {
        status: 'success',
        Msg: '',
        data: null
    },

    'GET /spreadApi/getVerifyCode' : {
        status: 'success',
        Msg: '',
        data: null
    },

    /*
        获取用户数据
    */
    'GET /spreadApi/general/getUserInfo' : {
        status: 'success',
        Msg: '',
        data: {

            // cashCountlog: 0, // 已提成（文档没要求）
            canCashCount: 0, // 账户余额（元）（保留2位小数）
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
            bankName: '招商银行', // 银行
            bankOfDeposit: 'fdsf', // 开户银行
        }
    },
    /*
        提成记录
    */
    'GET /spreadApi/general/commissionRecord' : {
        status: 'success',
        Msg: '',
        data: [
            {
                agentName: '代理名', // 代理名
                agentCode: 123320, // 代理邀请码
                commissionCount: 34, // 提成金额
                agentRechargeTime: 0, // 代理充值时间
            }
        ]
    },

    /*
        余额提现记录
    */
    'GET /spreadApi/general/cashRecord' : {
        status: 'success',
        Msg: '',
        data: [
            {
                createTime: 1504527287992, //提取时间（时间戳）
                cashCount: 34, // 提现金额
                result: 0, // 0待审核 1已通过 2已拒绝
            }, {
                createTime: 1506498557344, //提取时间（时间戳）
                cashCount: 34, // 提现金额
                result: 0, // 0待审核 1已通过 2已拒绝
            }
        ]
    },

    /*
    我的下级代理
  */
    'GET /spreadApi/general/myUnderAgents' : {
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
            }
        ]
    },
    

    /*
        修改代理密码
        @query : oldPsd : 旧密码
        @query : newPsd : 新密码
    */
    'GET /spreadApi/general/editPassword' : {
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
    'GET /spreadApi/general/cash' : {
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
        @query : registerProvince : 注册省份
        @query : registerCity : 注册城市
    */
    'GET /spreadApi/register' : {
        status: 'success',
        Msg: '',
        data: null
    },

    /*
        通过id得到用户邀请码
        @query: id
    */
    'GET /spreadApi/getinveteCodeById' : {
        status: 'success',
        Msg: '',
        data: {
            pCode: '1', // 用户邀请码
        }
    },

    /*
    代理登录
    @query : loginID
    @qyeru : password
    @query : registerProvince : 注册省份
    @query : registerCity : 注册城市
   */
    'GET /spreadApi/login' : {
        status: 'success',
        Msg: '',
        data: {}
    },
    
    /*
会员充值记录
*/
    'GET /spreadApi/rechargeRecordOfMenber' : {
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
    'GET /spreadApi/getMasonryGoods' : {
        status: 'success',
        Msg: '',
        data: [
            {
                shopId: 1, // 商品的id
                goodsMoney: '100000', // 商品金额
                masonryCount: '10000', // 钻石个数
                statu: 1, // 状态
                tip: '推荐新代理,88开运'
            },
        ]
    },
    /*
        代理充值
        @query : goodsId
        @query : chargeType (1微信，2支付宝)
    */
    'GET /spreadApi/recharge' : {
        status: 'success',
        Msg: '',
        data: {
            chargeURL: 'www.baidu.com',
        }
    },
    /*
        余额充值
        @query : goodsId
    */
    'GET /spreadApi/balanceRecharge' : {
        status: 'success',
        Msg: '',
        data: null
    },
    /*
        购钻明细
        page: 0,
        size: 10,
    */
    'GET /spreadApi/diamondsDetail' : {
        status: 'success',
        Msg: '',
        data: [
            {
                chargeTime: 1508480231603, // 购买的时间
                chargeCount: 300, // 购买的数量`
                chargeMoney: 30,
            },
            {
                chargeTime: 1508480231603, // 购买的时间
                chargeCount: 300, // 购买的数量`
                chargeMoney: 30,
            },
        ]
    },
    
    /*
    代理充值记录
    */
    'GET /spreadApi/underAgentsChargeLog' : {
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
    'GET /spreadApi/cash' : {
        status: 'success',
        Msg: '',
        data: null
    },

    /*
	余额提现记录
	*/
    'GET /spreadApi/cashRecord' : {
        status: 'success',
        Msg: '',
        data: [
            {
                id: 343, // 编号
                createTime: 1504527287992, //提取时间（时间戳）
                cashType: 0, // 提现类型 0 :微信 1：支付宝
                cashCount: 34, // 提现金额
                result: 2, // 0待审核 1已通过 2已拒绝
            }
        ]
    },
    /*
    	钻石交易明细
    	monthTime: 2343242
    	type : 0(玩家购钻), 1(代理购钻) 2（代理反钻）, 3（系统调整）, 4（邀请奖励）, 5（提现）（all不传type）
     */
    'GET /spreadApi/getMasonryRecord' : {
    	status: 'success',
        Msg: '',
        data: [
            {
            	title: '购买[2300钻石 售价175元]',
            	TranAmount: 55, // 交易个数
            	tranTime: 4574835, // 交易时间
            },
        ]
    },
    /*
        余额交易明细
        monthTime: 2343242
    	type : 0(玩家购钻), 1(代理购钻) 2（代理反钻）, 3（系统调整）, 4（邀请奖励）, 5（提现）（all不传type）
     */
    'GET /spreadApi/getBalanceRecord' : {
    	status: 'success',
        Msg: '',
        data: [
            {
            	title: '购买[2300钻石 售价175元]',
            	TranAmount: -5500, // 交易金额
            	tranTime: 1508465568441, // 交易时间
            },
        ]
    },
    

    /*
修改代理密码
@query : oldPsd : 旧密码
@query : newPsd : 新密码
*/
    'GET /spreadApi/editPassword' : {
        status: 'success',
        Msg: '',
        data: null
    },

   
    /*
        通过金额得到钻石
        @query : money
    */
    'GET /spreadApi/getDiamondsByMoney' : {
        status: 'success',
        Msg: '',
        data: {
            diamond: '3434', //钻石数
        }
    },
    /*
        给玩家充值
        @query : HeroID id
        @query : money 充值钱
        @chargeType  : --
        @serverid: 游戏的serverid
        @query: pid: 代理id
    */
    'GET /spreadApi/recharge_for_player' : {
        status: 'success',
        Msg: '',
        data: {
            chargeURL: '', // 支付后应该跳转的页面
        }
    },

    /*
通过id得到用户邀请码
@query: id
*/
    'GET /spreadApi/getinveteCodeById' : {
        status: 'success',
        Msg: '',
        data: {
            pCode: '1', // 用户邀请码
        }
    },
    /*
退出
*/
    'GET /spreadApi/logout' : {},

    // -----WEB2--------
    /*
应用中心游戏列表
*/
    'GET /ddm/phone/api/games' : {
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
    'GET /ddm/phone/api/gamesList' : {
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
            gameId: 'ddbj'
        }
    },

    


    /*已经添加到文档上的 */
    /*
        获取个人信息
     */
    'GET /spreadApi/getUserInfo' : {
        status: 'success',
        Msg: '',
        code: 2,
        data: {
            // saleDiamondsOfThisMonth:84651, // 本月销钻
            // myUnderAgentCount: 15, // 我的下级代理人数
            // myPlayerCount: 80, // 我的玩家人数
            // masonryIncomeToday: 0, // 今日钻石收入
            // masonryPayToday: 0, // 今日钻石支出
            // balanceIncomeToday: 0, // 今日余额收入
            // balancePayToday: 0, // 今日余额支出
            // canCashCount: 1000, // 未提现（余额）
            // cashCountlog: 0, // 已提现
            // inviteCode: '223344',
            // proxyid: 2,
            // masonry: 0, // 钻书数量
            // ranking: 3,
            // powerList: {
            //     1: null, 7: null, 15: null, 16: null, 17: null, 19: 0, 20: null, 21: null, 23: 0
            // },

            // bankCardName: null,
            // bankName: '建设银行',
            // bankOfDeposit: null,
            // cardNumber: null,
            // positionName: '',

            // rechargeOfToday: 0,
            // rechargeOfYesterDay: 0,
        }
    },
    'GET /spreadApi/getGameList': {
        "status":"success",
        "Msg":"",
        "data":[
            {
                "serverid":"43",
                "gameName":"当当比鸡",
                "gameIcon":"http://120.55.57.25:8080/wresource/gameimgs/c2a6776a28324722a9ca78c6279d747c.jpg",
                "gameNumber":15
            },
        ]
    },
    /*
        我的玩家
    */
    'GET /spreadApi/myPlayers' : {
        status: 'success',
        Msg: '',
        data: [
            {
                playerName: '昵称',
                playerId: '123456',
                recentlyLoginTime: 1510307559161,
                palyCashCount: 3430, // 玩家消费
                masonrySurplus: 343, // 剩余钻石
            },
            {
                playerName: '昵称2',
                playerId: '172256',
                recentlyLoginTime: 1510729414280,
                palyCashCount: 3430, // 玩家消费
                masonrySurplus: 34233, // 剩余钻石
            },
        ]
    },
    /*
        赠送钻石
        params：	serverid
        params：	pid
        params：	HeroID
        params：	diamond
    */
    'GET /spreadApi/giveDiamond' : {
        status: 'success',
        Msg: '',
        data: {

        }
    },
    /*
        总代理给代理充值
    */
    'GET /spreadApi/general/giveDiamond': {
        status: 'success',
        Msg: '',
        data: {

        }
    },
     /*
        通过id得到用户名
        @params: heroID
        @params: serverid
    */
    'GET /spreadApi/getPlayerInfoById' : {
        status: 'success',
        Msg: '',
        data: {
            userName: '用户名',
            avatar: '', // 头像
        }
    },
    /*
        收藏玩家
        @params: playerId
    */
    'GET /spreadApi/savePlayer': {
        status: 'success',
        Msg: '',
        data: {
        	
        }
    },
    /* 我收藏的玩家 */
    'GET /spreadApi/mySavePlayer': {
        "status":"success",
        "Msg":"",
        "data":[
            {
                "playerName":"昵称",
                "playerId":"123456",
                "recentlyLoginTime":1510307559161,
                "palyCashCount":3430,
                "masonrySurplus":343
            }
        ]
    },
     /*
        取消收藏
        @params: playerId
    */
    'GET /spreadApi/cancelSavePlayer': {
        status: 'success',
        Msg: '',
        data: {

        }
    },
    /*
        获取平台信息
    */
    'GET /spreadApi/getPlatformInfo': {
        status: 'success',
        Msg: '',
        data: {
            gameName: '阿当比鸡21',
            companyName: '当当猫科技',
            iconLogo: 'data:image/png;base64,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',
            invitePlayLink: 'http://baidu.com',
            inviteAgentBg: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3178721701,1305975012&fm=27&gp=0.jpg',
        }
    },

    /*
(代理页面)控制首页的显示和隐藏
@ query : type : 1 奖励页面 2 代理公告 3 总代理公告
*/
    'GET /ddm/phone/api/getHtmlText' : {
        status: 'success',
        Msg: '',
        data: {
            htmlText: 'ss', // 公告信息
        }
    },
    // 我收藏的代理
    'GET /spreadApi/mySaveAgent': {
        status: 'success',
        Msg: '',
        data: [
            {
                agentInviteCode: 232,
                recentlyLoginTime: 1510307559161,
                masonrySurplus: 343, // 剩余钻石
            }
        ]
    },
    /*
		我的下级代理
	*/
    'GET /spreadApi/myUnderAgents' : {
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
		我的下级代理_囤卡模式
	*/
    'GET /spreadApi/transfer/myUnderAgents' : {
        status: 'success',
        Msg: '',
        data: [
            {
                agentInviteCode: 232,
                recentlyLoginTime: 1510307559161,
                masonrySurplus: 343, // 剩余钻石
            }
        ]
    },
    'GET /spreadApi/getAgentInfoByInviteCode': {
        status: 'success',
        Msg: '',
        data: {
            
        }
    }
    
};
