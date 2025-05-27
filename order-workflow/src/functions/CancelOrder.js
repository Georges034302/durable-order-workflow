const df = require('durable-functions');

df.app.activity('CancelOrder', {
  handler: async (order, context) => {
    context.log('🔧 Activity "CancelOrder" triggered for order', order.id);
    return true;
  }
});
