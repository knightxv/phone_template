import React from 'react';
// import styled from 'styled-components';

class LongPress extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {};
    this.isLongPress = false;
    this.isTouchMove = false;
  }
  onTouchStart = () => {
    this.clearTime();
    this.isLongPress = false;
    this.isTouchMove = false;
    this.timer = window.setTimeout(() => {
      if (this.isTouchMove) {
        return;
      }
      this.isLongPress = true;
      this.props.onLongPress && this.props.onLongPress();
    }, 500);
  }
  onTouchEnd = () => {
    if (this.isTouchMove) {
      return;
    }
    if (!this.isLongPress) {
      this.clearTime();
      this.props.onShortPress && this.props.onShortPress();
    }
  }
  onTouchMove = () => {
    this.isTouchMove = true;
    this.clearTime();
  }
  clearTime = () => {
    window.clearTimeout(this.timer);
  }
  render() {
    const { children, onShortPress, onLongPress, ...otherProps } = this.props;
    return (<div
      {...otherProps}
      onTouchStart={this.onTouchStart}
      onMouseDown={this.onTouchStart}

      onTouchCancel={this.onTouchEnd}
      onTouchEnd={this.onTouchEnd}
      onMouseUp={this.onTouchEnd}

      onTouchMove ={this.onTouchMove}
      onMouseMove={this.onTouchMove}
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
