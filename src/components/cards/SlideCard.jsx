const m = require('mithril')

import SlideField from './SlideField.jsx'

const SlideCard = {
  view : ({attrs}) =>
    <div class="slide-card">
      <div class="slide-fields">
        <SlideField fieldValue={`${attrs.slide.text}`}/>
      </div>
    </div>
}


export default SlideCard