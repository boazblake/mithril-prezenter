import m from "mithril"
import { loadSlide, editSlide } from "./model.js"

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

const Editor = (v) => {
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

  const logDom = (d) => {
    console.log("update", d)
    return d
  }

  return {
    oncreate: getSlide(),
    view: ({ attrs: { Models } }) =>
      m(".container.editor", [
        // { onscroll: logDom },
        m(
          ".card.editor-left",

          [
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
          ]
        ),
        m(
          ".editor-right",
          m.trust(
            Models.markup.convert(state.slide.content || "", {
              safe: "safe"
            })
          )
        )
      ])
  }
}

export default Editor
