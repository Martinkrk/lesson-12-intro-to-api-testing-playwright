import { expect, test } from "@playwright/test";
import { StatusCodes } from "http-status-codes";
import { OrderDTO } from "./dto/OrderDTO";
import { LoginDTO } from "./dto/LoginDTO";

const BASE_URL = "https://backend.tallinn-learning.ee";
const LOGIN_PATH = "/login/student";
const ORDER_PATH = "/orders";

const JWT_REGEX = /^eyJhb[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

test("Find an order by id", async ({ request }) => {
  const authResponse = await request.post(`${BASE_URL}${LOGIN_PATH}`, {
    data: LoginDTO.createLoginWithCorrectData(),
  });
  expect(authResponse.status()).toBe(StatusCodes.OK);
  const jwt_token = await authResponse.text();
  expect(jwt_token).toMatch(JWT_REGEX);

  const headers = {
    "Content-type": "application/json",
    Authorization: `Bearer ${jwt_token}`,
  };

  const postResponse = await request.post(`${BASE_URL}${ORDER_PATH}`, {
    data: OrderDTO.createOrderWithRandomData(),
    headers: headers,
  });
  expect(postResponse.status()).toBe(StatusCodes.OK);

  const order_id: number = (await postResponse.json()).id;

  const getByIdResponse = await request.get(`${BASE_URL}${ORDER_PATH}/${order_id}`, {
    headers: headers,
  });
  expect(getByIdResponse.status()).toBe(StatusCodes.OK);

  const order: OrderDTO = await getByIdResponse.json();
  expect(order.id).toBe(order_id);

  await request.delete(`${BASE_URL}${ORDER_PATH}/${order_id}`, { headers: headers });
});

test("Delete an order by id", async ({ request }) => {
  const authResponse = await request.post(`${BASE_URL}${LOGIN_PATH}`, {
    data: LoginDTO.createLoginWithCorrectData(),
  });
  expect(authResponse.status()).toBe(StatusCodes.OK);
  const jwt_token = await authResponse.text();
  expect(jwt_token).toMatch(JWT_REGEX);

  const headers = {
    "Content-type": "application/json",
    Authorization: `Bearer ${jwt_token}`,
  };

  const postResponse = await request.post(`${BASE_URL}${ORDER_PATH}`, {
    data: OrderDTO.createOrderWithRandomData(),
    headers: headers,
  });
  expect(postResponse.status()).toBe(StatusCodes.OK);

  const order_id: number = (await postResponse.json()).id;

  const deleteByIdResponse = await request.delete(`${BASE_URL}${ORDER_PATH}/${order_id}`, {
    headers: headers,
  });
  expect(deleteByIdResponse.status()).toBe(StatusCodes.OK);
  const deleteByIdResponseData = await deleteByIdResponse.json();
  expect(deleteByIdResponseData).toBeTruthy();
});
