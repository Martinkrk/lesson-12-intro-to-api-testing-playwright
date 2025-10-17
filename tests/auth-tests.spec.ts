import { expect, test } from "@playwright/test";
import { StatusCodes } from "http-status-codes";
import { LoginDTO } from "./dto/LoginDTO";

const BASE_URL = "https://backend.tallinn-learning.ee";

test("TL-11-1 Login/student returns 200 and JWT", async ({ request }) => {
  const response = await request.post(`${BASE_URL}/login/student`, {
    data: LoginDTO.createLoginWithCorrectData(),
  });
  expect(response.status()).toBe(StatusCodes.OK);
  expect((await response.text()).length).toBeGreaterThan(0);
});

test("TL-11-2 Login/student returns 401 if password is incorrect", async ({ request }) => {
  const response = await request.post(`${BASE_URL}/login/student`, {
    data: LoginDTO.createLoginWithBrokenData(),
  });
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED);
});

test("TL-11-3 Login/student returns 401 if password is missing", async ({ request }) => {
  const response = await request.post(`${BASE_URL}/login/student`, {
    data: {
      username: "test",
    },
  });
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED);
});

test("TL-11-4 Login/student returns 401 if data is empty", async ({ request }) => {
  const response = await request.post(`${BASE_URL}/login/student`, {
    data: {},
  });
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED);
});

test("TL-11-4 Login/student returns 401 if data is missing", async ({ request }) => {
  const response = await request.post(`${BASE_URL}/login/student`);
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST);
});
