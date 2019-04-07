import m from 'mithril'
import { savePresentationTask } from './model.js'
import { log } from '../services/index.js'

const PresentationModal = ({ attrs }) => {
	const onError = (errors) => {
		log('error')(errors)
		attrs.state.errors = errors
		attrs.toggleModal()
	}
	const onSuccess = (p) => {
		attrs.state.title = ''
		attrs.state.errors = []
		attrs.presentations.push(p)
		attrs.toggleModal()
	}

	const save = (e) => {
		e.preventDefault()
		savePresentationTask(attrs.state).fork(onError, onSuccess)
	}

	return {
		view: () =>
			m('article.modal-container', [
				m('.card',[
					m('.card-header', m('button.card-delete', {
						onclick: () => {
							return attrs.toggleModal()
						},
						'aria-label': 'close',
					})),
					m('.card-body', [
						m('fieldset', [
							m('label.modal-label', 'Presentation Name'),
							m('input.modal-input', {
								type: 'text',
								onchange: e => attrs.state.title = e.target.value,
							}),
						]),
					]),
					m('.card-footer', m('button.card-btn', { onclick: save }, 'save presentation'))
				])
			]),
	}
}

export default PresentationModal

