import m from 'mithril'
import { clone } from 'ramda'
import {
  animateFadeIn,
} from '../services/animations.js'
import PresentationModal from './presentationModal.js'
import Presentation from './Presentation/component.js'


const Presentations = ({ attrs: { Models } }) => {
  const state = {
    errors: [],
    title: '',
  }

  return {
    view: ({ attrs: { Models } }) => [
      Models.toggleModal
        ? m(PresentationModal, {
            Models,
            state,
            toggleModal: () => (Models.toggleModal = !Models.toggleModal),
            presentations: Models.Presentations,
            presentationModel: clone(Models.PresentationModel),
          })
        : '',

      m(
        '.container.presentations',
        {
          oncreate: ({ dom }) => animateFadeIn({ dom }),
          onBeforeRemove: (vnode, done) => {
            vnode.dom.addEventListener('animationend', done)
            vnode.dom.style.animation = 'fadeOut 1s'
          },
        },
        [
          Models.Presentations &&
            Models.Presentations.map(({ title, id }) =>
              m(Presentation, {
                key: id,
                id,
                title,
                Models,
              })
            ),
        ]
      ),
    ],
  }
}

export default Presentations
