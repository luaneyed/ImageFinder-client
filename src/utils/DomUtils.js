
export default function setRefToNode(refs, key, elem) {
  if (!refs[key]) {
    refs[key] = elem
  }
}
