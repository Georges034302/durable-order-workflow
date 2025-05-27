const df = require('durable-functions');

df.app.activity('ReserveInventory', {
  handler: async (order, context) => {
    context.log('🔧 Activity "ReserveInventory" triggered for order', order.id);
    return true;
  }
});
