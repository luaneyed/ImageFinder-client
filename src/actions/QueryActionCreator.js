/* External dependencies */
import _ from 'lodash'
import moment from 'moment'

/* Internal dependencies */
import * as QueryAPI from '../api/QueryAPI'
import ActionTypes from '../constants/ActionTypes'
import ImagesStore from '../stores/ImagesStore'
import { dispatchAsync } from '../utils/DispatcherUtils'

let _recentNext = null
export function requestGetNextResult(next, callbacks) {
  if (!next || (next === _recentNext)) {
    callbacks.successCallback()
    return
  }
  _recentNext = next
  const imageName = ImagesStore.getQueryImageName()
  dispatchAsync(QueryAPI.getResults(imageName, next), {
    request: ActionTypes.REQUEST_GET_NEXT_RESULTS,
    success: ActionTypes.REQUEST_GET_NEXT_RESULTS_SUCCESS,
    error: ActionTypes.REQUEST_GET_NEXT_RESULTS_ERROR,
  }, { imageName, next }, {
    successCallback: (response) => {
      if (_.isFunction(callbacks.successCallback)) {
        callbacks.successCallback(response)
      }
    },
    errorCallback: () => {
      if (_.isFunction(callbacks.errorCallback)) {
        callbacks.errorCallback()
      }
    }
  })
}

export function requestSendQuery(image, callbacks) {
  const imageName = moment().format('x')
  dispatchAsync(QueryAPI.sendImage(image, imageName), {
    request: ActionTypes.REQUEST_SEND_QUERY,
    success: ActionTypes.REQUEST_SEND_QUERY_SUCCESS,
    error: ActionTypes.REQUEST_SEND_QUERY_ERROR,
  }, { image, imageName }, {
    successCallback: () => {
      dispatchAsync(QueryAPI.getResults(imageName, null), {
        request: ActionTypes.REQUEST_GET_NEXT_RESULTS,
        success: ActionTypes.REQUEST_GET_NEXT_RESULTS_SUCCESS,
        error: ActionTypes.REQUEST_GET_NEXT_RESULTS_ERROR,
      }, { imageName }, {
        successCallback: (response) => {
          if (_.isFunction(callbacks.successCallback)) {
            callbacks.successCallback(response)
          }
        },
        errorCallback: () => {
          if (_.isFunction(callbacks.errorCallback)) {
            callbacks.errorCallback()
          }
        }
      })
    },
    errorCallback: () => {
      if (_.isFunction(callbacks.errorCallback)) {
        callbacks.errorCallback()
      }
    }
  })
}

