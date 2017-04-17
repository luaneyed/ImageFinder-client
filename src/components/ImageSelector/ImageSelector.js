/* External dependencies */
import React from 'react'
import Dropzone from 'react-dropzone'
import classNames from 'classnames'

/* Internal dependencies */
import styles from './ImageSelector.scss'

class ImageSelector extends React.Component {
  render() {
    return (
      <Dropzone
        className={classNames(this.props.className, styles.wrapper)}
        onDrop={this.props.onSelect}>
        <div className={styles.content}>
          {"이곳을 클릭하여 이미지를 선택하거나,\n이미지를 화면으로 드래그하세요."}
        </div>
      </Dropzone>
    )
  }
}


ImageSelector.propTypes = {
  onSelect: React.PropTypes.func,
}

ImageSelector.defaultProps = {
  onSelect: () => {},
}

export default ImageSelector
