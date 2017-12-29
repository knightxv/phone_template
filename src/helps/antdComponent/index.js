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

class ListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Component: null,
    };
  }
  componentDidMount() {
    import(/* webpackChunkName: 'ListView' */'./ListView').then((Component) => {
      this.setState({
        Component,
      });
    });
  }
  render() {
    const { Component } = this.state;
    return (Component ? <Component {...this.props} /> : <div />);
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
    import(/* webpackChunkName: 'ListViewTable' */'./ListViewTable').then((res) => {
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
class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Component: null,
    };
  }
  componentDidMount() {
    import(/* webpackChunkName: 'Modal' */'./Modal').then((Component) => {
      this.setState({
        Component,
      });
    });
  }
  componentWillUnmount() {
    window.document.documentElement.style.overflow = 'auto';
  }
  render() {
    const { Component } = this.state;
    const visible = this.props.visible;
    if (visible) {
      window.document.documentElement.style.overflow = 'hidden';
    } else {
      window.document.documentElement.style.overflow = 'auto';
    }
    return (Component && <Component {...this.props} />);
  }
}


export default {
  DatePicker,
  SelectPicker,
  Icon,
  Button,
  ListViewTable,
  ListView,
  InputItem,
  Modal,
};
