import m from 'mithril'
import { loadSlide, editSlide } from './model.js'
import Remarkable from 'remarkable'
import hljs from 'highlight.js'

const md = new Remarkable('full', {
  html: false,
  xhtmlOut: false,
  breaks: false,
  langPrefix: 'language-',
  linkify: true,
  linkTarget: '',
  typographer: false,
  quotes: '“”‘’',
});

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

  const updateInput = input => (e) =>
    state.slide[input] = e.target.value


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
                oninput: updateInput('title'),
                value: state.slide.title,
              }),
            ]),
            m('textarea.editor-text', {
              oninput: updateInput('content'),
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
              m.trust(md.render(state.slide.content || ''))
            ),
        ]),
  }
}

export default Editor
