const { app } = require('@azure/functions');

app.activity('ReserveInventory', {
  handler: async (order, context) => {
    context.log('🔧 Activity "ReserveInventory" triggered for order', order.id);
    return true;
  }
});
