import React from 'react';
// import styled from 'styled-components';

class LongPress extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {};
    this.isLongPress = false;
  }
  onTouchStart = () => {
    this.isLongPress = false;
    this.timer = window.setTimeout(() => {
      this.isLongPress = true;
      this.props.onLongPress && this.props.onLongPress();
    }, 500);
  }
  onTouchEnd = () => {
    if (!this.isLongPress) {
      this.clearTime();
      this.props.onShortPress && this.props.onShortPress();
    }
  }
  clearTime = () => {
    window.clearTimeout(this.timer);
  }
  render() {
    const { children, onShortPress, onLongPress, ...otherProps } = this.props;
    return (<div
      {...otherProps}
      onTouchStart={this.onTouchStart}
      onTouchCancel={this.onTouchEnd}
      onMouseDown={this.onTouchStart}
      onMouseUp={this.onTouchEnd}
      >
      { children }
    </div>);
  }
}

// LongPress.propTypes = {
//   onShortPress: () => {
//     console.log('onShortPress 短按');
//   },
//   onLongPress: () => {
//     console.log('onLongPress 长按');
//   },
// };

export default LongPress;
