/* Internal dependencies */
import { get, postByFormData } from '../utils/ApiUtils'

export function getResults(imageName, next = null) {
  return get('find', { imageName, next })
}

export function sendImage(image, name) {
  const formData = new window.FormData()
  formData.append('image', image)
  formData.append('name', name)
  return postByFormData('find', formData)
}
