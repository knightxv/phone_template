import styled from 'styled-components';
// 九宫格
const GridWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
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
    <div {...others}>
      {
        GridArr.map((item, index) => {
          return (
            <GridWrap key={index}>
              {
                itemArr.map((i) => {
                  if (!children[index * columnNum + i]) {
                    return (<div
                      className={gridWrapClassName} key={`item${i}`}
                    ></div>);
                  }
                  return (<div
                    className={gridWrapClassName} key={`item${i}`}
                  >
                    { children[index * columnNum + i] }
                  </div>);
                })
              }
            </GridWrap>
          );
        })
      }
    </div>
  );
};

export default Grid;
