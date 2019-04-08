// index.jsx

import m from 'mithril'
const root = document.body


import './css.js'
import Models from './Models.js'
import App from './App.js'

m.render(root, m(App, { Models }))
