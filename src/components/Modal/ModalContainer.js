import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 999;
  display: flex;
  flex-direction: column;
`;

class ModalContainer extends React.Component {
  render() {
    const { children, ...otherProps } = this.props;
    if (!children) {
      return null;
    }
    return (<Container {...otherProps}>
      { children }
    </Container>);
  }
}

export default ModalContainer;
