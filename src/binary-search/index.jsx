import React from 'react'
import data from './data/index'
import BinarySearch from './component/BinarySearch'

export default () => {

  const test = data[1]

  return <BinarySearch {...test}/>
}
