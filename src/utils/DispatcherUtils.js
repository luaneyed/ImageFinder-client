/* External dependencies */
import _ from 'lodash'

/* Internal dependencies */
import AppDispatcher from '../dispatcher/AppDispatcher'

/**
 * Dispatches a single action.
 */
export function dispatch(type, action = {}) {
  if (!type) {
    throw new Error('You forgot to specify type.')
  }
  if (AppDispatcher._isDispatching) {
    window.setTimeout(() => {
      AppDispatcher.dispatch({ type, ...action })
    })
  } else {
    AppDispatcher.dispatch({ type, ...action })
  }
}

/**
 * Dispatches three actions for an async operation represented by promise.
 */
export function dispatchAsync(promise, types, action = {}, callbacks = {}) {
  const { request, success, error } = types
  const { successCallback, errorCallback } = callbacks
  dispatch(request, { request: action })
  promise.then(
    response => {
      dispatch(success, { request: action, response })
      if (_.isFunction(successCallback)) {
        successCallback({ request: action, response })
      }
    },
    response => {
      dispatch(error, { request: action, response })
      if (_.isFunction(errorCallback)) {
        errorCallback({ request: action, response })
      }
    }
  )
}
