import React from 'react';
import styled from 'styled-components';
import ModalContainer from './ModalContainer';
import Button from '../antdComponent/Button';

const ContentContainer = styled.div`
  flex: 1;
  height: 80%;
  margin: 1rem .2rem;
  background: #f5f5f5;
  position: relative;
  overflow: hidden;
`;
const ContentWrap = styled.div`
  flex: 1;
  height: 100%;
  padding-bottom: 1rem;
  overflow-y: auto;
`;
const BtnWrap = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  background: #eb725d;
`;

class ModalContentContainer extends React.Component {
  render() {
    const { children, onClose, visible } = this.props;
    if (!visible) {
      return null;
    }
    return (<ModalContainer onClick={onClose}>
      <ContentContainer>
        <ContentWrap onClick={e => e.stopPropagation()}>
          { children }
        </ContentWrap>
        <BtnWrap>
          <Button type="red" onClick={onClose}>关闭</Button>
        </BtnWrap>
      </ContentContainer>
    </ModalContainer>);
  }
}

export default ModalContentContainer;
