const { app } = require('@azure/functions');

app.activity('SendShippingEmail', {
  handler: async (order, context) => {
    context.log('🔧 Activity "SendShippingEmail" triggered for order', order.id);
    return true;
  }
});
