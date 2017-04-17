/* External dependencies */
import React from 'react'
import { Router, Route, useRouterHistory } from 'react-router'
import { createHashHistory } from 'history'

/* Internal dependencies */
import App from './containers/App'

export default (
  <Router history={useRouterHistory(createHashHistory)({ queryKey: false })}>
    <Route path="/" component={App} />
  </Router>
)
