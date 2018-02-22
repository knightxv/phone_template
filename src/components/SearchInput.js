import React from 'react';
import { Icon } from '@/components/lazyComponent/antd';
import styled from 'styled-components';

const InputWrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  background: #f2f2f2;
  border: 1px solid #f2f2f2;
  border-radius: 5px;
  padding: .05rem 0;
  width: 100%;

`;
const SearchIcon = styled(Icon)`
  margin: 0 .2rem 0 .1rem;
`;
const Input = styled.input`
  ouline: none;
  border: none;
  background: none;
  flex: 1;
  width: 100%;
  box-shadow: 0 0 0px 1000px #f2f2f2 inset;
`;

const SearchInput = (props) => {
  const { onChange } = props;
  return (<InputWrap>
    <SearchIcon color="#cbcbcb" type="search" />
    <Input {...props} onChange={e => onChange(e.target.value)} />
  </InputWrap>);
};

SearchInput.propTypes = {
};

export default SearchInput;
