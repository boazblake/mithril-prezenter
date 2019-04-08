import m from 'mithril'
import {
  concat,
  eqProps,
  compose,
  filter,
  map,
  propEq,
  head,
} from 'ramda'
import { log } from '../../services/index.js'
import {
  animateExit,
  animateFadeIn,
} from '../../services/animations.js'
import {
  forGreater,
  reduceOrder,
  updateRemoveSlide,
  updateSlideTask,
} from '../model.js'
import marked from 'marked'


marked.setOptions({
  baseUrl: null,
  breaks: false,
  gfm: true,
  headerIds: true,
  headerPrefix: '',
  highlight: null,
  langPrefix: 'language-js',
  mangle: true,
  pedantic: false,
  sanitize: false,
  sanitizer: null,
  silent: true,
  smartLists: true,
  smartypants: true,
  tables: true,
  xhtml: true,
})

const Preview = ({ attrs: { getSlides, Models, s, key, state } }) => {
  const onError = task => error => log(`error with ${task}`)(error)
  const onSuccess = _ => getSlides({ attrs: { Models } })

  const updateAndSaveSlideTask = slides => {
    return updateSlideTask(Models.CurrentPresentation.id)(slides).fork(
      onError('updating'),
      onSuccess
    )
  }

  const removeSlideTask = s => {
    let tail = compose(map(reduceOrder), filter(forGreater(s)))(state.right())
    let removeSlide = updateRemoveSlide(s)

    let updateList = concat(removeSlide, tail)

    updateAndSaveSlideTask(updateList)
  }

  const handleDragStart = ev => {
    ev.target.style.opacity = '0.4'
    ev.dataTransfer.effectAllowed = 'move'
    ev.dataTransfer.setData('text/plain', 'preview')
    state.previewDrag.drag = head(filter(propEq('id', s.id), state.right()))
  }

  const handleDragOver = ev => {
    ev.preventDefault()

    if (state.previewDrag.drag) state.previewDrag.drop = s
  }

  const handleDragLeave = ev => {
    ev.preventDefault()
    state.previewDrag.drop = null
  }

  const handleDrop = ev => ev.preventDefault()

  const handleDragEnd = ev => {
    ev.target.style.opacity = '1'
    state.slideDrag.dragging = false
    if (state.previewDrag.drop) {
      let start = state.previewDrag.drag.order
      let end = state.previewDrag.drop.order

      let dragged = state.previewDrag.drag
      let dropped = state.previewDrag.drop

      state.previewDrag.drag = Models.SlideModel
      state.previewDrag.drop = Models.SlideModel

      if (!eqProps('id', dragged, dropped)) {
        dragged.order = end
        dropped.order = start

        updateAndSaveSlideTask([dragged, dropped])
      }
    }
  }

  return {
    oncreate: ({ dom }) => animateFadeIn({ dom }),
    view: ({ attrs: { s, state } }) =>
      m('.card.preview', {
        draggable: true,
        ondragstart: handleDragStart,
        ondragend: handleDragEnd,
        ondragover: handleDragOver,
        ondrop: handleDrop,
        ondragleave: handleDragLeave,
        style: {
          opacity:
            state.previewDrag.drop && state.previewDrag.drop.id == s.id
              ? 0.4
              : 1,
        },
      },
      [
        m('.card-header',
          [
            m(
            'span.slidePosition',
            s.order
          ),
          m(
            'a.preview-delete.card-delete',
            {
              'z-index': 1,
              onclick: () => removeSlideTask(s),
            },
          )
          ]
          ),
        m('.card-body', [
            m.trust(marked(s.content))
        ]),
      ])
    }
}

export default Preview
