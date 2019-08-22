import m from "mithril"
import Stream from "mithril-stream"

import Presentations from "./presentations/component.js"
import Slides from "./slides/component.js"
import Editor from "./editor/component.js"
import Layout from "./layout/component.js"
import SlideShow from "./slideshow/component.js"
import { getPresentations } from "./presentations/model.js"
import { log } from "./services/index.js"

const makeRoutes = (mdl) => {
  let model = Stream(mdl)
  return {
    "/presentations": {
      render: () => m(Layout, model(), m(Presentations, model()))
    },
    "/presentation/:id/slides": {
      render: () => m(Layout, model(), m(Slides, model()))
    },
    "/edit/:pid/slide/:id": {
      render: () => m(Layout, model(), m(Editor, model()))
    },
    "/slideshow/:id": {
      onmatch: ({ id }) =>
        model().Models.CurrentPresentation.Slides.length == 0 &&
        m.route.set(`/presentation/${id}/slides`),
      render: () => m(Layout, model(), m(SlideShow, model()))
    }
  }
}

export const App = ({ attrs: model }) => {
  const state = {
    errors: ""
  }

  const onError = (error) => {
    log("error")(error)
    state.error = error
  }

  const onSuccess = (Models) => (dto) => (Models.Presentations = dto)

  const findPresentations = ({ attrs: { Models } }) =>
    getPresentations().fork(onError, onSuccess(Models))

  return {
    oninit: findPresentations,
    oncreate: ({ dom }) => {
      const main = dom.querySelector(".main")

      m.route(main, "/presentations", makeRoutes(model))
    },
    view: ({ children }) => {
      return m(".app", [m(".main", children)])
    }
  }
}

export default App
