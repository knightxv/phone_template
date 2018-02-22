import { Button } from 'antd-mobile';
import styled from 'styled-components';

const colorMap = {
  blue: '#5887d5',
  green: '#5fab31',
  red: '#eb725d',
};

const TypeStyleButton = styled(Button)`
  background: ${({ type }) => colorMap[type] || colorMap.blue};
  color: #fff;
  border: none;
`;

const DefaultButton = (props) => {
  // const { type = 'blue',...otherProps } = props;

  return (
    <TypeStyleButton type="blue" size="large" {...props} />
  );
};

export default DefaultButton;
