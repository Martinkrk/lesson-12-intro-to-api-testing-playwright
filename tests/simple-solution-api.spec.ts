import { expect, test } from "@playwright/test";
import Ajv from "ajv";
import { StatusCodes } from "http-status-codes";
import { OrderDTO } from "./dto/OrderDTO";

import { orderSchema } from "./dto/order-schema";

const BASE_URL = "https://backend.tallinn-learning.ee/test-orders";

const ajv = new Ajv();
const validate = ajv.compile(orderSchema);

test("get order with correct id should receive code 200", async ({ request }) => {
  const response = await request.get(`${BASE_URL}/1`); // .get(BASE_URL + '/1')
  expect.soft(response.status()).toBe(200);
});

test("get order with incorrect id should receive code 400", async ({ request }) => {
  const responseOrderId0 = await request.get(`${BASE_URL}/0`);
  const responseOrderId11 = await request.get(`${BASE_URL}/11`);
  const responseOrderIdNull = await request.get(`${BASE_URL}/null`);
  const responseOrderIdTest = await request.get(`${BASE_URL}/test`);

  expect.soft(responseOrderId0.status()).toBe(StatusCodes.BAD_REQUEST);
  expect.soft(responseOrderId11.status()).toBe(StatusCodes.BAD_REQUEST);
  expect.soft(responseOrderIdNull.status()).toBe(StatusCodes.BAD_REQUEST);
  expect.soft(responseOrderIdTest.status()).toBe(StatusCodes.BAD_REQUEST);
});

test("post order with correct data should receive code 200", async ({ request }) => {
  const requestBody = OrderDTO.createOrderWithRandomData();
  const response = await request.post(BASE_URL, {
    data: requestBody,
  });

  const responseData: OrderDTO = await response.json();
  const valid = validate(responseData);
  expect.soft(valid).toBeTruthy();
  expect.soft(response.status()).toBe(StatusCodes.OK);
  OrderDTO.checkServerResponse(responseData);
});

test("Delete order with correct id", async ({ request }) => {
  const requestBody = OrderDTO.createOrderWithRandomData();
  requestBody.id = 9;

  const responseCreate = await request.post(BASE_URL, {
    data: requestBody,
  });

  const responseDelete = await request.delete(`${BASE_URL}/${requestBody.id}`, {
    headers: {
      api_key: "1234567890123456",
    },
  });

  const responseCreateData: OrderDTO = await responseCreate.json();
  const responseDeleteData: OrderDTO = await responseCreate.json();

  expect.soft(responseCreate.status()).toBe(StatusCodes.OK);
  expect.soft(responseDelete.status()).toBe(204);
  const validCreateJson = validate(responseCreateData);
  const validDeleteJson = validate(responseDeleteData);
  expect(validCreateJson).toBe(true);
  expect(validDeleteJson).toBe(true);
});
