import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import dynamic from 'dva/dynamic';

// import IndexPage from './routes/IndexPage';

function RouterConfig({ history, app }) {
  // 普通代理
  const NormalLogin = dynamic({
    app,
    component: () => import('./routes/bobing/normal/Login'),
    models: () => [
      import('./models/agent'),
    ],
  });
  const NormalHomePage = dynamic({
    app,
    component: () => import('./routes/normal/HomePage'),
    models: () => [
      import('./models/agent'),
    ],
  });
  const RankExplain = dynamic({
    app,
    component: () => import('./routes/normal/RankExplain'),
    models: () => [
      import('./models/agent'),
    ],
  });
  const PlayerPayManage = dynamic({
    app,
    component: () => import('./routes/normal/PlayerPayManage'),
    models: () => [
      import('./models/agent'),
    ],
  });
  const Pay = dynamic({
    app,
    component: () => import('./routes/normal/Pay'),
    models: () => [
      import('./models/agent'),
    ],
  });
  const PlayerMoneyRecord = dynamic({
    app,
    component: () => import('./routes/normal/PlayerMoneyRecord'),
    models: () => [
      import('./models/agent'),
    ],
  });
  const AgencyMoneyRecord = dynamic({
    app,
    component: () => import('./routes/normal/AgencyMoneyRecord'),
    models: () => [
      import('./models/agent'),
    ],
  });
  const AgencyPay = dynamic({
    app,
    component: () => import('./routes/normal/AgencyPay'),
    models: () => [
      import('./models/agent'),
    ],
  });
  const AgencyExtractMoney = dynamic({
    app,
    component: () => import('./routes/normal/AgencyExtractMoney'),
    models: () => [
      import('./models/agent'),
    ],
  });
  const AgencyExtractMoneyRecord = dynamic({
    app,
    component: () => import('./routes/normal/AgencyExtractMoneyRecord'),
    models: () => [
      import('./models/agent'),
    ],
  });
  const SecondaryAgencyRecord = dynamic({
    app,
    component: () => import('./routes/normal/SecondaryAgencyRecord'),
    models: () => [
      import('./models/agent'),
    ],
  });
  const EditAgencyPsd = dynamic({
    app,
    component: () => import('./routes/normal/EditAgencyPsd'),
    models: () => [
      import('./models/agent'),
    ],
  });
  const Register = dynamic({
    app,
    component: () => import('./routes/normal/Register'),
    models: () => [
      import('./models/agent'),
    ],
  });
  const AgreenDetail = dynamic({
    app,
    component: () => import('./routes/normal/AgreenDetail'),
    models: () => [
      import('./models/agent'),
    ],
  });
  const AgencyPayType = dynamic({
    app,
    component: () => import('./routes/normal/AgencyPayType'),
    models: () => [
      import('./models/agent'),
    ],
  });
  // const Login = dynamic({
  //   app,
  //   component: () => import('./routes/normal/HomePage'),
  //   models: () => [
  //     import('./models/agent'),
  //   ],
  // });
  // 总代理
  const GeneralLogin = dynamic({
    app,
    component: () => import('./routes/bobing/general/login'),
    models: () => [
      import('./models/general'),
    ],
  });
  const GeneralHomePage = dynamic({
    app,
    component: () => import('./routes/general/homePage'),
    models: () => [
      import('./models/general'),
    ],
  });
  const InviteAgent = dynamic({
    app,
    component: () => import('./routes/general/InviteAgent'),
    models: () => [
      import('./models/general'),
    ],
  });
  const EditPsd = dynamic({
    app,
    component: () => import('./routes/general/EditPsd'),
    models: () => [
      import('./models/general'),
    ],
  });
  const MyAgents = dynamic({
    app,
    component: () => import('./routes/general/MyAgents'),
    models: () => [
      import('./models/general'),
    ],
  });
  const CashMoeny = dynamic({
    app,
    component: () => import('./routes/general/CashMoeny'),
    models: () => [
      import('./models/general'),
    ],
  });
  const CashRecord = dynamic({
    app,
    component: () => import('./routes/general/CashRecord'),
    models: () => [
      import('./models/general'),
    ],
  });
  const CommissionRecord = dynamic({
    app,
    component: () => import('./routes/general/CommissionRecord'),
    models: () => [
      import('./models/general'),
    ],
  });
  return (
    <div className="routerContainer">
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={NormalLogin} />

          <Route path="/login" component={NormalLogin} />
          <Route path="/homePage" component={NormalHomePage} />
          <Route path="/RankExplain" component={RankExplain} />
          <Route path="/PlayerPayManage" component={PlayerPayManage} />
          <Route path="/pay" component={Pay} />
          <Route path="/PlayerMoneyRecord" component={PlayerMoneyRecord} />
          <Route path="/AgencyMoneyRecord" component={AgencyMoneyRecord} />
          <Route path="/AgencyPay" component={AgencyPay} />
          <Route path="/AgencyExtractMoney" component={AgencyExtractMoney} />
          <Route path="/AgencyExtractMoneyRecord" component={AgencyExtractMoneyRecord} />
          <Route path="/SecondaryAgencyRecord" component={SecondaryAgencyRecord} />
          <Route path="/EditAgencyPsd" component={EditAgencyPsd} />
          <Route path="/register" component={Register} />
          <Route path="/AgreenDetail" component={AgreenDetail} />
          <Route path="/AgencyPayType" component={AgencyPayType} />

          <Route path="/general/login" component={GeneralLogin} />
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
