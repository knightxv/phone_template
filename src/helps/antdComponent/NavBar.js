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
position: fixed;
width: 100%;
top: 0;
z-index: 999;
background: #108ee9;
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
    <div>
      <NavBarWrap className={className}>
        <NavBarSideWrap>
          {
              onClick && <Icon
                type="left"
                color="#fff"
                size="lg"
                style={{ marginLeft: '-0.4rem' }}
                onClick={onClick}
              />
          }
        </NavBarSideWrap>
        <div style={{ fontSize: '0.36rem', color: '#fff' }}>{title}</div>
        <NavBarSideWrap>
          { right }
        </NavBarSideWrap>
      </NavBarWrap>
      <div style={{ height: '0.8rem' }} />
    </div>
  );
};

export default DefaultNavbar;
