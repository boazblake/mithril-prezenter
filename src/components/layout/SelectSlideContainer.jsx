const m = require("mithril");
import Stream from "mithril/stream";

import { contains, without, not, lensProp, over, compose } from "ramda";

import SlideSelectCard from "./../cards/SlideSelectCard.jsx";
import SlideSelectField from "./../cards/SlideSelectField.jsx";
import User from "./../../models/index.js";
import { lazyMap } from "./../../utils/index.js";

const slidesModel = lazyMap({
  isSelected: Stream(false),
  position: Stream(0)
});

const toggleSelection = slide => state => {
  state.isSelected(!state.isSelected());
  return User.toggleSelection(slide);
};

const SelectSlideContainer = {
  oninit: vnode => {
    User.setSlides(vnode.attrs.slide);
    vnode.state = slidesModel;
  },
  view: vnode => {
    const slides = vnode.attrs.slide.slides;
    return slides.map(slide => (
      <SlideSelectCard
        slide={slide}
        state={vnode.state}
        edit={editCard}
        toggle={toggleSelection}
      />
    ));
  }
};

const selectedLens = lensProp("isSelected");

const setColor = slideshow => slide =>
  contains(slide, slideshow) ? "yellow" : "green";

export const editCard = slide => m.route.set(`/editor/${slide.id}`);

export default SelectSlideContainer;
