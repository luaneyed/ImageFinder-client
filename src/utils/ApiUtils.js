/* External dependencies */
import 'whatwg-fetch'
import _ from 'lodash'
import Qs from 'qs'
import selectn from 'selectn'

export const API_ROOT = '//deep4.buzzni.net:8080/'

function checkStatus(response) {
  return response.text()
}

function parseJSON(data) {
  if (_.isEmpty(data)) {
    return data
  }
  return JSON.parse(data)
}

function checkError(data) {
  if (_.isString(data.type) && (_.isObject(data.error) || _.isArray(data.errors))) {
    const error = new Error(data.type)
    if (_.isObject(data.error)) {
      error.error = data.error
    }
    if (_.isArray(data.errors)) {
      error.errors = data.errors
    }
    throw error
  } else {
    return data
  }
}

function catchError(error) {
  if (!selectn('error', error) && !selectn('errors', error)) {
    const e = new Error('NetworkError')
    e.error = { message: 'network error' }
    throw e
  } else {
    throw error
  }
}

export function get(getUrl, query) {
  let url = API_ROOT + getUrl
  if (_.isObject(query)) {
    url += `?${Qs.stringify(query)}`
  }
  return fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Locale': 'en',
    },
  })
  .then(checkStatus)
  .then(parseJSON)
  .then(checkError)
  .catch(catchError)
}

export function postByFormData(url, formData) {
  return fetch(API_ROOT + url, {
    method: 'post',
    body: formData,
    headers: {
      'X-Locale': 'en',
    },
  })
  .then(checkStatus)
  .then(parseJSON)
  .then(checkError)
  .catch(catchError)
}
