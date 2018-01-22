import styled from 'styled-components';
import { NoticeBar } from 'antd-mobile';

const IconSource = {
  notice: require('../../assets/gg.png'),
};

const NoticeImg = styled.img`
width: .3rem;
height: .3rem;
margin: 0 .06rem;
`;

const DefaultNotice = (props) => {
  return (
    <NoticeBar
      mode="link"
      marqueeProps={{ loop: true, style: { color: '#f1781e', fontSize: '.3rem' } }}
      icon={<NoticeImg src={IconSource.notice} />}
      {...props}
    />
  );
};

export default DefaultNotice;
