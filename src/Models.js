import Stream from 'mithril-stream'

const SlideModel = {
  title: '',
  contents: '',
  order: 0,
  presentation_id: '',
}

const Slides = []

const Presentations = []

const SlideShowStruct = {
  keys: new Set(),
  values: {},
  items: Stream([]),
}

const CurrentPresentation = {
  title: '',
  id: '',
  slideShow: Stream([]),
  Slides,
}

const getProfile = (w)  => {
  if (w < 668) return 'phone'
  if (w < 920) return 'tablet'
  return 'desktop'
}

const Models = {
  profile:  getProfile(window.innerWidth),
  SlideShowStruct,
  Presentations,
  CurrentPresentation,
  SlideModel,
  toggleModal: false,
}

export default Models
