export const orderSchema = {
  type: "object",
  properties: {
    status: { type: "string" },
    courierId: { type: "number" },
    customerName: { type: "string" },
    customerPhone: { type: "string" },
    comment: { type: "string" },
    id: { type: "number" },
  },
  required: ["status", "courierId", "customerName", "customerPhone", "comment", "id"],
};
