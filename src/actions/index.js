export const ADD_LIST = 'ADD_LIST';
export const ADD_CARD = 'ADD_CARD';

let nextCardId = 0;
export const addCard = (title, description, parentList = 0) => {
  return {
    type: ADD_CARD,
    id: nextCardId++,
    title,
    description,
    parentList,
  };
};

let nextListId = 0;
export const addList = (title) => {
  return {
    type: ADD_LIST,
    id: nextListId++,
    title,
  };
};
