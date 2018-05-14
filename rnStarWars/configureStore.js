import { createStore, applyMiddleware } from 'redux'
import app from './reducers'
// import thunk from 'redux-thunk'

export default function configureStore() {
  // let store = createStore(app, applyMiddleware(thunk))
  let store = createStore(app, applyMiddleware())

  return store
}
