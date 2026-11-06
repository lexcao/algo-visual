import React from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import Shell, { Missing } from './components/Shell'
import BinarySearch from './binary-search/index'
import BubblePage from './pages/BubblePage'
import GridPage from './pages/GridPage'
import QuickPage from './pages/QuickPage'
import TwoPointersPage from './pages/TwoPointersPage'
import WindowPage from './pages/WindowPage'

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
        <Route exact path="/sorting/bubble-sort">
          <Shell>
            <BubblePage/>
          </Shell>
        </Route>
        <Route exact path="/sorting/quick-sort">
          <Shell>
            <QuickPage/>
          </Shell>
        </Route>
        <Route exact path="/graph/grid-search">
          <Shell>
            <GridPage/>
          </Shell>
        </Route>
        <Route exact path="/two-pointers">
          <Shell>
            <TwoPointersPage/>
          </Shell>
        </Route>
        <Route exact path="/sliding-window">
          <Shell>
            <WindowPage/>
          </Shell>
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
