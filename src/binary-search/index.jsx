import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import Shell from '../components/Shell'
import IndexPage from './IndexPage'
import Visualizer from './component/BinarySearch'

export default function BinarySearchSection () {
  const { path } = useRouteMatch()
  return (
    <Shell>
      <Switch>
        <Route exact path={path}>
          <IndexPage/>
        </Route>
        <Route path={`${path}/:id`}>
          <Visualizer/>
        </Route>
      </Switch>
    </Shell>
  )
}
