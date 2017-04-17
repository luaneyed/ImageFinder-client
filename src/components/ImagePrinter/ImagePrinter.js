/* External dependencies */
import React from 'react'

/* Internal dependencies */
import styles from './ImagePrinter.scss'

class ImagePrinter extends React.Component {
  getBinaryImageSrc(binary) {
    if (this.props.isQuery) {
      return binary.preview
    }
    return 'data:image/jpeg;base64,' + binary
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.info}>
          <div className={styles.description}>
            {this.props.description}
          </div>
          <div className={styles.name}>
            {this.props.name}
          </div>
        </div>
        <img src={this.getBinaryImageSrc(this.props.image)} />
      </div>
    )
  }
}


ImagePrinter.propTypes = {
}

ImagePrinter.defaultProps = {
}

export default ImagePrinter
