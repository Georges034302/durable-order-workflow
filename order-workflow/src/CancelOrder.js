const { app } = require('@azure/functions');

app.activity('CancelOrder', {
  handler: async (order, context) => {
    context.log('🔧 Activity "CancelOrder" triggered for order', order.id);
    return true;
  }
});
