import m from "mithril"
import { isEmpty, split, view, lensProp,   } from "ramda"


const login = model =>
  m(
    "a.toolbar-item",
    {
      onclick: () => (model.toggleModal = !model.toggleModal)
    },
    "Login"
  )



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

const toSlideShow = (model) =>   model.CurrentPresentation &&
    !isEmpty(model.CurrentPresentation.slideShow())
    && m(
        m.route.Link,
        {
          class: "toolbar-item",
          oncreate: m.route.link,
          href: `/slideshow/${model.CurrentPresentation.id}`
        },
        "Slide Show"
      )

const printToPDF = model =>
  m(
   '.toolbar-item',
    {
      onclick: e => model.caputerScreen()
    },
    "Print Slide"
  )

const navView = (model) => {
  let page = view(lensProp(1), split("/", m.route.get()))
  switch (page) {
    case "presentation":
      return [login(model), toPresentations, toSlideShow(model)]
      break

    case "slideshow":
      return [login(model), toPresentations, toSlides(model)]
      break

    case "slides":
      return [login(model), toPresentations, toSlideShow(model)]
      break

    case "edit":
      return [login(model), toPresentations, toSlides(model), toSlideShow(model)]
      break
    default:
  }
}

const actionView = (model) => {
  let page = view(lensProp(1), split("/", m.route.get()))
  switch (page) {
    case "presentations":
      return [login(model), toggleModal(model)]
      break
    case "presentation":
      return [login(model),  toggleModal(model)]
      break
    case "slideshow":
      return [login(model),  printToPDF(model)]
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
