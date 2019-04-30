import m from "mithril"
import { pluck } from "ramda"
import Remarkable from "remarkable"
import {
  animateSlideEntrance,
  animateEntranceRight
} from "../services/animations.js"

const md = new Remarkable("full", {
  html: false,
  xhtmlOut: false,
  breaks: false,
  langPrefix: "language-",
  linkify: true,
  linkTarget: "",
  typographer: true,
  quotes: "“”‘’"
})

const SlideShow = ({ attrs: { Models } }) => {
  const state = {
    cursor: 0,
    isFullscreenWidth: "vh",
    isFullscreenHeight: "%",
    clicks: 0,
    size: Models.CurrentPresentation.slideShow().length,
    contents: pluck("content", Models.CurrentPresentation.slideShow())
  }

  const nextSlide = (dom) => {
    dom.children[0].children[0].scrollIntoView({ behaviour: "smooth" })
    state.cursor == state.size ? "" : state.cursor++
  }

  const prevSlide = (dom) => {
    dom.children[0].children[0].scrollIntoView({ behaviour: "smooth" })
    state.cursor == 0 ? "" : state.cursor--
  }

  const changeSlide = (key, target) => {
    switch (key) {
      case "ArrowLeft":
        prevSlide(target)
        break
      case "ArrowRight":
        nextSlide(target)
        break
    }
  }

  return {
    oninit: (state.slide = state.contents[state.cursor]),
    view: ({ attrs: { Models } }) => {
      return m(
        ".slideshow",
        {
          tabindex: 0,
          onkeyup: ({ key, target }) => {
            changeSlide(key, target)
          }
        },
        m(
          ".slidecard",
          {
            onupdate: ({ dom }) => animateEntranceRight({ dom })
          },
          m.trust(md.render(state.contents[state.cursor]) || "~ FIN ~")
        )
      )
    }
  }
}

export default SlideShow
