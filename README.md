# 🧾 Durable Functions Demo: Order Fulfillment Workflow (Node.js)

## 📦 Project Description

This project is a complete **Durable Functions demo** using Node.js that simulates an **order fulfillment workflow**. The workflow performs multiple sequential steps:
1. ✅ Validate the order
2. 📦 Reserve inventory
3. 💳 Process payment
4. ✉️ Send shipping confirmation

If any step fails (e.g., item out of stock or payment declined), the orchestrator triggers a **compensation step**: `CancelOrder`.

---

## 🗂 Project Structure (Modern SDK – Code-First)

```
order-workflow/
├── host.json
├── local.settings.json         # Local development settings
├── package.json
├── src/
│   └── functions
│       ├── StartOrderWorkflow.js   # HTTP starter function
│       ├── OrderOrchestrator.js    # Durable orchestrator
│       ├── ValidateOrder.js        # Activity
│       ├── ReserveInventory.js     # Activity
│       ├── ProcessPayment.js       # Activity
│       ├── SendShippingEmail.js    # Activity
│       └── CancelOrder.js          # Compensation activity
└── README.md
create-order-workflow.sh  # Script to generate the project
setup.sh                  # Setup script for Azure resources
```

---

## ⚙️ Requirements

Before setting up the Azure Durable Functions environment, ensure you have the following installed:

- **Node.js** 16.x or 18.x
- **Azure CLI**: [Install Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli)
- **Azure Functions Core Tools v4**

### 🛠 Install Azure CLI

```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

### 🛠 Install Azure Functions Core Tools v4

```bash
curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
sudo mv microsoft.gpg /etc/apt/trusted.gpg.d/microsoft.gpg
echo "deb [arch=amd64] https://packages.microsoft.com/repos/azure-cli/ $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/azure-cli.list
sudo apt-get update
sudo apt-get install azure-functions-core-tools-4
```

---

## 🛠️ Configuration & Setup

### ✅ 1. Generate the Project

Use the automated script to create a modern-structured project:

```bash
./create-order-workflow.sh
```

This initializes a project in `order-workflow/`, installs dependencies, and generates:

- 1 orchestrator
- 1 HTTP starter
- 5 activity functions

All using the modern `@azure/functions` and `durable-functions` SDK.

### ✅ 2. Configure for Local Testing

Edit `local.settings.json`:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node"
  }
}
```

Start the local runtime:

```bash
func start
```

---

## 🚀 How to Deploy to Azure

1. **Create Azure resources**:

```bash
setup-durable-functions.sh
```

2. **Publish to Azure**:

```bash
cd order-workflow
func azure functionapp publish durable-order-func
```

---

## 🧪 How to Test

Make a `POST` request to:

```
https://<your-app>.azurewebsites.net/api/start-order
```

✅ Test Success:
```json
{
  "id": "ORD1001",
  "item": "laptop",
  "userEmail": "user@example.com"
}
```

❌ Test Failure (to trigger `CancelOrder`):
```json
{
  "id": "ORD1002",
  "item": "unavailable",
  "userEmail": "user@example.com"
}
```

The response includes a `statusQueryGetUri` to track the orchestration.

---

## 📬 Output Example

Success:
```json
{
  "status": "Success",
  "orderId": "ORD1001"
}
```

Failure:
```json
{
  "status": "Failed",
  "reason": "Item out of stock"
}
```

---

## 🧼 Cleanup (Optional)

```bash
az group delete --name durable-rg --yes --no-wait
```

---

## 📘 Resources

- [Durable Functions docs](https://learn.microsoft.com/azure/azure-functions/durable/durable-functions-overview)
- [Azure CLI docs](https://learn.microsoft.com/cli/azure/)
- [Azure Functions Node.js Guide](https://learn.microsoft.com/azure/azure-functions/functions-reference-node)
