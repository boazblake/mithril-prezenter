import m from 'mithril'
import Task from 'data.task'
import { makeQuery } from './index.js'
import {onlineUrl} from '../../secret.js'

const baseUrl = 'http://localhost:4466/'

export const postQl = query =>
  new Task((rej, res) =>
    m
      .request({
        method: 'POST',
        url: `${onlineUrl}`,
        withCredentials: false,
        data: makeQuery(query),
      })
      .then(res, rej)
  )

const postTask = url => ({ dto }) =>
  new Task((rej, res) =>
    m
      .request({
        method: 'POST',
        url: `${onlineUrl}/${url}`,
        data: dto,
        withCredentials: false,
      })
      .then(res, rej)
  )

const putTask = url => ({ dto }) =>
  new Task((rej, res) =>
    m
      .request({
        method: 'PUT',
        url: `${onlineUrl}/${url}`,
        data: dto,
        withCredentials: false,
      })
      .then(res, rej)
  )

const getTask = url =>
  new Task((rej, res) =>
    m
      .request({
        method: 'GET',
        url: `${onlineUrl}/${url}`,
        withCredentials: false,
      })
      .then(res, rej)
  )

const deleteTask = url => id =>
  new Task((rej, res) =>
    m
      .request({
        method: 'DELETE',
        url: `${onlineUrl}/${url}/${id}`,
        withCredentials: false,
      })
      .then(res, rej)
  )

export default { postTask, putTask, getTask, deleteTask, postQl }
