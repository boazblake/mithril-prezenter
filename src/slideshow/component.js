import m from "mithril"
import { pluck } from "ramda"
import { animateEntranceRight } from "../services/animations.js"

const ENDING = `<div class="endingContainer">
  <h1 class="endingTitle">THE END!</h1>
  <img class="endingImg" id="ending" src="https://imgur.com/uj15GJp.gif" width="100%" />
</div>
`

const SlideShow = ({ attrs: { Models } }) => {
  const state = {
    key: undefined,
    cursor: 0,
    size: Models.CurrentPresentation.slideShow().length,
    contents: pluck("content", Models.CurrentPresentation.slideShow())
  }

  const nextSlide = (dom) => {
    dom.children[0].children[0].scrollIntoView({ behaviour: "smooth" })
    if (state.cursor == state.size - 1) state.contents[state.cursor] = ENDING
    else {
      state.cursor++
    }
    return state
  }

  const prevSlide = (dom) => {
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
    view: ({ attrs: { Models } }) =>
      m(
        ".slideshow",
        {
          tabindex: 0,
          onkeyup: ({ key, target }) => {
            state.key = key
            changeSlide(key, target)
          }
        },
        m(
          ".slidecard",
          {
            onbeforeupdate: () => !["ArrowUp", "ArrowDown"].includes(state.key),
            onupdate: ({ dom }) => animateEntranceRight({ dom })
          },
          m.trust(Models.markup.render(state.contents[state.cursor] || ENDING))
        )
      )
  }
}

export default SlideShow
