import { APIRequestContext } from "playwright-core";
import { LoginDTO } from "../tests/dto/LoginDTO";
import { OrderDTO } from "../tests/dto/OrderDTO";
import { StatusCodes } from "http-status-codes";
import { expect } from "@playwright/test";

const BASE_URL_PATH = "https://backend.tallinn-learning.ee";
const LOGIN_PATH = "/login/student";
const ORDER_PATH = "/orders";
const JWT_REGEX = /^eyJhb[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

export class ApiClientSingleton {
  static instance: ApiClientSingleton;
  private request: APIRequestContext;
  private jwt: string = "";
  private headers!: { "Content-type": string; "Authorization": string };

  private constructor(request: APIRequestContext) {
    this.request = request;
  }

  public static async getInstance(request: APIRequestContext): Promise<ApiClientSingleton> {
    if (!ApiClientSingleton.instance) {
      this.instance = new ApiClientSingleton(request);
      await this.instance.requestJwt();
    } else {
      this.instance.request = request; // Обновляем request
    }

    return this.instance;
  }

  private async requestJwt(): Promise<void> {
    const authResponse = await this.request.post(`${BASE_URL_PATH}${LOGIN_PATH}`, {
      data: LoginDTO.createLoginWithCorrectData(),
    });

    if (authResponse.status() !== StatusCodes.OK) {
      throw new Error(`Request failed with status ${authResponse.status()}`);
    }

    this.jwt = await authResponse.text();
    expect(this.jwt).toMatch(JWT_REGEX);
    this.headers = {
      "Content-type": "application/json",
      "Authorization": `Bearer ${this.jwt}`,
    };
  }

  async findAllOrders(): Promise<OrderDTO[]> {
    const response = await this.request.get(`${BASE_URL_PATH}${ORDER_PATH}`, {
      headers: this.headers,
    });
    expect(response.status()).toBe(StatusCodes.OK);

    return await response.json();
  }

  async createOrderAndReturnOrder(): Promise<OrderDTO> {
    const response = await this.request.post(`${BASE_URL_PATH}${ORDER_PATH}`, {
      data: OrderDTO.createOrderWithRandomData(),
      headers: this.headers,
    });
    expect(response.status()).toBe(StatusCodes.OK);

    return await response.json();
  }

  async findOrderById(id: number): Promise<OrderDTO> {
    const response = await this.request.get(`${BASE_URL_PATH}${ORDER_PATH}/${id}`, {
      headers: this.headers,
    });
    expect(response.status()).toBe(StatusCodes.OK);

    return await response.json();
  }

  async deleteOrder(id: number): Promise<boolean> {
    const response = await this.request.delete(`${BASE_URL_PATH}${ORDER_PATH}/${id}`, {
      headers: this.headers,
    });
    expect(response.status()).toBe(StatusCodes.OK);

    return await response.json();
  }
}