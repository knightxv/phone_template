import styled from 'styled-components';
import Icon from './Icon';

const NavBarWrap = styled.div`
display: flex;
height: 1rem;
padding-left: .2rem;
padding-right: .2rem;
flex-direction: row;
align-items: center;
justify-content: space-between;
background: #fff;
position: fixed;
width: 100%;
max-width: 750px;
top: 0;
z-index: 999;
background: #4889db;
`;
const NavBarSideWrap = styled.div`
min-width: 36px;
color: #78bff2;
display: flex;
flex-direction: colunm;
justify-content: center;
`;
const Title = styled.div`
font-size: .42rem;
color: #fff;
position: absolute;
left: 0;
width: 100%;
height: 100%;
line-height: 1rem;
text-align: center;
z-index: -1;
`;

const DefaultNavbar = ({ title, onClick, right, className }) => {
  return (
    <div style={{ height: '1rem' }}>
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
        <Title>{title}</Title>
        <NavBarSideWrap>
          { right }
        </NavBarSideWrap>
      </NavBarWrap>
    </div>
  );
};

export default DefaultNavbar;
