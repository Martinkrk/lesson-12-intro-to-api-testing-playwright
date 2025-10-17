import { expect } from "@playwright/test";

export class OrderDTO {
  status: string;
  courierId: number;
  customerName: string;
  customerPhone: string;
  comment: string;
  id: number;

  private constructor(
    status: string,
    courierId: number,
    customerName: string,
    customerPhone: string,
    comment: string,
    id: number,
  ) {
    this.status = status;
    this.courierId = courierId;
    this.customerName = customerName;
    this.customerPhone = customerPhone;
    this.comment = comment;
    this.id = id;
  }

  static createOrderWithRandomData(): OrderDTO {
    return new OrderDTO(
      "OPEN",
      Math.floor(Math.random() * 100),
      "John Doe",
      "+123456789",
      "Urgent order",
      Math.floor(Math.random() * 100),
    );
  }

  static checkServerResponse(order: OrderDTO): void {
    expect.soft(order.id).not.toBeNull();
    expect.soft(order.customerName.length).toBeGreaterThan(0);
  }
}
