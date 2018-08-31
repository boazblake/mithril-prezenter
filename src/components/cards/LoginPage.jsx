const m = require("mithril");

import Task from "data.task";
import { compose, pluck, toLower, filter, prop, traverse } from "ramda";

import Requests from "../../services/Requests.js";
import UIButton from "./../ui/UIButton.jsx";

const getPresentationsTask = gists => {
  let presentations = [];
  let ids = pluck("id", gists);
  ids.map(id => Requests.getPresentations(id).then(p => presentations.push(p)));
  return Task.of(presentations);
};

const loginTask = user =>
  new Task((rej, res) => Requests.getGists(user.getName()).then(res, rej));

const updateName = user => e => user.setName(e.target.value);

const onError = error => console.error(error);

const onSuccess = user => data => {
  user.setPresentations(data);
  m.route.set("/presentations");
};

const login = user =>
  loginTask(user)
    .chain(getPresentationsTask)
    .fork(onError, onSuccess(user));

const LoginPage = {
  view: vnode => (
    <div class="login container">
      <h1 class="app-title title">PREZENTER</h1>
      <h2 class="app-description sub-title">
        Save Your prezentations as gists.
      </h2>
      <input class="input" onchange={updateName(vnode.attrs.user)} />
      <UIButton action={() => login(vnode.attrs.user)} buttonName="LOGIN" />
    </div>
  )
};

export default LoginPage;
