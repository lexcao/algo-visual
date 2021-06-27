import React from 'react'
import data from './data/index'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom'
import Header from '../components/Header'
import BinarySearch from './component/BinarySearch'

const Main = () => {
  const { url } = useRouteMatch()
  console.log(useRouteMatch())
  return <section className="flex flex-col justify-center text-2xl items-center">
    {data.map(it => (
      <Link key={it.id} to={url + '/' + it.id} className="bg-white rounded shadow w-8/12 h-auto p-8 my-8">
        <div className="flex flex-col h-full">
          <span className="font-medium text-indigo-500">Binary Search </span>
          <span className="capitalize">{it.name}</span>
        </div>
      </Link>
    ))}
  </section>
}

export default () => {
  const { path } = useRouteMatch()
  return (
    <>
      <Link to="/binary-search">
        <Header title="Binary Search Visualization"/>
      </Link>
      <Switch>
        <Route exact path={path}>
          <Main/>
        </Route>
        <Route path={`${path}/:id`}>
          <BinarySearch/>
        </Route>
      </Switch>
    </>
  )
}
