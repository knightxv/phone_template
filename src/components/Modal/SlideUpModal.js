import React from 'react';
import styled from 'styled-components';
import ModalContainer from './ModalContainer';

const BlackMask = styled.div`
  flex: 1;
`;
const ContentWrap = styled.div`
`;

class SlideUpModal extends React.Component {
  render() {
    const { children, onClose, visible } = this.props;
    if (!visible) {
      return null;
    }
    return (<ModalContainer onClick={onClose}>
      <BlackMask />
      <ContentWrap onClick={e => e.stopPropagation()}>
        { children }
      </ContentWrap>
    </ModalContainer>);
  }
}

export default SlideUpModal;
