// import React from 'react';

// export default (componentName) => {
//   class LazyComponent extends React.Component {
//     constructor(props) {
//       super(props);
//       this.state = {
//         Component: null,
//       };
//     }
//     componentDidMount() {
//       console.log(componentName)
//       require(`bundle-loader?lazy&name=${componentName}!./antdComponent/DatePicker`)((Component) => {
//         this.setState({
//           Component,
//         });
//       });
//     }
//     render() {
//       const { Component } = this.state;
//       return (Component && <Component {...this.props} />);
//     }
//   }
//   return LazyComponent;
// };
