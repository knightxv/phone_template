import styled from 'styled-components';
import { Icon } from './index.js';

const NavBarWrap = styled.div`
display: flex;
height: .8rem;
padding-left: .2rem;
padding-right: .2rem;
flex-direction: row;
align-items: center;
justify-content: space-between;
background: #fff;
`;
const NavBarSideWrap = styled.div`
min-width: 36px;
color: #78bff2;
display: flex;
flex-direction: colunm;
justify-content: center;
`;

const DefaultNavbar = ({ title, onClick, right, className }) => {
  return (
    <NavBarWrap className={className}>
      <NavBarSideWrap>
        {
            onClick && <Icon
              type="left"
              color="#108ee9"
              size="lg"
              style={{ marginLeft: '-0.4rem' }}
              onClick={onClick}
            />
        }
      </NavBarSideWrap>
      <div style={{ fontSize: '0.36rem' }}>{title}</div>
      <NavBarSideWrap>
        { right }
      </NavBarSideWrap>
    </NavBarWrap>
  );
};

export default DefaultNavbar;
