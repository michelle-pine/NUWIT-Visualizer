import { auth } from './classes/sync'
import NUWITVisualizer from './nuwit_visualizer'

if (window.location.hash === '#start') {
  // const template = new Template()
  const example = new Example()
} else {
  auth()
}