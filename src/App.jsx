import React from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import BinarySearch from './binary-search/index'

export default () => {

  return (
    <main className="bg-gray-50 w-screen w-screen">
      <Router>
        <Switch>
          <Route path="/binary-search">
            <BinarySearch/>
          </Route>

          <Route exact path="/">
            <Redirect to="/binary-search"/>
          </Route>
        </Switch>
      </Router>
    </main>
  )
}
