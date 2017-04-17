/* External dependencies */
import React from 'react'
import classNames from 'classnames'

/* Internal dependencies */
import styles from './InfiniteScroll.scss'
import setRefToNode from '../../utils/DomUtils'

class InfiniteScroll extends React.Component {
  constructor() {
    super()
    this.handleOnScroll = this.handleOnScroll.bind(this)
    this._refs = {}
  }

  componentDidMount() {
    this.attachScrollListener()
  }

  componentDidUpdate() {
    this.attachScrollListener()
  }

  attachScrollListener() {
    this._refs.wrapper.addEventListener('scroll', this.handleOnScroll)
  }

  detachScrollListener() {
    this._refs.wrapper.removeEventListener('scroll', this.handleOnScroll)
  }

  handleOnScroll(event) {
    if (this._refs.wrapper.scrollTop + this._refs.wrapper.clientHeight > this._refs.wrapper.scrollHeight - 3000) {
      this.callbackLoadMore(event)
    }
  }

  callbackLoadMore(event) {
    this.detachScrollListener()
    this.props.loadMore(event)
  }

  render() {
    return (
      <div
        className={classNames(this.props.className, styles.scroll)}
        ref={(e) => setRefToNode(this._refs, 'wrapper', e)}>
        {this.props.children}
      </div>
    )
  }
}

InfiniteScroll.propTypes = {
  loadMore: React.PropTypes.func,
}

InfiniteScroll.defaultProps = {
  loadMore: () => {},
}

export default InfiniteScroll
