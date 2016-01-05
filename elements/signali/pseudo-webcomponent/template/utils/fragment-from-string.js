import fragmentFromCollection from './fragment-from-collection';
var tempParent = document.createElement('div');
export default function (html) {
  tempParent.innerHTML = html;
  return fragmentFromCollection(tempParent.childNodes);
}
