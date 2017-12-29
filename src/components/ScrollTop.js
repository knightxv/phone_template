import React from 'react';
import styled from 'styled-components';

const scrollTopIconImg = require('../assets/scroll_top.png');

const ScrollTopContainer = styled.div`
position: fixed;
bottom: 1rem;
right: 0.3rem;
`;
const ScrollTopIcon = styled.img`
width: .6rem;
height: .6rem;
display: block;
`;

const ScrollTop = (props) => {
  return (<ScrollTopContainer {...props}>
    <ScrollTopIcon src={scrollTopIconImg} />
  </ScrollTopContainer>);
};

ScrollTop.propTypes = {
};

export default ScrollTop;
