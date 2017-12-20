import styled from 'styled-components';
import Icon from './Icon';

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
// const CancelLabel = styled.div`
// padding-left: 0.2rem;
// color: #1e7df1;
// `;

const SearchBar = ({ ...props, onCancelClick = () => {} }) => {
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

export default SearchBar;
