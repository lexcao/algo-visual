import React from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import Shell, { Missing } from './components/Shell'
import BinarySearch from './binary-search/index'

export default function App () {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Redirect to="/binary-search"/>
        </Route>
        <Route path="/binary-search">
          <BinarySearch/>
        </Route>
        <Route>
          <Shell>
            <Missing/>
          </Shell>
        </Route>
      </Switch>
    </BrowserRouter>
  )
}
