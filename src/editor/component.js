import m from "mithril"
import { loadSlide, editSlide } from "./model.js"
import remarkable from "remarkable"

const md = new remarkable("full", {
  baseUrl: null,
  breaks: false,
  gfm: true,
  headerIds: true,
  headerPrefix: "",
  highlight: null,
  langPrefix: "lan-",
  mangle: true,
  pedantic: false,
  sanitize: false,
  sanitizer: null,
  silent: true,
  smartLists: true,
  smartypants: true,
  tables: true,
  xhtml: true,
  html: true,
  linkify: true,
  linkTarget: "",
  typographer: true,
  quotes: "“”‘’",
})

const Editor = () => {
  let state = { presentationId: "", slide: { title: "", content: "", id: "" } }

  const toSlides = _ =>
    m.route.set(`/presentation/${state.presentationId}/slides`)

  const onError = error => log("error")(error)

  const onSuccess = slide => {
    state.slide = slide
  }

  const getSlide = () => {
    state.slide.id = m.route.param("id")
    state.presentationId = m.route.param("pid")
    return loadSlide(state.slide.id).fork(onError, onSuccess)
  }

  const updateInput = input => e => (state.slide[input] = e.target.value)

  const save = e => {
    e.preventDefault()

    editSlide(state.slide).fork(onError, () => toSlides())
  }

  return {
    oncreate: getSlide,
    view: ({ attrs: { Models } }) =>
      m(".container", [
        m(".editor-left.card", [
          m(".card-header", [
            m("input.editor-input", {
              type: "text",
              placeholder: "Slide Title",
              oninput: updateInput("title"),
              value: state.slide.title,
            }),
          ]),
          m("textarea.editor-text", {
            oninput: updateInput("content"),
            value: state.slide.content,
          }),
          m(".card-footer", [
            m(
              "button.card-btn",
              {
                onclick: save,
              },
              "Save"
            ),
            m(
              "button.card-btn",
              {
                onclick: toSlides,
              },
              "Cancel"
            ),
          ]),
        ]),
        m(".editor-right", m.trust(md.render(state.slide.content || ""))),
      ]),
  }
}

export default Editor
