import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import createRootReducer from '../reducers'

function configureStore() {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    return createStore(createRootReducer(), {}, composeEnhancers(applyMiddleware(thunk)))

}

export default configureStore()