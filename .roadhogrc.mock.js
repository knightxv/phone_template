export default {
    // 本地用
    'GET /config' : {
        JavaWebPublicServerUrl: '192.168.2.101:8000', // 192.168.2.139:8080
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
            bankName: '工商银行', // 银行
            bankOfDeposit: 'fdsf', // 开户银行
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
            htmlText: '介绍代理有奖励：在申请代理时介绍人邀请码填写您的邀请码， 您将获得该代理永久充值10%钻石石奖励！详询美女客服5200', // 公告信息
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
        获取个人信息
     */
    'GET /spreadApi/getUserInfo' : {
        status: 'success',
        Msg: '',
        data: {
            saleDiamondsOfThisMonth:84651, // 本月销钻
            myUnderAgentCount: 15, // 我的下级代理人数
            myPlayerCount: 80, // 我的玩家人数
            masonryIncomeToday: 0, // 今日钻石收入
            masonryPayToday: 0, // 今日钻石支出
            balanceIncomeToday: 0, // 今日余额收入
            balancePayToday: 0, // 今日余额支出

            bankCardName: null,
            bankName: null,
            bankOfDeposit: null,
            canCashCount: 0,
            cardNumber: null,
            cashCountlog: 0,
            inviteCode: '223344',
            masonry: 0,
            positionName: null,
            proxyid: 2,
            rechargeOfToday: 0,
            rechargeOfYesterDay: 0,
            ranking: 3
        }
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
        @add(--)
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
        我的玩家
    */
    'GET /spreadApi/myPlayers' : {
        status: 'success',
        Msg: '',
        data: [
            {
                playerName: '昵称',
                playerId: '123456',
                palyCashCount: 3430, // 玩家消费
                masonrySurplus: 343, // 剩余钻石
            }
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
                expressiveTime: 1504527287992, //提取时间（时间戳）
                cashType: 0, // 提现类型 0 :微信 1：支付宝
                cashCount: 34, // 提现金额
                result: 0, // 0待审核 1已通过 2已拒绝
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
            	TranAmount: -55, // 交易金额
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
        通过id得到用户名
        @query: heroID
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
        @serverID: 游戏的serverId
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

    /*
(代理页面)控制首页的显示和隐藏
@ query : type : 1 奖励页面 2 代理公告 3 总代理公告
*/
    'GET /ddm/phone/api/getHtmlText' : {
        status: 'success',
        Msg: '',
        data: {
            htmlText: '介绍代理有奖励：在申请代理时介绍人邀请码填写您的邀请码， 您将获得该代理永久充值10%钻石石奖励！详询美女客服5200', // 公告信息
        }
    }
};
