import { tagged } from "daggy";

const SlideModel = tagged("position", "uuid", "title", "isSelected", "content");

const UserModel = {
  presentations: [],
  slides: [],
  slideShow: [],
  name: ""
};

const User = {
  presentations: [],
  slides: [],
  slideShow: [],
  name: ""
};

const Models = {
  User,
  SlideModel
};
export default Models;
