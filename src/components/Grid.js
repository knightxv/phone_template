import styled from 'styled-components';
// 九宫格
const GridContainer = styled.div`
  padding: 0 .1rem;
`;
const GridWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: .1rem;
`;

const makeArr = (makeLength) => {
  const arr = [];
  for (let i = 0; i < makeLength; i++) {
    arr.push(i);
  }
  return arr;
};

const Grid = ({ children, columnNum = 3, gridWrapClassName, ...others }) => {
  const GridArr = makeArr(Math.ceil(children.length / columnNum));
  const itemArr = makeArr(columnNum);
  return (
    <GridContainer {...others}>
      {
        GridArr.map((item, index) => {
          return (
            <GridWrap key={index}>
              {
                itemArr.map((i) => {
                  if (!children[index * columnNum + i]) {
                    return (<div
                      className={gridWrapClassName} key={`item${i}`}
                      style={{ width: `${100 / columnNum}%` }}
                    > </div>);
                  }
                  return (<div
                    className={gridWrapClassName} key={`item${i}`}
                    style={{ width: `${100 / columnNum}%` }}
                  >
                    { children[index * columnNum + i] }
                  </div>);
                })
              }
            </GridWrap>
          );
        })
      }
    </GridContainer>
  );
};

export default Grid;
