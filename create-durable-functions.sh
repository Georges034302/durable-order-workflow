#!/bin/bash

# Step 1: Init project
echo "🧱 Initializing Durable Function project..."
func init order-workflow --worker-runtime node --language javascript

cd order-workflow || exit

# Install modern SDKs and Durable extension for local dev
echo "📦 Installing durable-functions, @azure/functions, and Azure Functions Durable extension..."
npm install durable-functions @azure/functions
func extensions install --package Microsoft.Azure.WebJobs.Extensions.DurableTask --version 2.9.0

# Ensure JSON CLI exists (for safe package.json edits)
if ! command -v json &> /dev/null; then
  echo "📦 Installing 'json' CLI to update package.json..."
  npm install -g json
fi

# Create folder structure
mkdir -p src/functions

echo "🚀 Creating Durable Orchestrator and HTTP Starter in src/functions/..."

# Orchestrator
cat > src/functions/OrderOrchestrator.js <<EOF
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
EOF

# HTTP starter
cat > src/functions/StartOrderWorkflow.js <<EOF
const { app } = require('@azure/functions');
const df = require('durable-functions');

app.http('StartOrderWorkflow', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'start-order',
  extraInputs: [df.input.durableClient()],
  handler: async (request, context) => {
    const client = df.getClient(context);
    const body = await request.json();
    const instanceId = await client.startNew('OrderOrchestrator', { input: body });
    context.log(\`🟢 Started orchestration with ID = \${instanceId}\`);
    return {
      status: 202,
      jsonBody: {
        id: instanceId,
        statusQueryGetUri: client.createCheckStatusResponse(context, instanceId).statusQueryGetUri
      }
    };
  }
});
EOF

# Activity Functions
echo "⚙️ Creating Activity Functions in src/functions/..."

for name in ValidateOrder ReserveInventory ProcessPayment SendShippingEmail CancelOrder
do
  cat > src/functions/${name}.js <<EOF
const df = require('durable-functions');

df.app.activity('${name}', {
  handler: async (order, context) => {
    context.log(\`🔧 Activity '${name}' triggered for order \${order.id}\`);
    return true;
  }
});
EOF
  echo "✅ Created: src/functions/${name}.js"
done

# Update package.json to point to the functions folder (no index.js needed)
npx json -I -f package.json -e 'this.main="src/functions"'

# Create minimal host.json
cat > host.json <<EOF
{
  "version": "2.0"
}
EOF

# Create a placeholder local.settings.json
cat > local.settings.json <<EOF
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node"
  }
}
EOF

echo ""
echo "✅ Project 'order-workflow' created successfully."
echo "📁 All function files are under ./order-workflow/src/functions/"
echo "🚀 To run locally: cd order-workflow && func start"
