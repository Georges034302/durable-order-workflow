const df = require('durable-functions');

df.app.activity('SendShippingEmail', {
  handler: async (order, context) => {
    context.log('🔧 Activity "SendShippingEmail" triggered for order', order.id);
    return true;
  }
});
