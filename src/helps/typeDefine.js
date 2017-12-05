export const Role = {
  AGENT: 'agent',
  PLAYER: 'player',
};

export const AgentType = {
  TRAINEE: 0,
  FORMAL: 1,
};

export const payType = {
  WECAHT: 0,
  ALI: 1,
  BALANCE: 2,
};
export const payTypeLabel = {
  [payType.WECAHT]: '微信',
  [payType.ALI]: '支付宝',
  [payType.BALANCE]: '余额支付',
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
