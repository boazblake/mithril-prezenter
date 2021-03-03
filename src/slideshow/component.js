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
    update: false,
    key: undefined,
    cursor: 0,
    size: Models.CurrentPresentation.slideShow().length,
    contents: pluck("content", Models.CurrentPresentation.slideShow())
  }

const calcStatePosition = (x) => x > (window.innerWidth/2) ? 'right' : 'left'

 const updateStatePosition = (x, state) =>
   state.key = calcStatePosition(x) == 'right' ?'ArrowRight':'ArrowLeft'


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
        if (target.children) prevSlide(target)
        break
      case "ArrowRight":
        if (target.children) nextSlide(target)
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
        ".slideshow .right",
        {
          tabindex: 0,
          onkeyup: ({ key, target }) => {
            state.update = true
            state.key = key
            changeSlide(key, target)
          },
          onclick: ({x, target}) => {
            state.update = true
            updateStatePosition(x, state)
            return changeSlide(state.key, target)
          }
        },
        m(
          ".slidecard",
          {
            onmouseenter:({x, target}) => {
              state.update = false
              target.style.cursor = calcStatePosition(x)
              console.log(calcStatePosition(x), target.style)
            },
            onmouseleave:({x, target}) => {
              state.update = false
              target.style.cursor = calcStatePosition(x), target
              console.log(calcStatePosition(x), target.style)
            },
            onbeforeupdate: () => !["ArrowUp", "ArrowDown"].includes(state.key) && state.update,
            onupdate: ({ dom }) => animateEntranceRight({ dom })
          },
          m.trust(Models.markup.render(state.contents[state.cursor] || ENDING))
        )
      )
  }
}

export default SlideShow
