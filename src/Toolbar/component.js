import m from "mithril"
import { isEmpty, length, split, view, lensProp } from "ramda"

const toggleModal = (model) => {
  return [
    m(
      "a.toolbar-item",
      {
        onclick: () => (model.toggleModal = !model.toggleModal)
      },
      "Add New"
    )
  ]
}
const toPresentations = [
  m(
    m.route.Link,
    {
      class: "toolbar-item",
      oncreate: m.route.link,
      href: "/presentations"
    },
    "Presentations"
  )
]

const toSlides = (model) => [
  m(
    m.route.Link,
    {
      class: "toolbar-item",
      oncreate: m.route.link,
      href: `/presentation/${model.CurrentPresentation.id}/slides`
    },
    "slides"
  )
]

const toSlideShow = (model) => [
  m(
    m.route.Link,
    {
      class: "toolbar-item",
      disabled: isEmpty(length(model.CurrentPresentation.slideShow))
        ? true
        : false,
      oncreate: m.route.link,
      href: `/slideshow/${model.CurrentPresentation.id}`
    },
    "Slide Show"
  )
]

const navView = (model) => {
  let page = view(lensProp(1), split("/", m.route.get()))
  switch (page) {
    case "presentation":
      return [toPresentations, toSlideShow(model)]
      break

    case "slideshow":
      return [toPresentations, toSlides(model)]
      break

    case "slides":
      return [toPresentations, toSlideShow(model)]
      break

    case "edit":
      return [toPresentations, toSlides(model), toSlideShow(model)]
      break
    default:
  }
}

const actionView = (model) => {
  let page = view(lensProp(1), split("/", m.route.get()))
  switch (page) {
    case "presentations":
      return [toggleModal(model)]
      break
    case "presentation":
      return [toggleModal(model)]
      break
    default:
  }
}

const Toolbar = ({ attrs: { Models } }) => {
  return {
    view: ({ attrs: { Models } }) =>
      m(".toolbar", [
        m(".toolbar-left", [navView(Models)]),
        m(".toolbar-right", [actionView(Models)])
      ])
  }
}

export default Toolbar
