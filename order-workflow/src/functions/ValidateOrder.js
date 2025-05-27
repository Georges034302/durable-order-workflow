const df = require('durable-functions');

df.app.activity('ValidateOrder', {
  handler: async (order, context) => {
    context.log(`🔧 Activity 'ValidateOrder' triggered for order ${order.id}`);
    return true;
  }
});
