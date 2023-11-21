// reducers.js
const initialState = {
    tickets: [
      { title: 'VIP', price: 120, quantity: 0 },
      { title: 'Red', price: 90, quantity: 0 },
      { title: 'Standing', price: 75, quantity: 0 },
      { title: 'Blue', price: 60, quantity: 0 },
      { title: 'Purple', price: 50, quantity: 0 },
    ],
  };
  
  const ticketReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPDATE_QUANTITY':
        const { ticketIndex, quantity } = action.payload;
        const updatedTickets = [...state.tickets];
        updatedTickets[ticketIndex].quantity = quantity;
        return { ...state, tickets: updatedTickets };
  
      default:
        return state;
    }
  };
  
  export default ticketReducer;