import React from 'react';
import { Switch, Route } from 'wouter';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/dashboard" component={UserDashboard} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default App;

