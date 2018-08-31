const m = require("mithril");
import Models from "./models/index.js"

import MainStage from "./components/layout/MainStage.jsx";
import ViewLayout from "./components/layout/ViewLayout.jsx";
import NavBar from "./components/layout/NavBar.jsx";

import StageBanner from "./components/ui/StageBanner.jsx";
import CardContainer from "./components/layout/CardContainer.jsx";
import PresentationSelectContainer from "./components/layout/PresentationSelectContainer.jsx";
import LoginPage from "./components/cards/LoginPage.jsx";
import SelectSlideContainer from "./components/layout/SelectSlideContainer.jsx";
import SlideCard from "./components/cards/SlideCard.jsx";
import SlideEditor from "./components/SlideEditor.jsx";

const goToLogin = _ => m.route.set("/login");

const LoginView = init => (
  <ViewLayout
    action={init.action}
    title={init.title}
    children={init.children}
  />
);

const PresentationsListView = presentations => [
  <StageBanner action={_ => m.route.set("/login")} title="Presentations" />,
  <CardContainer />
];

const NewSlideView = items => [
  <StageBanner action={_ => m.route.set("/login")} title="Slides" />,
  <CardContainer />
];

const SlideShow = slides => [
  <StageBanner
    action={_ => m.route.set("/login")}
    title="TODO:: GET DB NAME HERE"
  />,
  <CardContainer>
    {slides.map(slide => (
      <SlideCard isSelected={true} slide={slide} />
    ))}
  </CardContainer>
];

const EditorView = list => [
  <StageBanner action={_ => m.route.set("/login")} title="Edit A Slide" />,
  <CardContainer>
    <SlideEditor list={list} />
  </CardContainer>
];

const SLIDE_ADDER = list => [
  <StageBanner action={_ => m.route.set("/login")} title="Add A Slide" />,
  <CardContainer>
    <SlideEditor list={list} />
  </CardContainer>
];

const routes = {
  "/login": {
    view: () =>
      LoginView({
        action: _ => goToLogin,
        title: "Login",
        children: <LoginPage user={user} />
      })
  },
  "/presentations": {
    view: () =>
      PresentationsListView({
        action: _ => goToLogin,
        title: "Presentations",
        children: <PresentationSelectContainer user={user} />
      })
  },
  "/newSlide": {
    view: () =>
      NewSlideView({
        action: _ => goToLogin,
        title: "Login",
        children: user.slides.map(slide => (
          <SelectSlideContainer user={user} />
        ))
      })
  },
  '/slides/:PresentationId"': {
    view: () =>
      SlidesListView({
        action: _ => goToLogin,
        title: "Login",
        children: <LoginPage user={user} />
      })
  },
  "/presentation": {
    view: () =>
      PresentationView({
        action: _ => goToLogin,
        title: "Login",
        children: <LoginPage user={user} />
      })
  },
  "/editor/:slideId": {
    view: () =>
      EditorView({
        action: _ => goToLogin,
        title: "Login",
        children: <LoginPage user={user} />
      })
  }
};

const App = models => {


  return {
    oncreate: vnode => {
      const MainStage = vnode.dom.querySelector(".main-stage");

      return m.route(MainStage, "/login", routes);
    },
    view: ({ children }) => (
      <div class="App">
        <NavBar routes={routes} />
        <MainStage>{children}</MainStage>
      </div>
    )
  }
};

const createView = (model, actions) => {
  console.log('model', model)
  console.log('actions', actions)

  return vwApp = (model, actions) => {



    <div class="App">
      <NavBar routes={model.paths} />
      <MainStage>
        <ViewLayout
          action={init.action}
          title={init.title}
          children={init.children}
        />
      </MainStage>
    </div>
  }
}

const createRouteResolver = (model, actions, view) => {
  return model.paths.reduce((acc, path) => {
    acc[path.route] = {
      onmatch: (params, route) => {
        actions.onNavigateTo(path.name, params)
      },
      render: () => view(model, action)
    }
  })
}


const createActions = model =>
  ({
    onNavigateTo: (routeName, params) => {
      model.routeName = routeName
      model.params = params
    }
  })


const createModel = settings => {
  return ({
    paths: settings.paths.slice()
    , routeName: undefined
    , params: undefined
  })
}


const getSettings = _ => ({
  paths: [{ name: "login", route: "/login" }
    , { name: "presentations", route: "/presentations" }
    , { name: "addSlide", route: "/addSlide" }
    , { name: "slides", route: "/slides/:PresentationId" }
    , { name: "slideShow", route: "/slideShow" }
    , { name: "editor", route: "/editor/:slideId" }
  ]
  , defaultRoute: "/login"
})

const Main = () => {
  const settings = getSettings()
    , model = createModel(settings)
    , actions = createActions(model)
    , view = createView(model, actions)
    , routeResolver = createRouteResolver(model, actions, view)

  m.route(MainStage, settings.defaultRoute, routeResolver)
}

export default Main()
