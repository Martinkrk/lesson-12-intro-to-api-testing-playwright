import { expect, test } from "@playwright/test";
import { OrderDTO } from "./dto/OrderDTO";
import { ApiClientSingleton } from "../src/ApiClientSingleton";

test("Create a new order", async ({ request }) => {
  const apiClientSingleton = await ApiClientSingleton.getInstance(request);
  const newOrder: OrderDTO = await apiClientSingleton.createOrderAndReturnOrder();
  const order_id: number = newOrder.id;

  expect(newOrder.customerName.length).not.toBe(0);

  await apiClientSingleton.deleteOrder(order_id);
});

test("Find all orders", async ({ request }) => {
  const apiClientSingleton = await ApiClientSingleton.getInstance(request);
  const orders: OrderDTO[] = await apiClientSingleton.findAllOrders();
  expect(orders.length).not.toBe(0);
});

test("Find an order by id", async ({ request }) => {
  const apiClientSingleton = await ApiClientSingleton.getInstance(request);
  const newOrder: OrderDTO = await apiClientSingleton.createOrderAndReturnOrder();
  const order_id: number = newOrder.id;

  const order: OrderDTO = await apiClientSingleton.findOrderById(order_id);
  expect(order.id).toBe(order_id);

  await apiClientSingleton.deleteOrder(order_id);
});

test("Delete an order by id", async ({ request }) => {
  const apiClientSingleton = await ApiClientSingleton.getInstance(request);
  const newOrder: OrderDTO = await apiClientSingleton.createOrderAndReturnOrder();
  const order_id: number = newOrder.id;

  const deleteOrder = await apiClientSingleton.deleteOrder(order_id);
  expect(deleteOrder).toBeTruthy();
});
