import m from "mithril"
import { pluck } from "ramda"
import { animateEntranceRight } from "../services/animations.js"
import remarkable from "remarkable"

const md = new remarkable("full", {
  baseUrl: null,
  breaks: false,
  gfm: true,
  headerIds: true,
  headerPrefix: "",
  highlight: null,
  langPrefix: "lang-",
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

const SlideShow = ({ attrs: { Models } }) => {
  const state = {
    key: undefined,
    cursor: 0,
    size: Models.CurrentPresentation.slideShow().length,
    contents: pluck("content", Models.CurrentPresentation.slideShow()),
  }

  const nextSlide = dom => {
    dom.children[0].children[0].scrollIntoView({ behaviour: "smooth" })
    state.cursor == state.size - 1 ? state.cursor : state.cursor++
  }

  const prevSlide = dom => {
    dom.children[0].children[0].scrollIntoView({ behaviour: "smooth" })
    state.cursor == 0 ? state.cursor : state.cursor--
  }

  const changeSlide = (key, target) => {
    switch (key) {
      case "ArrowLeft":
        prevSlide(target)
        break
      case "ArrowRight":
        nextSlide(target)
        break
      case "ArrowUp":
        target.scrollBy(0, 100)
        break
      case "ArrowDown":
        target.scrollBy(0, -100)
        break
    }
  }

  return {
    dir: state.key,
    oninit: (state.slide = state.contents[state.cursor]),
    view: ({ attrs: { Models } }) => {
      return m(
        ".slideshow",
        {
          tabindex: 0,
          onkeyup: ({ key, target }) => {
            state.key = key
            changeSlide(key, target)
          },
        },
        m(
          ".slidecard",
          {
            onbeforeupdate: () => !["ArrowUp", "ArrowDown"].includes(state.key),
            onupdate: ({ dom }) => animateEntranceRight({ dom }),
          },
          m.trust(md.render(state.contents[state.cursor]) || "~ FIN ~")
        )
      )
    },
  }
}

export default SlideShow
