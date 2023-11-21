import { createStore } from 'redux';
import ticketReducer from './reducer/index.js';

const store = createStore(ticketReducer);

export default store;