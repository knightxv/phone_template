import React from 'react';
import styled from 'styled-components';
import { payType } from '../extends/Enum';

const sourceMap = {
  [payType.WECHAT]: require('../assets/wx.png'),
  [payType.ALI]: require('../assets/zfb.png'),
  [payType.YLZF]: require('../assets/yinlian.png'),
  // [payType.IOS_PAY]: require(),
  [payType.MANAGE]: require('../assets/zjzz.png'),
  [payType.BALANCE]: require('../assets/yezf.png'),
  [payType.returnDirection]: require('../assets/zjzz.png'),
};

const PayIconImg = styled.img`
  width: .45rem;
  height: .45rem;
  display: inline-block;
  margin: 0 .1rem;
`;

const PayIcon = (props) => {
  const { payType: type } = props;
  return (<PayIconImg src={sourceMap[type]} />);
};

PayIcon.propTypes = {
};

export default PayIcon;
