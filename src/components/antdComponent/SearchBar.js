import InputItem from './InputItem';
import styled from 'styled-components';
import Icon from './Icon';

const InputContainer = styled.div`
background: #efeff4;
box-sizing: border-box;
padding: 0.1rem 0.2rem;
background: #f2f2f2;
`;
const InputWrap = styled.div`
flex: 1;
background: #fff;
border: 1px solid #dedede;
border-radius: 0.2rem;
display: flex;
flex-direction: row;
align-items: center;
background: #fff;
`;

const SearchInput = styled(InputItem)`
margin-left: -0.22rem;
`;

const SearchBar = ({ ...props }) => {
  return (
    <InputContainer>
      <InputWrap>
        <Icon
          type="search"
          size="xs"
          style={{ color: '#bbb', marginLeft: '.2rem' }}
        />
        <SearchInput {...props} />
      </InputWrap>
    </InputContainer>
  );
};

export default SearchBar;
