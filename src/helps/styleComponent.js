import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { Icon } from './antdComponent';


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
exports.FlexRowBetweenWingSpace = styled(FlexRow)`
    justify-content: space-between;
    padding: 0 .2rem;
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
    padding: 8px 12px;
`;

exports.WhiteSpace = styled.div`
    height: .16rem;
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
  vertical-align: middle;
  margin: -2px 3px 0 0px;
`;

/*
    普通代理附加
*/
exports.NavTitle = styled.p`
padding: .2rem;
font-size: .5rem;
text-align: center;
`;

exports.NetImg = ({ ...props }) => {
  // const imgPrefix = window.httpConfig ? window.httpConfig.JavaWebPublicServerUrl : '';
  return (
      <img {...props} />
  );
};

exports.Avatar = ({ src, ...props }) => {
  // const imgPrefix = window.httpConfig ? window.httpConfig.JavaWebPublicServerUrl : '';
  return (
    <img
      src={require('../assets/avatar.png')}
      style={{ width: '.8rem', height: '.8rem', borderRadius: '50%' }}
      {...props}
    />
  );
};


const InputContainer = styled.div`
  background: #efeff4;
  border-box: border-box;
  padding: 0.2rem 0.2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const InputWrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  background: #fff;
  padding: 3px 0;
  border: 1px solid #dedede;
  border-radius: 0.2rem;
`;
const Input = styled.input`
  flex: 1;
  padding: 0.1rem 0rem 0.1rem 0.3rem;
  border: none;
  background: none;
`;
const CancelLabel = styled.div`
  padding-left: 0.2rem;
  color: #1e7df1;
`;

exports.SearchBar = ({ ...props, onCancelClick = () => {} }) => {
  return (
    <InputContainer>
      <InputWrap>
        <Input {...props} />
        {
          props.value &&
          (<Icon
            onClick={onCancelClick}
            type="cross-circle-o"
            size="xs"
            style={{ color: '#ccc', marginRight: '.2rem' }}
          />)
        }
      </InputWrap>
      <div>
        <Icon
          type="search"
          size="xs"
          style={{ color: '#bbb', marginLeft: '.2rem' }}
        />
      </div>
    </InputContainer>
  );
};

