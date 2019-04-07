import m from 'mithril'
import { pluck } from 'ramda'
import {
  animateEntrance,
  animateExit,
  animateFadeIn,
} from '../services/animations.js'
import Remarkable from 'remarkable'

const md = new Remarkable('full', {
  html: false,
  xhtmlOut: false,
  breaks: false,
  langPrefix: 'language-',
  linkify: true,
  linkTarget: '',
  typographer: true,
  quotes: '“”‘’',
});



const SlideShow = ({ attrs: { Models } }) => {
  const state = {
    cursor: 0,
    isFullscreenWidth: 'vh',
    isFullscreenHeight: '%',
    clicks: 0,
    size: Models.CurrentPresentation.slideShow().length,
    contents: pluck('content', Models.CurrentPresentation.slideShow()),
  }

  const nextSlide = () => (state.cursor == state.size ? '' : state.cursor++)

  const prevSlide = () => (state.cursor == 0 ? '' : state.cursor--)

  const changeSlide = key => {
    switch (key) {
      case 'ArrowLeft':
        prevSlide()
        break
      case 'ArrowRight':
        nextSlide()
        break
    }
  }

  return {
    oninit: (state.slide = state.contents[state.cursor]),
    view: ({ attrs: { Models } }) => {
      return m(
        '.slideshow',
        {
          onupdate: ({ dom }) => animateFadeIn({ dom }),
          oncreate: ({ dom }) => animateEntrance({ dom }),
          onBeforeRemove: ({ dom }) => animateExit({ dom }),
          tabindex: 0,
          onkeyup: ({ key }) => {
            changeSlide(key)
          },
        },
        m.trust(md.render(state.contents[state.cursor]) || '~ FIN ~')
      )
    },
  }
}

export default SlideShow
