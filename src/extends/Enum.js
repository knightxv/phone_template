// 权限配置
export const powerEnum = {
  // agentGiveForPlayer: 1, // 开启玩家赠送权限
  // iAgentGiveForAgent: 2, // 开启总代理为下级代理充值权限
  // iAgentGiveForAnyAgent: 3, // 开启总代理为所有代理充值权限
  // playerSDKCharge: 4, // 开启玩家第三方充值
  // proxySDKCharge: 5, // 开启代理第三方充值
  // playerSave: 6, // 玩家收藏
  // myPlayer: 8, // 我的玩家
  // myAgent: 9, // 我的代理
  // agentSave: 10, // 收藏代理功能
  // iAgentGiveForUnderAgent: 12, // 我的下级代理(囤卡模式)
  banlance: 7, // 账户余额栏目
  AgentBuyDiawechatPay: 15, // 微信支付(代理购买钻石)
  AgentBuyDiaAliPay: 16, // 支付宝支付(代理购买钻石)
  AgentBuyDiabanlancePay: 17, // 余额支付(直接转钻)(代理购买钻石)

  AgentTurnDiaToPlayerDirect: 1, // 直接转卡(赠送)
  wechatPayForAgentTurnDiaToPlayer: 20, // 代理给玩家转钻（微信支付）
  AliPayForAgentTurnDiaToPlayer: 21, // 代理给玩家转钻（支付宝支付）

  iAgentTurnDiaToAgent: 23, // 总代理直接代理转钻
  playerRange: 19, // 0所有 1下级
  agentRange: 23, // 0所有 1下级
  underAgentPercentage: 25, // 查看下级代理抽成返钻比例
  stepRebate: 29,
};

export const Role = {
  AGENT: 'agent',
  PLAYER: 'player',
};

export const AgentType = {
  TRAINEE: 0,
  FORMAL: 1,
};

export const payType = {
  WECHAT: 0,
  ALI: 1,
  MANAGE: 4,
  BALANCE: 5,
  YLZF: 6, // 待确认
};
export const payTypeLabel = {
  [payType.WECHAT]: '微信',
  [payType.ALI]: '支付宝',
  [payType.MANAGE]: '和客服购买',
  [payType.BALANCE]: '使用余额购买',
  [payType.YLZF]: '银联支付',
};

export const resolveStatus = {
  waiting: 0, // 待审核
  pass: 1, // 已通过
  fail: 2, // 已拒绝
};
export const resolveStatusLabel = {
  [resolveStatus.waiting]: '待审核',
  [resolveStatus.pass]: '已通过',
  [resolveStatus.fail]: '已拒绝',
};

export const htmlTextType = {
  page_prizeExplain: 1, // 奖励页面
  notice_normalAgency: 2, // 代理公告
  notice_generalManage: 3, // 总代理公告
  agreen_page: 4, // 推广协议
};

export default exports;
