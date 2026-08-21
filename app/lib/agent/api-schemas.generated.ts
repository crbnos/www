// GENERATED FILE — do not edit by hand.
//
// Produced by `node scripts/generate-api-schemas.mjs --from <swagger-docs-schema.ts>`
// from the Carbon REST API's own PostgREST schema. Re-run it after a
// migration that changes one of these resources, and commit the result.

import type { JsonSchema } from "./openapi-types";

export const API_SCHEMAS = {
  "item": {
    "type": "object",
    "required": [
      "id",
      "readableId",
      "name",
      "type",
      "replenishmentSystem",
      "itemTrackingType",
      "active",
      "createdBy",
      "createdAt",
      "sourcingType",
      "revisionStatus"
    ],
    "properties": {
      "id": {
        "type": "string",
        "description": "Note:"
      },
      "readableId": {
        "type": "string"
      },
      "name": {
        "type": "string"
      },
      "description": {
        "type": "string"
      },
      "type": {
        "type": "string",
        "enum": [
          "Part",
          "Material",
          "Tool",
          "Service",
          "Consumable",
          "Fixture"
        ]
      },
      "replenishmentSystem": {
        "type": "string",
        "enum": [
          "Buy",
          "Make",
          "Buy and Make"
        ]
      },
      "defaultMethodType": {
        "type": "string",
        "enum": [
          "Purchase to Order",
          "Pull from Inventory",
          "Make to Order"
        ]
      },
      "itemTrackingType": {
        "type": "string",
        "enum": [
          "Inventory",
          "Non-Inventory",
          "Serial",
          "Batch"
        ]
      },
      "unitOfMeasureCode": {
        "type": "string"
      },
      "active": {
        "type": "boolean"
      },
      "companyId": {
        "type": "string",
        "description": "Note:"
      },
      "createdBy": {
        "type": "string",
        "description": "Note:"
      },
      "createdAt": {
        "type": "string",
        "format": "date-time"
      },
      "updatedBy": {
        "type": "string",
        "description": "Note:"
      },
      "updatedAt": {
        "type": "string",
        "format": "date-time"
      },
      "assignee": {
        "type": "string",
        "description": "Note:"
      },
      "modelUploadId": {
        "type": "string",
        "description": "Note:"
      },
      "thumbnailPath": {
        "type": "string"
      },
      "notes": {
        "type": "object",
        "additionalProperties": true
      },
      "trackingMethod": {
        "type": "string"
      },
      "revision": {
        "type": "string"
      },
      "readableIdWithRevision": {
        "type": "string"
      },
      "sourcingType": {
        "type": "string",
        "enum": [
          "Specified",
          "Drop Ship",
          "Ship from Inventory"
        ]
      },
      "mpn": {
        "type": "string"
      },
      "revisionStatus": {
        "type": "string",
        "enum": [
          "Design",
          "Prototype",
          "Production",
          "Obsolete"
        ]
      },
      "changeOrderId": {
        "type": "string",
        "description": "Note:"
      }
    }
  },
  "part": {
    "type": "object",
    "required": [
      "id",
      "approved",
      "companyId",
      "createdBy",
      "createdAt"
    ],
    "properties": {
      "id": {
        "type": "string",
        "description": "Note:"
      },
      "approved": {
        "type": "boolean"
      },
      "approvedBy": {
        "type": "string",
        "description": "Note:"
      },
      "fromDate": {
        "type": "string",
        "format": "date"
      },
      "toDate": {
        "type": "string",
        "format": "date"
      },
      "companyId": {
        "type": "string",
        "description": "Note:"
      },
      "createdBy": {
        "type": "string",
        "description": "Note:"
      },
      "createdAt": {
        "type": "string",
        "format": "date-time"
      },
      "updatedBy": {
        "type": "string",
        "description": "Note:"
      },
      "updatedAt": {
        "type": "string",
        "format": "date-time"
      },
      "customFields": {
        "type": "object",
        "additionalProperties": true
      },
      "tags": {
        "type": "array",
        "items": {
          "type": "string"
        }
      }
    }
  },
  "material": {
    "type": "object",
    "required": [
      "id",
      "approved",
      "companyId",
      "createdBy",
      "createdAt"
    ],
    "properties": {
      "id": {
        "type": "string",
        "description": "Note:"
      },
      "materialFormId": {
        "type": "string",
        "description": "Note:"
      },
      "materialSubstanceId": {
        "type": "string",
        "description": "Note:"
      },
      "approved": {
        "type": "boolean"
      },
      "approvedBy": {
        "type": "string",
        "description": "Note:"
      },
      "customFields": {
        "type": "object",
        "additionalProperties": true
      },
      "companyId": {
        "type": "string",
        "description": "Note:"
      },
      "createdBy": {
        "type": "string",
        "description": "Note:"
      },
      "createdAt": {
        "type": "string",
        "format": "date-time"
      },
      "updatedBy": {
        "type": "string",
        "description": "Note:"
      },
      "updatedAt": {
        "type": "string",
        "format": "date-time"
      },
      "tags": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "dimensionId": {
        "type": "string",
        "description": "Note:"
      },
      "finishId": {
        "type": "string",
        "description": "Note:"
      },
      "gradeId": {
        "type": "string",
        "description": "Note:"
      },
      "materialTypeId": {
        "type": "string",
        "description": "Note:"
      }
    }
  },
  "customer": {
    "type": "object",
    "required": [
      "id",
      "name",
      "companyId",
      "createdAt",
      "taxPercent",
      "readableId"
    ],
    "properties": {
      "id": {
        "type": "string",
        "description": "Note:"
      },
      "name": {
        "type": "string"
      },
      "customerTypeId": {
        "type": "string",
        "description": "Note:"
      },
      "customerStatusId": {
        "type": "string",
        "description": "Note:"
      },
      "accountManagerId": {
        "type": "string",
        "description": "Note:"
      },
      "logo": {
        "type": "string"
      },
      "assignee": {
        "type": "string",
        "description": "Note:"
      },
      "companyId": {
        "type": "string",
        "description": "Note:"
      },
      "createdAt": {
        "type": "string",
        "format": "date-time"
      },
      "createdBy": {
        "type": "string",
        "description": "Note:"
      },
      "updatedAt": {
        "type": "string",
        "format": "date-time"
      },
      "updatedBy": {
        "type": "string",
        "description": "Note:"
      },
      "customFields": {
        "type": "object",
        "additionalProperties": true
      },
      "currencyCode": {
        "type": "string",
        "description": "Note:"
      },
      "phone": {
        "type": "string"
      },
      "fax": {
        "type": "string"
      },
      "website": {
        "type": "string"
      },
      "taxPercent": {
        "type": "number"
      },
      "tags": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "salesContactId": {
        "type": "string",
        "description": "Note:"
      },
      "defaultCc": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "intercompanyCompanyId": {
        "type": "string",
        "description": "Note:"
      },
      "readableId": {
        "type": "string"
      }
    }
  },
  "supplier": {
    "type": "object",
    "required": [
      "id",
      "name",
      "companyId",
      "createdAt",
      "taxPercent",
      "readableId"
    ],
    "properties": {
      "id": {
        "type": "string",
        "description": "Note:"
      },
      "name": {
        "type": "string"
      },
      "supplierTypeId": {
        "type": "string",
        "description": "Note:"
      },
      "accountManagerId": {
        "type": "string",
        "description": "Note:"
      },
      "logo": {
        "type": "string"
      },
      "assignee": {
        "type": "string",
        "description": "Note:"
      },
      "companyId": {
        "type": "string",
        "description": "Note:"
      },
      "createdAt": {
        "type": "string",
        "format": "date-time"
      },
      "createdBy": {
        "type": "string",
        "description": "Note:"
      },
      "updatedAt": {
        "type": "string",
        "format": "date-time"
      },
      "updatedBy": {
        "type": "string",
        "description": "Note:"
      },
      "customFields": {
        "type": "object",
        "additionalProperties": true
      },
      "currencyCode": {
        "type": "string",
        "description": "Note:"
      },
      "phone": {
        "type": "string"
      },
      "fax": {
        "type": "string"
      },
      "website": {
        "type": "string"
      },
      "tags": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "taxPercent": {
        "type": "number"
      },
      "purchasingContactId": {
        "type": "string",
        "description": "Note:"
      },
      "defaultCc": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "supplierStatus": {
        "type": "string",
        "enum": [
          "Active",
          "Inactive",
          "Pending",
          "Rejected"
        ]
      },
      "intercompanyCompanyId": {
        "type": "string",
        "description": "Note:"
      },
      "readableId": {
        "type": "string"
      }
    }
  },
  "salesOrder": {
    "type": "object",
    "required": [
      "id",
      "salesOrderId",
      "revisionId",
      "status",
      "currencyCode",
      "customerId",
      "companyId",
      "createdAt",
      "createdBy"
    ],
    "properties": {
      "id": {
        "type": "string",
        "description": "Note:"
      },
      "salesOrderId": {
        "type": "string"
      },
      "revisionId": {
        "type": "integer"
      },
      "status": {
        "type": "string",
        "enum": [
          "Draft",
          "Needs Approval",
          "Confirmed",
          "In Progress",
          "Completed",
          "Invoiced",
          "Cancelled",
          "Closed",
          "To Ship and Invoice",
          "To Ship",
          "To Invoice"
        ]
      },
      "orderDate": {
        "type": "string",
        "format": "date"
      },
      "currencyCode": {
        "type": "string",
        "description": "Note:"
      },
      "customerId": {
        "type": "string"
      },
      "customerLocationId": {
        "type": "string",
        "description": "Note:"
      },
      "customerContactId": {
        "type": "string",
        "description": "Note:"
      },
      "customerReference": {
        "type": "string"
      },
      "assignee": {
        "type": "string",
        "description": "Note:"
      },
      "companyId": {
        "type": "string",
        "description": "Note:"
      },
      "closedAt": {
        "type": "string",
        "format": "date"
      },
      "closedBy": {
        "type": "string",
        "description": "Note:"
      },
      "customFields": {
        "type": "object",
        "additionalProperties": true
      },
      "createdAt": {
        "type": "string",
        "format": "date-time"
      },
      "createdBy": {
        "type": "string",
        "description": "Note:"
      },
      "updatedAt": {
        "type": "string",
        "format": "date-time"
      },
      "updatedBy": {
        "type": "string",
        "description": "Note:"
      },
      "locationId": {
        "type": "string",
        "description": "Note:"
      },
      "exchangeRate": {
        "type": "number"
      },
      "exchangeRateUpdatedAt": {
        "type": "string",
        "format": "date-time"
      },
      "externalNotes": {
        "type": "object",
        "additionalProperties": true
      },
      "internalNotes": {
        "type": "object",
        "additionalProperties": true
      },
      "salesPersonId": {
        "type": "string"
      },
      "sentCompleteDate": {
        "type": "string",
        "format": "date"
      },
      "opportunityId": {
        "type": "string",
        "description": "Note:"
      },
      "completedDate": {
        "type": "string",
        "format": "date-time"
      },
      "customerEngineeringContactId": {
        "type": "string",
        "description": "Note:"
      }
    }
  },
  "salesOrderLine": {
    "type": "object",
    "required": [
      "id",
      "salesOrderId",
      "salesOrderLineType",
      "sentComplete",
      "invoicedComplete",
      "companyId",
      "createdAt",
      "createdBy",
      "status",
      "addOnCost",
      "methodType",
      "shippingCost",
      "taxPercent",
      "nonTaxableAddOnCost",
      "sortOrder"
    ],
    "properties": {
      "id": {
        "type": "string",
        "description": "Note:"
      },
      "salesOrderId": {
        "type": "string",
        "description": "Note:"
      },
      "salesOrderLineType": {
        "type": "string",
        "enum": [
          "Comment",
          "Part",
          "Material",
          "Tool",
          "Service",
          "Consumable",
          "Fixture",
          "Fixed Asset"
        ]
      },
      "itemId": {
        "type": "string",
        "description": "Note:"
      },
      "assetId": {
        "type": "string",
        "description": "Note:"
      },
      "description": {
        "type": "string"
      },
      "saleQuantity": {
        "type": "number"
      },
      "quantitySent": {
        "type": "number"
      },
      "quantityInvoiced": {
        "type": "number"
      },
      "unitPrice": {
        "type": "number"
      },
      "unitOfMeasureCode": {
        "type": "string"
      },
      "locationId": {
        "type": "string"
      },
      "storageUnitId": {
        "type": "string",
        "description": "Note:"
      },
      "setupPrice": {
        "type": "number"
      },
      "sentComplete": {
        "type": "boolean"
      },
      "invoicedComplete": {
        "type": "boolean"
      },
      "companyId": {
        "type": "string"
      },
      "createdAt": {
        "type": "string",
        "format": "date-time"
      },
      "createdBy": {
        "type": "string",
        "description": "Note:"
      },
      "updatedAt": {
        "type": "string",
        "format": "date-time"
      },
      "updatedBy": {
        "type": "string",
        "description": "Note:"
      },
      "customFields": {
        "type": "object",
        "additionalProperties": true
      },
      "status": {
        "type": "string",
        "enum": [
          "Ordered",
          "In Progress",
          "Completed"
        ]
      },
      "modelUploadId": {
        "type": "string"
      },
      "promisedDate": {
        "type": "string",
        "format": "date"
      },
      "addOnCost": {
        "type": "number"
      },
      "methodType": {
        "type": "string",
        "enum": [
          "Purchase to Order",
          "Pull from Inventory",
          "Make to Order"
        ]
      },
      "exchangeRate": {
        "type": "number"
      },
      "shippingCost": {
        "type": "number"
      },
      "taxPercent": {
        "type": "number"
      },
      "internalNotes": {
        "type": "object",
        "additionalProperties": true
      },
      "externalNotes": {
        "type": "object",
        "additionalProperties": true
      },
      "quantityToSend": {
        "type": "number"
      },
      "quantityToInvoice": {
        "type": "number"
      },
      "sentDate": {
        "type": "string",
        "format": "date"
      },
      "accountId": {
        "type": "string",
        "description": "Note:"
      },
      "nonTaxableAddOnCost": {
        "type": "number"
      },
      "pricingRuleId": {
        "type": "string",
        "description": "Note:"
      },
      "priceTrace": {
        "type": "object",
        "additionalProperties": true
      },
      "sortOrder": {
        "type": "number"
      },
      "convertedAddOnCost": {
        "type": "number"
      },
      "convertedShippingCost": {
        "type": "number"
      },
      "convertedUnitPrice": {
        "type": "number"
      },
      "convertedNonTaxableAddOnCost": {
        "type": "number"
      }
    }
  },
  "purchaseOrder": {
    "type": "object",
    "required": [
      "id",
      "purchaseOrderId",
      "revisionId",
      "status",
      "supplierId",
      "companyId",
      "createdAt",
      "createdBy",
      "supplierInteractionId",
      "purchaseOrderType"
    ],
    "properties": {
      "id": {
        "type": "string",
        "description": "Note:"
      },
      "purchaseOrderId": {
        "type": "string"
      },
      "revisionId": {
        "type": "integer"
      },
      "status": {
        "type": "string",
        "enum": [
          "Draft",
          "To Review",
          "Rejected",
          "To Receive",
          "To Receive and Invoice",
          "To Invoice",
          "Completed",
          "Closed",
          "Planned",
          "Needs Approval"
        ]
      },
      "orderDate": {
        "type": "string",
        "format": "date"
      },
      "supplierId": {
        "type": "string"
      },
      "supplierLocationId": {
        "type": "string",
        "description": "Note:"
      },
      "supplierContactId": {
        "type": "string",
        "description": "Note:"
      },
      "supplierReference": {
        "type": "string"
      },
      "assignee": {
        "type": "string",
        "description": "Note:"
      },
      "companyId": {
        "type": "string",
        "description": "Note:"
      },
      "closedAt": {
        "type": "string",
        "format": "date"
      },
      "closedBy": {
        "type": "string",
        "description": "Note:"
      },
      "customFields": {
        "type": "object",
        "additionalProperties": true
      },
      "createdAt": {
        "type": "string",
        "format": "date-time"
      },
      "createdBy": {
        "type": "string",
        "description": "Note:"
      },
      "updatedAt": {
        "type": "string",
        "format": "date-time"
      },
      "updatedBy": {
        "type": "string",
        "description": "Note:"
      },
      "currencyCode": {
        "type": "string",
        "description": "Note:"
      },
      "exchangeRate": {
        "type": "number"
      },
      "exchangeRateUpdatedAt": {
        "type": "string",
        "format": "date-time"
      },
      "tags": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "internalNotes": {
        "type": "object",
        "additionalProperties": true
      },
      "externalNotes": {
        "type": "object",
        "additionalProperties": true
      },
      "supplierInteractionId": {
        "type": "string",
        "description": "Note:"
      },
      "purchaseOrderType": {
        "type": "string",
        "enum": [
          "Purchase",
          "Return",
          "Outside Processing"
        ]
      },
      "jobId": {
        "type": "string",
        "description": "Note:"
      },
      "jobReadableId": {
        "type": "string"
      }
    }
  },
  "purchaseOrderLine": {
    "type": "object",
    "required": [
      "id",
      "purchaseOrderId",
      "purchaseOrderLineType",
      "receivedComplete",
      "invoicedComplete",
      "companyId",
      "createdAt",
      "createdBy",
      "exchangeRate",
      "supplierShippingCost",
      "supplierTaxAmount",
      "sortOrder"
    ],
    "properties": {
      "id": {
        "type": "string",
        "description": "Note:"
      },
      "purchaseOrderId": {
        "type": "string",
        "description": "Note:"
      },
      "purchaseOrderLineType": {
        "type": "string",
        "enum": [
          "Comment",
          "G/L Account",
          "Fixed Asset",
          "Part",
          "Material",
          "Tool",
          "Service",
          "Consumable",
          "Fixture"
        ]
      },
      "itemId": {
        "type": "string",
        "description": "Note:"
      },
      "assetId": {
        "type": "string",
        "description": "Note:"
      },
      "description": {
        "type": "string"
      },
      "purchaseQuantity": {
        "type": "number"
      },
      "quantityReceived": {
        "type": "number"
      },
      "quantityInvoiced": {
        "type": "number"
      },
      "supplierUnitPrice": {
        "type": "number"
      },
      "inventoryUnitOfMeasureCode": {
        "type": "string"
      },
      "purchaseUnitOfMeasureCode": {
        "type": "string"
      },
      "locationId": {
        "type": "string"
      },
      "storageUnitId": {
        "type": "string",
        "description": "Note:"
      },
      "setupPrice": {
        "type": "number"
      },
      "receivedComplete": {
        "type": "boolean"
      },
      "invoicedComplete": {
        "type": "boolean"
      },
      "companyId": {
        "type": "string"
      },
      "createdAt": {
        "type": "string",
        "format": "date-time"
      },
      "createdBy": {
        "type": "string",
        "description": "Note:"
      },
      "updatedAt": {
        "type": "string",
        "format": "date-time"
      },
      "updatedBy": {
        "type": "string",
        "description": "Note:"
      },
      "customFields": {
        "type": "object",
        "additionalProperties": true
      },
      "conversionFactor": {
        "type": "number"
      },
      "tags": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "internalNotes": {
        "type": "object",
        "additionalProperties": true
      },
      "externalNotes": {
        "type": "object",
        "additionalProperties": true
      },
      "exchangeRate": {
        "type": "number"
      },
      "supplierShippingCost": {
        "type": "number"
      },
      "modelUploadId": {
        "type": "string",
        "description": "Note:"
      },
      "supplierTaxAmount": {
        "type": "number"
      },
      "quantityToReceive": {
        "type": "number"
      },
      "quantityToInvoice": {
        "type": "number"
      },
      "supplierExtendedPrice": {
        "type": "number"
      },
      "taxPercent": {
        "type": "number"
      },
      "jobId": {
        "type": "string",
        "description": "Note:"
      },
      "jobOperationId": {
        "type": "string",
        "description": "Note:"
      },
      "quantityShipped": {
        "type": "number"
      },
      "promisedDate": {
        "type": "string",
        "format": "date"
      },
      "accountId": {
        "type": "string",
        "description": "Note:"
      },
      "requiredDate": {
        "type": "string",
        "format": "date"
      },
      "receivedDate": {
        "type": "string",
        "format": "date"
      },
      "costCenterId": {
        "type": "string",
        "description": "Note:"
      },
      "ownerId": {
        "type": "string",
        "description": "Note:"
      },
      "sortOrder": {
        "type": "number"
      },
      "supplierPartId": {
        "type": "string"
      },
      "unitPrice": {
        "type": "number"
      },
      "extendedPrice": {
        "type": "number"
      },
      "shippingCost": {
        "type": "number"
      },
      "taxAmount": {
        "type": "number"
      }
    }
  },
  "quote": {
    "type": "object",
    "required": [
      "id",
      "quoteId",
      "revisionId",
      "status",
      "customerId",
      "companyId",
      "createdAt",
      "createdBy"
    ],
    "properties": {
      "id": {
        "type": "string",
        "description": "Note:"
      },
      "quoteId": {
        "type": "string"
      },
      "revisionId": {
        "type": "integer"
      },
      "dueDate": {
        "type": "string",
        "format": "date"
      },
      "expirationDate": {
        "type": "string",
        "format": "date"
      },
      "status": {
        "type": "string",
        "enum": [
          "Draft",
          "Sent",
          "Ordered",
          "Partial",
          "Lost",
          "Cancelled",
          "Expired"
        ]
      },
      "salesPersonId": {
        "type": "string",
        "description": "Note:"
      },
      "estimatorId": {
        "type": "string",
        "description": "Note:"
      },
      "customerId": {
        "type": "string"
      },
      "customerLocationId": {
        "type": "string",
        "description": "Note:"
      },
      "customerContactId": {
        "type": "string",
        "description": "Note:"
      },
      "customerReference": {
        "type": "string"
      },
      "locationId": {
        "type": "string",
        "description": "Note:"
      },
      "assignee": {
        "type": "string",
        "description": "Note:"
      },
      "customFields": {
        "type": "object",
        "additionalProperties": true
      },
      "companyId": {
        "type": "string",
        "description": "Note:"
      },
      "createdAt": {
        "type": "string",
        "format": "date-time"
      },
      "createdBy": {
        "type": "string",
        "description": "Note:"
      },
      "updatedAt": {
        "type": "string",
        "format": "date-time"
      },
      "updatedBy": {
        "type": "string",
        "description": "Note:"
      },
      "externalNotes": {
        "type": "object",
        "additionalProperties": true
      },
      "internalNotes": {
        "type": "object",
        "additionalProperties": true
      },
      "currencyCode": {
        "type": "string",
        "description": "Note:"
      },
      "exchangeRate": {
        "type": "number"
      },
      "exchangeRateUpdatedAt": {
        "type": "string",
        "format": "date-time"
      },
      "externalLinkId": {
        "type": "string",
        "format": "uuid",
        "description": "Note:"
      },
      "digitalQuoteAcceptedBy": {
        "type": "string"
      },
      "digitalQuoteAcceptedByEmail": {
        "type": "string"
      },
      "tags": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "digitalQuoteRejectedBy": {
        "type": "string"
      },
      "digitalQuoteRejectedByEmail": {
        "type": "string"
      },
      "opportunityId": {
        "type": "string",
        "description": "Note:"
      },
      "completedDate": {
        "type": "string",
        "format": "date-time"
      },
      "customerEngineeringContactId": {
        "type": "string",
        "description": "Note:"
      }
    }
  },
  "quoteLine": {
    "type": "object",
    "required": [
      "id",
      "quoteId",
      "quoteRevisionId",
      "status",
      "itemId",
      "itemType",
      "description",
      "methodType",
      "companyId",
      "createdBy",
      "taxPercent",
      "unitPricePrecision",
      "sortOrder"
    ],
    "properties": {
      "id": {
        "type": "string",
        "description": "Note:"
      },
      "quoteId": {
        "type": "string",
        "description": "Note:"
      },
      "quoteRevisionId": {
        "type": "integer"
      },
      "status": {
        "type": "string",
        "enum": [
          "Not Started",
          "In Progress",
          "Complete",
          "No Quote"
        ]
      },
      "estimatorId": {
        "type": "string",
        "description": "Note:"
      },
      "itemId": {
        "type": "string",
        "description": "Note:"
      },
      "itemType": {
        "type": "string"
      },
      "description": {
        "type": "string"
      },
      "customerPartId": {
        "type": "string"
      },
      "customerPartRevision": {
        "type": "string"
      },
      "methodType": {
        "type": "string",
        "enum": [
          "Purchase to Order",
          "Pull from Inventory",
          "Make to Order"
        ]
      },
      "unitOfMeasureCode": {
        "type": "string"
      },
      "internalNotes": {
        "type": "object",
        "additionalProperties": true
      },
      "companyId": {
        "type": "string",
        "description": "Note:"
      },
      "createdBy": {
        "type": "string",
        "description": "Note:"
      },
      "updatedAt": {
        "type": "string",
        "format": "date-time"
      },
      "updatedBy": {
        "type": "string",
        "description": "Note:"
      },
      "customFields": {
        "type": "object",
        "additionalProperties": true
      },
      "modelUploadId": {
        "type": "string",
        "description": "Note:"
      },
      "quantity": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "additionalCharges": {
        "type": "object",
        "additionalProperties": true
      },
      "locationId": {
        "type": "string",
        "description": "Note:"
      },
      "noQuoteReason": {
        "type": "string"
      },
      "taxPercent": {
        "type": "number"
      },
      "tags": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "unitPricePrecision": {
        "type": "integer"
      },
      "externalNotes": {
        "type": "object",
        "additionalProperties": true
      },
      "configuration": {
        "type": "object",
        "additionalProperties": true
      },
      "pricingRuleId": {
        "type": "string",
        "description": "Note:"
      },
      "priceTrace": {
        "type": "object",
        "additionalProperties": true
      },
      "sortOrder": {
        "type": "number"
      }
    }
  },
  "job": {
    "type": "object",
    "required": [
      "id",
      "jobId",
      "itemId",
      "unitOfMeasureCode",
      "locationId",
      "status",
      "deadlineType",
      "quantity",
      "scrapQuantity",
      "quantityComplete",
      "quantityShipped",
      "quantityReceivedToInventory",
      "companyId",
      "createdAt",
      "createdBy",
      "priority"
    ],
    "properties": {
      "id": {
        "type": "string",
        "description": "Note:"
      },
      "jobId": {
        "type": "string"
      },
      "itemId": {
        "type": "string",
        "description": "Note:"
      },
      "unitOfMeasureCode": {
        "type": "string"
      },
      "customerId": {
        "type": "string"
      },
      "locationId": {
        "type": "string",
        "description": "Note:"
      },
      "status": {
        "type": "string",
        "enum": [
          "Draft",
          "Ready",
          "In Progress",
          "Paused",
          "Completed",
          "Cancelled",
          "Overdue",
          "Due Today",
          "Planned",
          "Closed"
        ]
      },
      "dueDate": {
        "type": "string",
        "format": "date"
      },
      "deadlineType": {
        "type": "string",
        "enum": [
          "No Deadline",
          "ASAP",
          "Soft Deadline",
          "Hard Deadline"
        ]
      },
      "quantity": {
        "type": "number"
      },
      "scrapQuantity": {
        "type": "number"
      },
      "quantityComplete": {
        "type": "number"
      },
      "quantityShipped": {
        "type": "number"
      },
      "quantityReceivedToInventory": {
        "type": "number"
      },
      "salesOrderId": {
        "type": "string",
        "description": "Note:"
      },
      "salesOrderLineId": {
        "type": "string",
        "description": "Note:"
      },
      "quoteId": {
        "type": "string",
        "description": "Note:"
      },
      "quoteLineId": {
        "type": "string"
      },
      "modelUploadId": {
        "type": "string"
      },
      "notes": {
        "type": "object",
        "additionalProperties": true
      },
      "assignee": {
        "type": "string",
        "description": "Note:"
      },
      "customFields": {
        "type": "object",
        "additionalProperties": true
      },
      "companyId": {
        "type": "string",
        "description": "Note:"
      },
      "createdAt": {
        "type": "string",
        "format": "date-time"
      },
      "createdBy": {
        "type": "string",
        "description": "Note:"
      },
      "updatedAt": {
        "type": "string",
        "format": "date-time"
      },
      "updatedBy": {
        "type": "string",
        "description": "Note:"
      },
      "tags": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "configuration": {
        "type": "object",
        "additionalProperties": true
      },
      "releasedDate": {
        "type": "string",
        "format": "date-time"
      },
      "completedDate": {
        "type": "string",
        "format": "date-time"
      },
      "estimatedTime": {
        "type": "number"
      },
      "actualTime": {
        "type": "number"
      },
      "secondsToComplete": {
        "type": "number"
      },
      "startDate": {
        "type": "string",
        "format": "date"
      },
      "storageUnitId": {
        "type": "string",
        "description": "Note:"
      },
      "priority": {
        "type": "number"
      },
      "productionQuantity": {
        "type": "number"
      }
    }
  },
  "employee": {
    "type": "object",
    "required": [
      "id",
      "companyId",
      "employeeTypeId",
      "active"
    ],
    "properties": {
      "id": {
        "type": "string",
        "description": "Note:"
      },
      "companyId": {
        "type": "string",
        "description": "Note:"
      },
      "employeeTypeId": {
        "type": "string",
        "description": "Note:"
      },
      "active": {
        "type": "boolean"
      },
      "pin": {
        "type": "string"
      }
    }
  }
} as const satisfies Record<string, JsonSchema>;
