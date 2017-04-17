/* External dependencies */
import Immutable from 'immutable'
import selectn from 'selectn'
import { ReduceStore } from 'flux/utils'

/* Internal dependencies */
import AppDispatcher from '../dispatcher/AppDispatcher'
import ActionTypes from '../constants/ActionTypes'

class ImagesStore extends ReduceStore {

  getInitialState() {
    return Immutable.Map({
      queryImage: null,
      queryImageName: null,
      ranking: Immutable.List(),
      results: Immutable.List(),
    })
  }

  /**
   * public
   */

  getQueryImage() {
    const { queryImage } = this.getState().toObject()
    return queryImage
  }

  getQueryImageName() {
    const { queryImageName } = this.getState().toObject()
    return queryImageName
  }

  getRanking() {
    const { ranking } = this.getState().toObject()
    return ranking
  }

  getResults() {
    const { results } = this.getState().toObject()
    return results.sort((f1, f2) => {
      if (f1.get('score') < f2.get('score')) {
        return 1
      } else if (f1.get('score') > f2.get('score')) {
        return -1
      }
      return 0
    })
  }

  /**
   * private
   */

  _setQuery(state, image, imageName) {
    return state.set('queryImage', image).set('queryImageName', imageName)
  }

  _setRanking(state, ranking) {
    return state.set('ranking', Immutable.fromJS(ranking))
  }

  _upsertBulk(state, newResults) {
    let { results } = state.toObject()
    Immutable.fromJS(newResults).forEach((result) => {
      const idx = results.findIndex((u) => u.get('path') === result.get('path'))
      if (idx === -1) {
        results = results.push(result)
      } else {
        results = results.set(idx, result)
      }
    })
    return state.set('results', results)
  }

  _clear() {
    return this.getInitialState()
  }

  reduce(state, action) {
    let newState = state

    switch (action.type) {
      case ActionTypes.REQUEST_SEND_QUERY:
        return this._clear()

      case ActionTypes.REQUEST_SEND_QUERY_SUCCESS:
        newState = this._setQuery(
          state,
          selectn('request.image', action),
          selectn('request.imageName', action),
        )
        return this._setRanking(newState, selectn('response', action))

      case ActionTypes.REQUEST_GET_NEXT_RESULTS_SUCCESS:
        return this._upsertBulk(state, selectn('response.results', action))

      default:
        return state
    }
  }
}

export default new ImagesStore(AppDispatcher)
