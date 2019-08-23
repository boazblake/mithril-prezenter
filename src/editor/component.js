import m from "mithril"
import { loadSlide, editSlide } from "./model.js"
import Loader from "../loader/component.js"

const Button = {
  view: ({ attrs: { action, label } }) =>
    m(
      "button.card-btn",
      {
        onclick: action
      },
      label
    )
}

const Editor = ({ attrs: { Models } }) => {
  let state = { presentationId: "", slide: { title: "", content: "", id: "" } }

  const toSlides = (_) =>
    m.route.set(`/presentation/${state.presentationId}/slides`)

  const onError = (error) => log("error")(error)

  const onSuccess = (slide) => {
    state.slide = slide
  }

  const getSlide = () => {
    state.slide.id = m.route.param("id")
    state.presentationId = m.route.param("pid")
    return loadSlide(state.slide.id).fork(onError, onSuccess)
  }

  const updateInput = (input) => (e) => (state.slide[input] = e.target.value)

  const save = (e) => {
    e.preventDefault()

    editSlide(state.slide).fork(onError, () => toSlides())
  }

  return {
    oncreate: getSlide(),
    view: ({ attrs: { Models } }) => {
      console.log("MODELS", Models)
      return m(".container.editor", [
        // { onscroll: logDom },
        m(".card.editor-left", [
          m(".card-header", [
            m("input.editor-input", {
              type: "text",
              placeholder: "Slide Title",
              oninput: updateInput("title"),
              value: state.slide.title
            })
          ]),
          m("textarea.editor-text", {
            oninput: updateInput("content"),
            value: state.slide.content
          }),
          m(".card-footer", [
            m(Button, { action: save, label: "Save" }),
            m(Button, { action: toSlides, label: "Cancel" })
          ])
        ]),
        m(
          ".editor-right",
          m.trust(Models.markup.render(state.slide.content || ""))
        )
      ])
    }
  }
}

export default Editor
