import m from "mithril"
import { isEmpty, length, split, view, lensProp } from "ramda"

const toggleModal = model => {
  return [
    m(
      "a.toolbar-item",
      {
        onclick: () => (model.toggleModal = !model.toggleModal),
      },
      "Add New"
    ),
  ]
}
const toPresentations = [
  m(
    "a.toolbar-item",
    {
      oncreate: m.route.link,
      href: "/presentations",
    },
    "Presentations"
  ),
]

const toSlides = model => [
  m(
    "a.toolbar-item",
    {
      oncreate: m.route.link,
      href: `/presentation/${model.CurrentPresentation.id}/slides`,
    },
    "slides"
  ),
]

const toSlideShow = model => [
  m(
    "a.toolbar-item",
    {
      disabled: isEmpty(length(model.CurrentPresentation.slideShow))
        ? true
        : false,
      oncreate: m.route.link,
      href: `/slideshow/${model.CurrentPresentation.id}`,
    },
    "Slide Show"
  ),
]

const navView = model => page => {
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

const actionView = model => page => {
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
  const currentPage = view(lensProp(1), split("/", m.route.get()))
  return {
    view: ({ attrs: { Models } }) =>
      m(".toolbar", [
        m(".toolbar-left", [navView(Models)(currentPage)]),
        m(".toolbar-right", [actionView(Models)(currentPage)]),
      ]),
  }
}

export default Toolbar
