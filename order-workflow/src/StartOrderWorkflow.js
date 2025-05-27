const { app } = require('@azure/functions');
const df = require('durable-functions');

app.http('StartOrderWorkflow', {
  route: 'start-order',
  methods: ['POST'],
  authLevel: 'anonymous',
  extraInputs: [df.input.durableClient()],
  handler: async (req, context) => {
    const client = df.getClient(context);
    const body = await req.json();
    const instanceId = await client.startNew('OrderOrchestratorOrchestrator', { input: body });
    context.log(`Started orchestration: ${instanceId}`);
    return client.createCheckStatusResponse(req, instanceId);
  }
});
