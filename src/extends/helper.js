export const parseFloatMoney = (money) => {
  if (isNaN(money)) {
    return '';
  }
  return parseFloat(money / 100).toFixed(2);
};

export const parseIntMoney = (money) => {
  if (isNaN(money)) {
    return '';
  }
  return parseInt(money / 100);
};
export const transMoenyUnit = (count) => {
  if (isNaN(count)) {
    return '';
  }
  const transCount = count.toString();
  if (transCount.length === 4) {
    return `${parseFloat(transCount / 1000)}千`;
  } else if (transCount.length > 4) {
    return `${parseFloat(transCount / 10000)}万`;
  }
  return transCount;
};
export const transCountUnit = (count) => {
  if (isNaN(count)) {
    return '';
  }
  const transCount = count.toString();
  if (transCount.length === 4) {
    return `${parseFloat(transCount / 1000)}千`;
  } else if (transCount.length > 4) {
    return `${parseFloat(transCount / 10000)}万`;
  }
  return transCount;
};

// 兼容旧版本
const isWeixinBrowser = () => {
  return /micromessenger/.test(window.navigator.userAgent.toLowerCase());
};
export const isWechat = isWeixinBrowser();

export default exports;
