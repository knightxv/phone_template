import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import dynamic from 'dva/dynamic';

import IndexPage from './routes/IndexPage';

// 通用

// 总代理
import Login from './routes/general/login';
import GeneralHomePage from './routes/general/homePage';
import InviteAgent from './routes/general/InviteAgent';
import EditPsd from './routes/general/EditPsd';
import MyAgents from './routes/general/MyAgents';
import CashMoeny from './routes/general/CashMoeny';
import CashRecord from './routes/general/CashRecord';
import CommissionRecord from './routes/general/CommissionRecord';

// 普通代理
// import NormalHomePage from './routes/normal/HomePage';
// import NormalLogin from './routes/normal/Login';

function RouterConfig({ history, app }) {
  // const Register = dynamic({
  //   app,
  //   component: () => import('./routes/Register'),
  //   // models: () => [
  //   //   import('./models/users'),
  //   // ],
  // });
  return (
    <div className="routerContainer">
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={IndexPage} />

          {/* <Route path="/homePage" component={NormalHomePage} /> */}
          {/* <Route path="/login" component={NormalLogin} /> */}

          <Route path="/general/login" component={Login} />
          {/* <Route path="/register" component={Register} /> */}
          <Route path="/general/homePage" component={GeneralHomePage} />

          <Route path="/general/inviteAgent" component={InviteAgent} />
          <Route path="/general/editPsd" component={EditPsd} />
          <Route path="/general/myAgents" component={MyAgents} />
          <Route path="/general/cashRecord" component={CashRecord} />
          <Route path="/general/cashMoeny" component={CashMoeny} />
          <Route path="/general/commissionRecord" component={CommissionRecord} />
        </Switch>
      </Router>
    </div>
  );
}

export default RouterConfig;
