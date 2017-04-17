/* External dependencies */
import React from 'react'
import classNames from 'classnames'

/* Internal dependencies */
import styles from './Loader.scss'

class Loader extends React.Component {
  render() {
    /* It is intended code(this.props.isLoading?) duplication that prevents IE spinning bug. GitHub issue#96 */
    return (
      <div className={classNames(styles.wrapper, this.props.className)}>
        {this.props.isLoading ? <div className={styles.spinner} /> : null}
        {!this.props.isLoading ?
          <div className={classNames(styles.content, this.props.contentClassName)}>{this.props.children}</div> :
          null}
      </div>
    )
  }
}

Loader.propTypes = {
  isLoading: React.PropTypes.bool,
}

Loader.defaultProps = {
  isLoading: true,
}

export default Loader
