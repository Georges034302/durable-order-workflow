const { app } = require('@azure/functions');

app.activity('ValidateOrder', {
  handler: async (order, context) => {
    context.log('🔧 Activity "ValidateOrder" triggered for order', order.id);
    return true;
  }
});
