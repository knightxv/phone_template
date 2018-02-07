import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import dynamic from 'dva/dynamic';
import App from '@/routes/App';

function RouterConfig({ history, app }) {
  const routes = [
    // 普通代理
    {
      path: '/login',
      component: () => import('./routes/normal/Login'),
      // models: () => [
      //   import('./models/agent'),
      // ],
    },
    {
      path: '/homePage',
      component: () => import('./routes/normal/HomePage'),
      models: () => [
        import('./models/agent'),
      ],
    },
    {
      path: '/rankExplain',
      component: () => import('./routes/normal/RankExplain'),
    },
    {
      path: '/inviteToAgent',
      component: () => import('./routes/normal/InviteToAgent'),
      models: () => [
        import('./models/agent'),
      ],
    },
    {
      path: '/inviteToPlayer',
      component: () => import('./routes/normal/InviteToPlayer'),
      models: () => [
        import('./models/agent'),
      ],
    },
    {
      path: '/selectGame',
      component: () => import('./routes/SelectGame'),
      models: () => [
        import('./models/agent'),
      ],
    },
    {
      path: '/myUnderAgent',
      component: () => import('./routes/normal/MyUnderAgent'),
      models: () => [
        import('./models/agent'),
      ],
    },
    {
      path: '/cashMoney',
      component: () => import('./routes/normal/CashMoney'),
      models: () => [
        import('./models/agent'),
      ],
    },
    {
      path: '/cashInfo',
      component: () => import('./routes/normal/CashInfo'),
      models: () => [
        import('./models/agent'),
      ],
    },
    {
      path: '/cashOrderDetail',
      component: () => import('./routes/normal/CashOrderDetail'),
      models: () => [
        import('./models/agent'),
      ],
    },
    {
      path: '/cashRecord',
      component: () => import('./routes/normal/CashRecord'),
      models: () => [
        import('./models/agent'),
      ],
    },
    {
      path: '/agencyPay',
      component: () => import('./routes/normal/AgencyPay'),
      models: () => [
        import('./models/agent'),
      ],
    },
    {
      path: '/EditAgencyPsd',
      component: () => import('./routes/normal/EditAgencyPsd'),
      models: () => [
        import('./models/agent'),
      ],
    },
    {
      path: '/register',
      component: () => import('./routes/normal/Register'),
    },
    {
      path: '/AgreenDetail',
      component: () => import('./routes/normal/AgreenDetail'),
    },
    {
      path: '/payToTurnDiaForPlayer',
      component: () => import('./routes/normal/PayToTurnDiaForPlayer'),
      models: () => [
        import('./models/agent'),
      ],
    },
    {
      path: '/orderForAgentTurnDiaForPlayer',
      component: () => import('./routes/normal/OrderForAgentTurnDiaForPlayer'),
      // models: () => [
      //   import('./models/agent'),
      // ],
    },
    {
      path: '/buyMasonryOrderDetail',
      component: () => import('./routes/normal/BuyMasonryOrderDetail'),
      models: () => [
        import('./models/agent'),
      ],
    },
    {
      path: '/buyMasonryRecord',
      component: () => import('./routes/normal/BuyMasonryRecord'),
      models: () => [
        import('./models/agent'),
      ],
    },
    {
      path: '/turnDiaForAgent',
      component: () => import('./routes/normal/TurnDiaForAgent'),
      models: () => [
        import('./models/agent'),
      ],
    },
    {
      path: '/orderForAgentTurnDiaForAgent',
      component: () => import('./routes/normal/OrderForAgentTurnDiaForAgent'),
    },
    {
      path: '/payToTurnDiaForAgent',
      component: () => import('./routes/normal/PayToTurnDiaForAgent'),
      models: () => [
        import('./models/agent'),
      ],
    },
    {
      path: '/buyDiaOrderDetail',
      component: () => import('./routes/normal/BuyDiaOrderDetail'),
      models: () => [
        import('./models/agent'),
      ],
    },
    {
      path: '/buyMasonry',
      component: () => import('./routes/normal/BuyMasonry'),
      models: () => [
        import('./models/agent'),
      ],
    },
    {
      path: '/turnDiaForPlayer',
      component: () => import('./routes/normal/TurnDiaForPlayer'),
      models: () => [
        import('./models/agent'),
      ],
    },
    {
      path: '/turnDiaForPlayerRecord',
      component: () => import('./routes/normal/TurnDiaForPlayerRecord'),
      models: () => [
        import('./models/agent'),
      ],
    },
    {
      path: '/turnDiaForPlayerOrderDetail',
      component: () => import('./routes/normal/TurnDiaForPlayerOrderDetail'),
      models: () => [
        import('./models/agent'),
      ],
    },
    {
      path: '/turnDiaForAgentOrderDetail',
      component: () => import('./routes/normal/TurnDiaForAgentOrderDetail'),
      models: () => [
        import('./models/agent'),
      ],
    },
    {
      path: '/turnDiaForAgentRecord',
      component: () => import('./routes/normal/TurnDiaForAgentRecord'),
      models: () => [
        import('./models/agent'),
      ],
    },
    {
      path: '/orderForAgentBuyDia',
      component: () => import('./routes/normal/OrderForAgentBuyDia'),
    },
    {
      path: '/bindFail',
      component: () => import('./routes/normal/BindFail'),
    },
    {
      path: '/payFail',
      component: () => import('./routes/normal/PayFail'),
      models: () => [
        import('./models/agent'),
      ],
    },
    {
      path: '/setUserInfo',
      component: () => import('./routes/normal/SetUserInfo'),
      models: () => [
        import('./models/agent'),
      ],
    },
    {
      path: '/pcLoginResult',
      component: () => import('./routes/normal/PcLoginResult'),
    },
    {
      path: '/stepRebate',
      component: () => import('./routes/normal/StepRebate'),
      models: () => [
        import('./models/agent'),
      ],
    },
    {
      path: '/stepRebateAdded',
      component: () => import('./routes/normal/StepRebateAdded'),
      models: () => [
        import('./models/agent'),
      ],
    },
    {
      path: '/pcWechatLogin',
      component: () => import('./routes/normal/PcWechatLogin'),
    },
    {
      path: '/wechatBindPhone',
      component: () => import('./routes/normal/WechatBindPhone'),
    },
    {
      path: '/inviteAgentMiddle',
      component: () => import('./routes/normal/InviteAgentMiddle'),
    },
    // 总代理
    {
      path: '/general/login',
      component: () => import('./routes/general/login'),
      models: () => [
        import('./models/general'),
      ],
    },
    {
      path: '/general/homePage',
      component: () => import('./routes/general/homePage'),
      models: () => [
        import('./models/general'),
      ],
    },
    {
      path: '/general/inviteAgent',
      component: () => import('./routes/general/InviteAgent'),
      models: () => [
        import('./models/general'),
      ],
    },
    {
      path: '/general/editPsd',
      component: () => import('./routes/general/EditPsd'),
      models: () => [
        import('./models/general'),
      ],
    },
    {
      path: '/general/myAgents',
      component: () => import('./routes/general/MyAgents'),
      models: () => [
        import('./models/general'),
      ],
    },
    {
      path: '/general/cashMoeny',
      component: () => import('./routes/general/CashMoeny'),
      models: () => [
        import('./models/general'),
      ],
    },
    {
      path: '/general/cashRecord',
      component: () => import('./routes/general/CashRecord'),
      models: () => [
        import('./models/general'),
      ],
    },
    {
      path: '/general/commissionRecord',
      component: () => import('./routes/general/CommissionRecord'),
      models: () => [
        import('./models/general'),
      ],
    },
    {
      path: '/wechatAuth',
      component: () => import('./routes/WechatAuth'),
    },
    {
      path: '/forgetPassword',
      component: () => import('./routes/ForgetPassword'),
    },
  ];
  const loadingComponent = (componentPromise) => {
    return () => {
      app._store.dispatch({ type: 'app/showLoading' });
      return componentPromise().then((Component) => {
        app._store.dispatch({ type: 'app/hideLoading' });
        return Component;
      });
    };
  };
  return (
    <App>
      <Router history={history}>
        <Switch>
          <Route path="/" exact render={() => (<Redirect to="/login" />)} />
          {
            routes.map(({ path, component, ...dynamics }, key) => (
              <Route
                key={key}
                exact
                path={path}
                component={dynamic({
                  app,
                  component: loadingComponent(component),
                  // component: component,
                  ...dynamics,
                })}
              />
            ))
          }
        </Switch>
      </Router>
    </App>
  );
}

export default RouterConfig;
