const { app } = require('@azure/functions');

app.activity('ProcessPayment', {
  handler: async (order, context) => {
    context.log('🔧 Activity "ProcessPayment" triggered for order', order.id);
    return true;
  }
});
