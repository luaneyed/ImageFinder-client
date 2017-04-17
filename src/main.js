/* Route */
import ReactDom from 'react-dom'
import routes from './routes'

/* Resouces */
require('./styles/global.scss')

/* Polyfill */
require('es6-promise').polyfill()
require('babel-polyfill')

ReactDom.render(routes, window.document.getElementById('main'))
