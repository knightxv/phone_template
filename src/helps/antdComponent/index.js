import React from 'react';

class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Component: null,
    };
  }
  componentDidMount() {
    import(/* webpackChunkName: 'DatePicker' */'./DatePicker').then((Component) => {
      this.setState({
        Component,
      });
    });
  }
  render() {
    const { Component } = this.state;
    return (Component && <Component {...this.props} />);
  }
}

class SelectPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Component: null,
    };
  }
  componentDidMount() {
    import(/* webpackChunkName: 'SelectPicker' */'./SelectPicker').then((Component) => {
      this.setState({
        Component,
      });
    });
  }
  render() {
    const { Component } = this.state;
    return (Component && <Component {...this.props} />);
  }
}

class Icon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Component: null,
    };
  }
  componentDidMount() {
    import(/* webpackChunkName: 'Icon' */'./Icon').then((Component) => {
      this.setState({
        Component,
      });
    });
  }
  render() {
    const { Component } = this.state;
    return (Component && <Component {...this.props} />);
  }
}

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Component: null,
    };
  }
  componentDidMount() {
    import(/* webpackChunkName: 'Button' */'./Button').then((Component) => {
      this.setState({
        Component,
      });
    });
  }
  render() {
    const { Component } = this.state;
    return (Component && <Component {...this.props} />);
  }
}

let DataSource;
class ListViewTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Component: null,
    };
  }
  componentDidMount() {
    import(/* webpackChunkName: 'ListView' */'./ListView').then((res) => {
      const Component = res.default;
      DataSource = res.DataSource;
      this.setState({
        Component,
      });
    });
  }
  render() {
    const { Component } = this.state;
    return (Component && <Component {...this.props} />);
  }
}
ListViewTable.DataSource = DataSource;


class InputItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Component: null,
    };
  }
  componentDidMount() {
    import(/* webpackChunkName: 'InputItem' */'./InputItem').then((Component) => {
      this.setState({
        Component,
      });
    });
  }
  render() {
    const { Component } = this.state;
    return (Component && <Component {...this.props} />);
  }
}


export default {
  DatePicker,
  SelectPicker,
  Icon,
  Button,
  ListViewTable,
  InputItem,
};
