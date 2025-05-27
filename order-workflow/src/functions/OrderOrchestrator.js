const df = require('durable-functions');

df.app.orchestration('OrderOrchestrator', function* (context) {
  const order = context.df.getInput();

  try {
    yield context.df.callActivity('ValidateOrder', order);
    yield context.df.callActivity('ReserveInventory', order);
    yield context.df.callActivity('ProcessPayment', order);
    yield context.df.callActivity('SendShippingEmail', order);
    return { status: 'Success', orderId: order.id };
  } catch (err) {
    yield context.df.callActivity('CancelOrder', order);
    return { status: 'Failed', reason: err.message };
  }
});
