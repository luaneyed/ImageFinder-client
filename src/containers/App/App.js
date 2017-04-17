/* External dependencies */
import React from 'react'
import selectn from 'selectn'
import { Container } from 'flux/utils'
import Dropzone from 'react-dropzone'
import moment from 'moment'

/* Internal dependencies */
import styles from './App.scss'
import { requestSendQuery, requestGetNextResult } from '../../actions/QueryActionCreator'
import Loader from '../../components/Loader'
import ImagePrinter from '../../components/ImagePrinter'
import ImageSelector from '../../components/ImageSelector'
import InfiniteScroll from '../../components/InfiniteScroll'
import ImagesStore from '../../stores/ImagesStore'

class App extends React.Component {
  static getStores() {
    return [ImagesStore]
  }

  static calculateState() {
    return {
      queryImage: ImagesStore.getQueryImage(),
      ranking: ImagesStore.getRanking(),
      results: ImagesStore.getResults(),
    }
  }

  constructor() {
    super()
    this.onImageInput = this.onImageInput.bind(this)
    this.onLoadMore = this.onLoadMore.bind(this)
    this.toggleRanking = this.toggleRanking.bind(this)
    this.renderRanking = this.renderRanking.bind(this)
    this.next = null
    this.state = {
      isFetching: false,
      openRanking: true,
    }
  }

  componentWillMount() {
    this.setState({
      isFetching: false,
      openRanking: true,
    })
  }

  onImageInput(files) {
    if (files.length) {
      this.setState({ isFetching: true })
      requestSendQuery(files[0], {
        successCallback: (response) => {
          this.next = selectn('response.next', response)
          this.setState({ isFetching: false })
        },
        errorCallback: () => {
          this.setState({ isFetching: false })
        }
      })
    }
  }

  onLoadMore() {
    if (this.next) {
      requestGetNextResult(this.next, {
        successCallback: (response) => {
          this.next = selectn('response.next', response)
        },
      })
    }
  }

  handlePaste(event) {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items
    if (items.length === 2) {
      const stringData = items[0]
      const type = items[1].type
      const blob = items[1].getAsFile()
      if (stringData.kind === 'string' && blob.size > 0) {
        stringData.getAsString((fileName) => {
          const file = new window.File([blob], fileName, { type })
          this.onImageInput([file])
        })
      }
    } else if (items.length === 1) {
      const item = items[0]
      if (item.kind === 'file' && item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile()
        const type = (blob.type || '').split('/').pop()
        const fileName = `${moment().format('x')}.${type}`
        const file = new window.File([blob], fileName, { type: item.type })
        this.onImageInput([file])
      }
    } else if (items.length === 4) {
      const item = items[3]
      if (item.kind === 'file' && item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile()
        const type = (blob.type || '').split('/').pop()
        const fileName = `${moment().format('x')}.${type}`
        const file = new window.File([blob], fileName, { type: item.type })
        this.onImageInput([file])
      }
    }
  }

  toggleRanking() {
    this.setState({ openRanking: !this.state.openRanking })
  }

  renderRanking() {
    return (<div className={styles.ranking}>
      {this.state.ranking.map((rank) => (
        <div key={rank.get('path')} className={styles.rank}>
          {`score : ${rank.get('score')} , path : ${rank.get('path')}`}
        </div>
      ))}
    </div>)
  }

  render() {
    return (
      <Loader isLoading={this.state.isFetching}>
        <div onPaste={this.handlePaste} className={styles.wrapper}>
          <Dropzone
            className={styles.dropzone}
            activeClassName={ styles.active }
            disableClick
            onDrop={this.onImageInput}>
            <ImageSelector className={styles.imageSelector} onSelect={this.onImageInput} />
            <div className={styles.content}>
              {
                this.state.ranking.size > 0 ?
                  (<div className={styles.rankingButton} onClick={this.toggleRanking}>
                    {
                      this.state.openRanking ?
                        `텍스트 랭킹 닫기 (총 ${this.state.ranking.size}개의 결과)` :
                        `텍스트 랭킹 열기 (총 ${this.state.ranking.size}개의 결과)`
                    }
                  </div>) :
                  null
              }
              {
                this.state.openRanking ?
                  this.renderRanking() :
                  null
              }
              {
                this.state.queryImage ?
                  (<InfiniteScroll className={styles.imageView} loadMore={this.onLoadMore}>
                    <ImagePrinter
                      description="Query Image"
                      name=""
                      image={this.state.queryImage}
                      isQuery />
                    {
                      this.state.results.map((result, key) => (
                        <ImagePrinter
                          key={key}
                          description={`[Ranking ${key + 1} of ${this.state.ranking.size}]  Score ${result.get('score')}`}
                          name={result.get('path')}
                          image={result.get('image')}
                          isQuery={false} />
                      ))
                    }
                  </InfiniteScroll>) :
                  null
              }

            </div>
          </Dropzone>
        </div>
      </Loader>
    )
  }
}

export default Container.create(App)
