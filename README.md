# Durable Functions Demo: Order Fulfillment Workflow (Node.js)

## 📦 Scenario
Simulates an order workflow where the system:

1. Validates the order
2. Reserves inventory
3. Processes payment
4. Sends a shipping confirmation

If any step fails (e.g., item unavailable or payment error), the system performs a compensation step (`CancelOrder`).

---

## 🚀 How to Deploy & Run

### 🧱 Prerequisites
- Azure subscription
- Azure Function App with Durable Functions extension enabled
- Runtime stack: Node.js (~4 or v18+)
- Azure Storage account (linked to Function App)

---

### 📂 File Structure

```
/StartOrderWorkflow       - HTTP trigger to start the orchestration
/OrderOrchestrator        - Orchestrator controlling the workflow
/ValidateOrder            - Activity: checks if item is in stock
/ReserveInventory         - Activity: mocks inventory reservation
/ProcessPayment           - Activity: simulates payment logic
/SendShippingEmail        - Activity: simulates confirmation email
/CancelOrder              - Compensation logic on failure
host.json                 - Function host config
```

---

### 🛠️ Setup Instructions

1. **Zip & upload this project** via Azure Portal > Function App > Functions > App files > "Upload your function app content".
2. OR use Azure CLI to publish it locally if you're using Core Tools v4.
3. In the Azure Portal, go to `StartOrderWorkflow` > **Test/Run** > use this body:

```json
{
  "id": "ORD-1001",
  "item": "laptop",
  "userEmail": "user@example.com"
}
```

❗ To simulate failure:
```json
{
  "id": "ORD-1002",
  "item": "unavailable-item",
  "userEmail": "user@example.com"
}
```

---

### ✅ Expected Output

- Success: All steps complete
- Failure: Error logged + compensation via `CancelOrder`

You can track progress using the `statusQueryGetUri` from the HTTP response.

---
