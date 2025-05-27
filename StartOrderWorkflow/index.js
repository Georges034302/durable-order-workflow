const df = require("durable-functions");

module.exports = async function (context, req) {
    const client = df.getClient(context);
    const order = req.body;

    const instanceId = await client.startNew("OrderOrchestrator", undefined, order);
    context.log(`Started orchestration with ID = ${instanceId}`);

    return client.createCheckStatusResponse(context.bindingData.req, instanceId);
};
