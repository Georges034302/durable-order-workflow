const df = require('durable-functions');

df.app.activity('ProcessPayment', {
  handler: async (order, context) => {
    context.log('🔧 Activity "ProcessPayment" triggered for order', order.id);
    return true;
  }
});
