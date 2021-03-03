import m from "mithril"
const root = document.body

import "./styles/index.css"
import Models from "./Models.js"
import App from "./App.js"

m.render(root, m(App, { Models }))
