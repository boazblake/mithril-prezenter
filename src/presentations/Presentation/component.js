import m from 'mithril'
import { log } from '../../services/index.js'
import { without } from 'ramda'
import { deletePresentationsTask } from '../model.js'
import Task from 'data.task'

const Presentation = ({ attrs: { title, id, Models } }) => {
  const onError = task => error => log(`error with ${task}`)(error)
  const onSuccess = models => deleted => {
    return (Models.Presentations = without([deleted], Models.Presentations))
  }

  const authDeleteTask = id =>
    window.confirm('Are you sure you want to delete?')
      ? Task.of(id)
      : Task.rejected(id)

  const removePresTask = pId =>
    authDeleteTask(pId)
      .chain(deletePresentationsTask)
      .fork(onError('deleting'), onSuccess(Models))

  return {
    view: ({ attrs: { title, id, Models } }) =>
      m('.card', [
        m('div.card-header', [
          m(
            'button.card-btn',
            {
              onclick: () => m.route.set(`/presentation/${id}/slides`),
            },
            title
          ),
          m('button.card-delete', {
            onclick: () => removePresTask(id),
          }),
        ]),
        m('div.card-body', [

        ]),
        m('div.card-footer', [

        ]),
      ]),
  }
}

export default Presentation
