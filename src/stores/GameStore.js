import { EventEmitter } from "events";
import dispatcher from "../AppDispatcher";
import actionTypes from "../actions/actionTypes";

const CHANGE_EVENT = "change";
let _game = {
  cards: [],
  players: [],
  currentPlayer: 0,
  visible: true,
};

class GameStore extends EventEmitter {
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  getGame() {
    return _game;
  }
}

const store = new GameStore();

dispatcher.register((action) => {
  switch (action.actionType) {
    case actionTypes.CREATE_GAME:
      _game = action.game;
      store.emitChange();
      break;
    case actionTypes.UPDATE_GAME:
      _game = action.game;
      store.emitChange();
      break;
    case actionTypes.DELETE_GAME:
      _game = {};
      store.emitChange();
      break;
    default:
      break;
  }
});

export default store;
