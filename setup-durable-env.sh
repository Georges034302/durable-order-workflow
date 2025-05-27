#!/bin/bash

# 🔧 CONFIGURABLE VARIABLES
RG_NAME="durable-rg"
LOCATION="australiaeast"
STORAGE_NAME="durablefuncstorage2025"
FUNC_APP_NAME="durable-order-func"
RUNTIME="node"
FUNCTION_VERSION="4"

echo "🔐 Logging into Azure..."
az login

echo "📁 Creating resource group: $RG_NAME"
az group create \
  --name "$RG_NAME" \
  --location "$LOCATION"

echo "💾 Creating storage account: $STORAGE_NAME"
az storage account create \
  --name "$STORAGE_NAME" \
  --location "$LOCATION" \
  --sku Standard_LRS \
  --resource-group "$RG_NAME"

echo "⚙️ Creating function app: $FUNC_APP_NAME"
az functionapp create \
  --name "$FUNC_APP_NAME" \
  --resource-group "$RG_NAME" \
  --storage-account "$STORAGE_NAME" \
  --consumption-plan-location "$LOCATION" \
  --runtime "$RUNTIME" \
  --functions-version "$FUNCTION_VERSION"

echo "✅ Azure Durable Functions environment is ready."
