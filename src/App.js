import React, { useEffect, useState } from 'react'
import { Route, Switch, Redirect, Router, BrowserRouter, useHistory } from 'react-router-dom'
import { Tabs } from 'antd';
import { ExportOutlined, LoginOutlined, LogoutOutlined, DiffOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux'
import { setUserData, signOut } from './redux/actions/Auth.js'
import Login from './components/Login.js'
import Schema from './components/Schema.js'
import Reports from './components/Reports.js'
import './App.css';
import "antd/dist/antd.css";



const { TabPane } = Tabs;
function App() {

  const history = useHistory();
  const dispatch = useDispatch();
  const { isLogined } = useSelector(({ auth }) => auth)

  function handleSignOut(event) {
    if (event === "logout") {
      dispatch(signOut(() => history.push('/login')));
    }
    console.log(event);
  }
  useEffect(() => {
    if (isLogined) dispatch(setUserData())
  }, [dispatch, isLogined])

  return (
    <>
      <div class="tabs">
        <Tabs type="line" class="tab" onTabClick={(key) => history.push(`/${key}`)}>
          <TabPane
            tab={
              <span>
                <DiffOutlined />
                Generate schema

        </span>
            }
            key="schema"

            disabled={!isLogined}
          >
          </TabPane>

          <TabPane
            tab={
              <span>
                <ExportOutlined />
                My schemas
        </span>
            }
            key="reports"
            disabled={!isLogined}
          >
          </TabPane>
        </Tabs>
        <Tabs type="line" class="tab" onTabClick={handleSignOut}>
          <TabPane
            tab={
              <span>
                <LoginOutlined />
                Login
        </span>
            }
            disabled={isLogined}
            key="login"
          >
          </TabPane>
          <TabPane
            tab={
              <span>
                <LogoutOutlined />
                Logout
        </span>
            }
            key="logout"
            disabled={!isLogined}
          >
          </TabPane>
        </Tabs>
      </div>

      <Switch>
        <Route exact path="/login" render={() => <Login />} />
        <Route exact path="/schema" render={(props) => <Schema {...props} />} />
        <Route exact path="/reports" render={() => <Reports />} />
        {isLogined ? (<Redirect to="/schema" />) : (<Redirect to="/login" />)
        }
      </Switch>

    </>
  );
}

export default App;
