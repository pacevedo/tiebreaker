import React from 'react'
import Filter from './filter'
import { useSelector } from 'react-redux'

function FilterContainer() {

  const score = useSelector(state => state.score)
  const combinations = useSelector(state => state.combination)

  const filter = (score && score.areSaved && combinations && combinations.areSaved) ? 
  <Filter /> : 
  <></>

  return filter
}

export default FilterContainer
