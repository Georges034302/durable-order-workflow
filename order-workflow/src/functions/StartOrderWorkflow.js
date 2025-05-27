const { app } = require('@azure/functions');
const df = require('durable-functions');

app.http('StartOrderWorkflow', {
  route: 'start-order',
  methods: ['POST'],
  authLevel: 'anonymous',
  extraInputs: [df.input.durableClient()],
  handler: async (request, context) => {
    const client = df.getClient(context);
    const input = await request.json();
    const instanceId = await client.startNew('OrderOrchestrator', { input });

    return client.createCheckStatusResponse(request, instanceId);
  }
});
