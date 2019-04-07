import m from 'mithril'
import Remarkable from 'remarkable'
import { loadSlide, editSlide } from './model.js'

const marked = new Remarkable()

const Editor = ( ) => {
  let state = { presentationId: '', slide: { title: '', content: '', id: '' } }

  const toSlides = _ =>
    m.route.set(`/presentation/${state.presentationId}/slides`)

  const onError = error => log('error')(error)

  const onSuccess = slide => {
    state.slide = slide
  }

  const getSlide = ( ) => {
    state.slide.id = m.route.param('id')
    state.presentationId = m.route.param('pid')
    return loadSlide(state.slide.id).fork(onError, onSuccess)
  }

  const updateTitle = text => (state.slide.title = text)
  const updateContents = text => (state.slide.content = text)

  const save = e => {
    e.preventDefault()

    editSlide(state.slide).fork(onError, () => toSlides())
  }

  return {
    oncreate: getSlide,
    view: ({ attrs: { Models } }) =>
        m('.container', [
          m('.editor-left.card',  [
            m('.card-header', [
              m('input.editor-input', {
                type: 'text',
                placeholder: 'Slide Title',
                oninput: m.withAttr('value', updateTitle),
                value: state.slide.title,
              }),
            ]),
            m('textarea.editor-text', {
              oninput: m.withAttr('value', updateContents),
              value: state.slide.content,
            }),
            m('.card-footer', [
              m(
                'button.card-btn',
                {
                  onclick: save,
                },
                'Save'
              ),
              m(
                'button.card-btn',
                {
                  onclick: toSlides,
                },
                'Cancel'
              )
                ]
              ),
            ]),
          m('.editor-right',
              m.trust(marked.render(state.slide.content || ''))
            ),
        ]),
  }
}

export default Editor
