import styled from 'styled-components';
import Icon from './Icon';
import { InputItem } from '@/helps/antdComponent/index.js';

const InputContainer = styled.div`
background: #efeff4;
box-sizing: border-box;
padding: 0.2rem 0.2rem;
display: flex;
flex-direction: row;
align-items: center;
`;
const InputWrap = styled.div`
flex: 1;
background: #fff;
border: 1px solid #dedede;
border-radius: 0.2rem;
`;

// const CancelLabel = styled.div`
// padding-left: 0.2rem;
// color: #1e7df1;
// `;

const SearchBar = ({ ...props }) => {
  
  return (
    <InputContainer>
      <InputWrap>
        <InputItem {...props} />
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

export default SearchBar;
