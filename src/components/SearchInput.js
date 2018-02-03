import React from 'react';
import { Icon } from '@/components/lazyComponent/antd';
import styled from 'styled-components';

const InputWrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  background: #fff;
  border: 1px solid #f2f2f2;
  border-radius: 5px;
  padding: .05rem 0;
`;
const SearchIcon = styled(Icon)`
  margin: 0 .2rem 0 .1rem;
`;
const Input = styled.input`
  ouline: none;
  border: none;
  background: none;
  width: 1rem;
`;

const SearchInput = (props) => {
  // const { } = props;
  return (<InputWrap>
    <SearchIcon type="search" />
    <Input {...props} />
  </InputWrap>);
};

SearchInput.propTypes = {
};

export default SearchInput;
