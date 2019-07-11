import Stream from "mithril-stream"
import remarkable from "remarkable"

const markup = new remarkable("full", {
  baseUrl: null,
  breaks: false,
  gfm: true,
  headerIds: true,
  headerPrefix: "",
  highlight: null,
  langPrefix: "lang-",
  mangle: true,
  pedantic: false,
  sanitize: false,
  sanitizer: null,
  silent: true,
  smartLists: true,
  smartypants: true,
  tables: true,
  xhtml: true,
  html: true,
  linkify: true,
  linkTarget: "",
  typographer: true,
  quotes: "“”‘’",
})

const SlideModel = {
  title: "",
  contents: "",
  order: 0,
  presentation_id: "",
}

const Slides = []

const Presentations = []

const SlideShowStruct = {
  keys: new Set(),
  values: {},
  items: Stream([]),
}

const CurrentPresentation = {
  title: "",
  id: "",
  slideShow: Stream([]),
  Slides,
}

const getProfile = w => {
  if (w < 668) return "phone"
  if (w < 920) return "tablet"
  return "desktop"
}

const Models = {
  markup,
  profile: getProfile(window.innerWidth),
  SlideShowStruct,
  Presentations,
  CurrentPresentation,
  SlideModel,
  toggleModal: false,
}

export default Models
