import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';


exports.Background = styled.div`
  font-size: 12px;
    background-color: #fff;
`;

exports.BackgroundContainer = styled.div`
    background-color: #fff;
`;

const FlexRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: ${props => props.type || 'flex-start'}
`;
exports.FlexRow = FlexRow;

exports.FlexRowBetween = styled(FlexRow)`
    justify-content: space-between;
`;
exports.FlexRowAround = styled(FlexRow)`
    justify-content: space-around;
`;

exports.BaseFont = styled.p`
    font-size: 16px;
    text-align: left;
    color: #4c4c4c;
    margin: 0;
    line-height: 1.5em;
`;

exports.NetImg = styled.img``;
exports.IconImg = styled.img``;

exports.Flex = styled.div`
    flex: 1;
    display: flex;
`;

exports.WingBlank = styled.div`
    padding: 8px 10px;
`;

exports.WhiteSpace = styled.div`
    height: 12px;
`;

export const Title = ({ children }) => {
  return (<Helmet>
    <meta charSet="utf-8" />
    <title>{ children }</title>
  </Helmet>
  );
};

// app self
export const TitleIcon = styled.span`
  width: 2px;
  height: 14px;
  background: #108ee9;
  display: inline-block;
  margin: 2px 3px 0 0px;
`;

/*
    普通代理附加
*/
exports.NavTitle = styled.p`
padding: .2rem;
font-size: .5rem;
text-align: center;
`;

