export const ADD_LIST = 'ADD_LIST'

export const ADD_CARD = 'ADD_CARD'

let nextCardId = 0
export const addCard = (name, description) => {
  return {
    type: ADD_CARD,
    id: nextCardId++,
    name,
    descrition
  }
}
