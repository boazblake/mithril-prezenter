import m from 'mithril'
import Task from 'data.task'
import { log, makeQuery } from '../../services/index.js'
import { take, prop } from 'ramda'
import {
  updateSlideDragStart,
  updateSlideDragEnd,
  updateStateDragEnd,
  updateSlideTask,
  deleteSlideTask,
} from '../model.js'

const Slide = ({ attrs: { getSlides, Models, s, key, state } }) => {
  const onError = task => error => log(`error with ${task}`)(error)
  const onSuccess = _ => getSlides({ attrs: { Models } })

  const authDeleteTask = id =>
    window.confirm('Are you sure you want to delete?')
      ? Task.of(id)
      : Task.rejected(id)

  const removeSlideTask = id =>
    authDeleteTask(id)
      .chain(deleteSlideTask(state.presentationId))
      .fork(onError('deleting'), onSuccess)

  const addSlideToShow = s => {
    updateSlideTask(state.presentationId)([s]).fork(onError('updating'), _ => {
      state.slideDrag = {
        dragId: '',
        dragging: false,
        droppable: false,
      }
      onSuccess()
    })
  }

  const handleDragStart = ev => {
    ev.target.style.opacity = '0.4'
    ev.dataTransfer.effectAllowed = 'move'
    ev.dataTransfer.setData('text/plain', 'slide')
    state.slideDrag = updateSlideDragStart(s)(state.slideDrag)
  }

  const handleDragEnd = ev => {
    ev.target.style.opacity = '1'
    if (state.slideDrag.droppable) {
      let _slide = updateSlideDragEnd(state.right().length)(s)

      updateStateDragEnd(state.slideDrag)
      return addSlideToShow(_slide)
    }
  }

  return {
    view: ({ attrs: { s, state } }) =>
      m(
        '.card',
        {
          id: s.id,
          draggable: true,
          ondragstart: handleDragStart,
          ondragend: handleDragEnd,
        },
        [
          m('div.card-header', [
            m( 'h1.title', m('span', take(15, s.title))),
            m('button.card-delete', {
              onclick: () => removeSlideTask(s.id),
            }),
          ]),
          m('.card-footer', m('a.card-btn',{
              onclick: () =>
                m.route.set(`/edit/${state.presentationId}/slide/${s.id}`),
            },
                m('i.fas fa-edit'),
              ))
        ]
      ),
  }
}

export default Slide
