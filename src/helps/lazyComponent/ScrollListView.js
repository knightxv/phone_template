import React from 'react';

class BodyScrollListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Component: null,
    };
  }
  componentDidMount() {
    import(/* webpackChunkName: 'ListView' */'../antdComponent/ListView').then((Component) => {
      this.setState({
        Component,
      });
    });
  }
  render() {
    const { Component } = this.state;
    return (Component ? <Component {...this.props} useBodyScroll /> : <div />);
  }
}

class ScrollListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Component: null,
    };
  }
  componentDidMount() {
    import(/* webpackChunkName: 'ListView' */'../antdComponent/ListView').then((Component) => {
      this.setState({
        Component,
      });
    });
  }
  render() {
    const { Component } = this.state;
    return (Component ? <Component {...this.props} useBodyScroll={false} /> : <div />);
  }
}

export default {
  BodyScrollListView,
  ScrollListView,
};
