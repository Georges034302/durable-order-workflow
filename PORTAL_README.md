# 📘 Durable Functions (Order Workflow) – Azure Portal Instructions

This guide walks you through how to build the **Durable Functions Order Workflow** entirely via the **Azure Portal**, without using CLI or VS Code.

---

## 📦 Scenario Overview

Simulate an order fulfillment system using Durable Functions:

1. ✅ ValidateOrder
2. 📦 ReserveInventory
3. 💳 ProcessPayment
4. ✉️ SendShippingEmail
5. ❌ If any step fails, call CancelOrder

---

## 🧱 1. Create the Azure Function App

1. Go to [Azure Portal](https://portal.azure.com)
2. Search for **Function App** > click **Create**
3. Fill out the form:
   - **Subscription:** Your active subscription
   - **Resource Group:** `durable-rg` (or create one)
   - **Function App name:** `durable-order-func`
   - **Runtime stack:** Node.js
   - **Version:** Node.js 18
   - **Region:** australiaeast (or closest region)
   - **Hosting:**
     - Storage: Create a new storage account (e.g., `durablefuncstorage2025`)
     - Plan: Consumption (Serverless)
4. Click **Next** > Keep default monitoring options
5. Click **Review + Create** > **Create**

---

## 🧪 2. Enable Durable Functions Extension

1. Go to your Function App > **Functions** > Click **+ Add**
2. Choose template:
   - **Durable Functions orchestrator**
   - Function name: `OrderOrchestrator`
3. Repeat and add:
   - **HTTP trigger** > `StartOrderWorkflow`
   - **Durable Functions activity** > `ValidateOrder`
   - **Durable Functions activity** > `ReserveInventory`
   - **Durable Functions activity** > `ProcessPayment`
   - **Durable Functions activity** > `SendShippingEmail`
   - **Durable Functions activity** > `CancelOrder`

---

## ✏️ 3. Update Function Code

### 🔁 OrderOrchestrator
(Replace existing content)
```js
const df = require("durable-functions");

module.exports = df.orchestrator(function* (context) {
  const order = context.df.getInput();
  try {
    yield context.df.callActivity("ValidateOrder", order);
    yield context.df.callActivity("ReserveInventory", order);
    yield context.df.callActivity("ProcessPayment", order);
    yield context.df.callActivity("SendShippingEmail", order);
    return { status: "Success", orderId: order.id };
  } catch (err) {
    yield context.df.callActivity("CancelOrder", order);
    return { status: "Failed", reason: err.message };
  }
});
```

### 🌐 StartOrderWorkflow
```js
const df = require("durable-functions");

module.exports = async function (context, req) {
  const client = df.getClient(context);
  const input = req.body;
  const instanceId = await client.startNew("OrderOrchestrator", { input });
  return client.createCheckStatusResponse(req, instanceId);
};
```

### ✅ ValidateOrder.js
```js
module.exports = async function (context) {
  context.log("✅ Validating order");
  return true;
};
```

### 📦 ReserveInventory.js
```js
module.exports = async function (context, order) {
  context.log("📦 Reserving inventory for", order.id);
  return true;
};
```

### 💳 ProcessPayment.js
```js
module.exports = async function (context, order) {
  context.log("💳 Processing payment for", order.id);
  if (order.item === 'declined') throw new Error("Payment declined by provider");
  return true;
};
```

### ✉️ SendShippingEmail.js
```js
module.exports = async function (context, order) {
  context.log("✉️ Sending shipping confirmation for", order.id);
  return true;
};
```

### ❌ CancelOrder.js
```js
module.exports = async function (context, order) {
  context.log("❌ Cancelling order", order.id);
  return true;
};
```

---

## 🚀 4. Test the Workflow

### ✅ POST a success order
Use **Test/Run** on `StartOrderWorkflow`, set **method to POST**, and input:
```json
{
  "id": "ORD1001",
  "item": "laptop",
  "userEmail": "user@example.com"
}
```

### ❌ POST a fail order
```json
{
  "id": "ORD1002",
  "item": "declined",
  "userEmail": "user@example.com"
}
```
This should trigger the `CancelOrder` path.

---

## 🔍 5. Monitor Execution

1. Go to Function App > **Monitor**
2. Select `OrderOrchestrator`
3. View execution history
4. Use `statusQueryGetUri` to track orchestration from client apps (like Postman)

---

## 🧼 6. Clean Up (Optional)

To delete all resources:
- Delete the **Function App**, **Resource Group**, and **Storage Account** from the portal

---

## 📘 References
- [Durable Functions Documentation](https://learn.microsoft.com/azure/azure-functions/durable/durable-functions-overview)
- [Azure Portal](https://portal.azure.com)

---

This completes the Azure Portal-based setup for your Durable Order Workflow system! ✅