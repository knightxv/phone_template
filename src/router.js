import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import dynamic from 'dva/dynamic';

// import IndexPage from './routes/IndexPage';

function RouterConfig({ history, app }) {
  // 普通代理
  const NormalLogin = dynamic({
    app,
    component: () => import('./routes/normal/Login'),
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
  const InviteToAgent = dynamic({
    app,
    component: () => import('./routes/normal/InviteToAgent'),
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
  const CashMoney = dynamic({
    app,
    component: () => import('./routes/normal/CashMoney'),
    models: () => [
      import('./models/agent'),
    ],
  });
  const CashMoneyRecord = dynamic({
    app,
    component: () => import('./routes/normal/CashMoneyRecord'),
    models: () => [
      import('./models/agent'),
    ],
  });
  const MyUnderAgent = dynamic({
    app,
    component: () => import('./routes/normal/MyUnderAgent'),
    models: () => [
      import('./models/agent'),
    ],
  });
  const MyPlayer = dynamic({
    app,
    component: () => import('./routes/normal/MyPlayer'),
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
  const BuyMasonryDetail = dynamic({
    app,
    component: () => import('./routes/normal/BuyMasonryDetail'),
    models: () => [
      import('./models/agent'),
    ],
  });
  const MasonryDerail = dynamic({
    app,
    component: () => import('./routes/normal/MasonryDerail'),
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
    component: () => import('./routes/general/login'),
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
  // 公用
  const NoticeDetail = dynamic({
    app,
    component: () => import('./routes/NoticeDetail'),
  });
  return (
    <div id="container" className="routerContainer">
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={NormalLogin} />

          <Route path="/login" component={NormalLogin} />
          <Route path="/homePage" component={NormalHomePage} />
          <Route path="/rankExplain" component={RankExplain} />
          <Route path="/inviteToAgent" component={InviteToAgent} />
          <Route path="/pay" component={Pay} />
          <Route path="/PlayerMoneyRecord" component={PlayerMoneyRecord} />
          <Route path="/AgencyMoneyRecord" component={AgencyMoneyRecord} />
          <Route path="/agencyPay" component={AgencyPay} />
          <Route path="/cashMoney" component={CashMoney} />
          <Route path="/cashMoneyRecord" component={CashMoneyRecord} />
          <Route path="/myUnderAgent" component={MyUnderAgent} />
          <Route path="/myPlayer" component={MyPlayer} />
          <Route path="/EditAgencyPsd" component={EditAgencyPsd} />
          <Route path="/register" component={Register} />
          <Route path="/AgreenDetail" component={AgreenDetail} />
          <Route path="/buyMasonryDetail" component={BuyMasonryDetail} />
          <Route path="/masonryDerail" component={MasonryDerail} />

          <Route path="/general/login" component={GeneralLogin} />
          <Route path="/general/homePage" component={GeneralHomePage} />
          <Route path="/general/inviteAgent" component={InviteAgent} />
          <Route path="/general/editPsd" component={EditPsd} />
          <Route path="/general/myAgents" component={MyAgents} />
          <Route path="/general/cashRecord" component={CashRecord} />
          <Route path="/general/cashMoeny" component={CashMoeny} />
          <Route path="/general/commissionRecord" component={CommissionRecord} />

          <Route path="/noticeDetail" component={NoticeDetail} />
        </Switch>
      </Router>
    </div>
  );
}

export default RouterConfig;
