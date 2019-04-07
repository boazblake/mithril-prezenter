import m from 'mithril'
import { assoc } from 'ramda'
import { saveSlideTask } from './model.js'

const SlidesModal = ({
  attrs: { left, pId, slide, toggleModal, getSlides, Models },
}) => {
  const state = {
    errors: '',
    title: '',
  }

  const onError = errors => {
    log('error')(errors)
    state.errors = errors
  }

  const onSuccess = slides => {
    getSlides({ attrs: { Models } })
    return toggleModal()
  }

  const save = e => {
    e.preventDefault()
    let dto = assoc('presentation_id', pId, assoc('title', state.title, slide))
    saveSlideTask(dto).fork(onError, onSuccess)
  }

  return {
    view: () =>
      m('article.modal-container', [
        m('.card', [
          m('.card-header', m('button.card-delete', {
            onclick: () => {
              return toggleModal()
            },
            'aria-label': 'close',
          })),
          m('.card-body', [
            m('fieldset', [
              m('label.modal-label', 'Slide Title'),
              m('input.modal-input', {
                type: 'text',
                onchange: e => state.title = e.target.value ,
              }),
            ]),
          ]),
          m('.card-footer', m('button.card-btn', { onclick: save }, 'save slide'))
        ])
      ]),
  }
}

export default SlidesModal