export const updateQuantity = (ticketIndex, quantity) => ({
    type: 'UPDATE_QUANTITY',
    payload: { ticketIndex, quantity },
  });