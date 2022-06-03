import {
  faAngleDoubleUp,
  faAngleUp,
  faMinus,
  faAngleDown,
  faAngleDoubleDown
} from '@fortawesome/free-solid-svg-icons'

class Priority {
  constructor(symbol, name, colour, icon) {
    this.symbol = symbol
    this.name = name
    this.colour = colour
    this.icon = icon
  }
}

/* eslint-disable camelcase */
const prioritiesMap = {
  null: new Priority(null, 'None', null, null),
  very_low: new Priority('very_low', 'Very Low', '#029FD1', faAngleDoubleDown),
  low: new Priority('low', 'Low', '#2FD89B', faAngleDown),
  medium: new Priority('medium', 'Medium', '#FFCA28', faMinus),
  high: new Priority('high', 'High', '#EC662C', faAngleUp),
  very_high: new Priority('very_high', 'Very High', '#F34483', faAngleDoubleUp),
}

const priorities = Object.values(prioritiesMap)
/* eslint-enable camelcase */

export default priorities
export { priorities, prioritiesMap }
