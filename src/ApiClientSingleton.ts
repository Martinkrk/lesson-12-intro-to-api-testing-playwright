import { APIRequestContext } from 'playwright-core';
import { LoginDTO } from '../tests/dto/LoginDTO';
import { OrderDTO } from '../tests/dto/OrderDTO';
import { StatusCodes } from 'http-status-codes';
import { expect } from '@playwright/test'

const serviceURL = 'https://backend.tallinn-learning.ee';
const loginPath = '/login/student';
const orderPath = '/orders';

export class ApiClientSingleton {
  static instance: ApiClientSingleton;
  private request: APIRequestContext;
  private jwt: string = '';

  private constructor(request: APIRequestContext) {
    this.request = request;
  }

  public static async getInstance(request: APIRequestContext): Promise<ApiClientSingleton> {
    if (!ApiClientSingleton.instance) {
      this.instance = new ApiClientSingleton(request);
      await this.instance.requestJwt();
    }

    return this.instance;
  }

  private async requestJwt(): Promise<void> {
    console.log('Requesting JWT...');
    const authResponse = await this.request.post(`${serviceURL}${loginPath}`, {
      data: LoginDTO.createLoginWithCorrectData()
    });

    if (authResponse.status() !== StatusCodes.OK) {
      console.log('Authorization failed');
      throw new Error(`Request failed with status ${authResponse.status()}`);
    }

    this.jwt = await authResponse.text();
    console.log(`jwt received: ${this.jwt}`);
  }

  async createOrderAndReturnOrderId(): Promise<number> {
    console.log('Creating order...');
    const response = await this.request.post(`${serviceURL}${orderPath}`, {
      data: OrderDTO.createOrderWithRandomData(),
      headers: {
        Authorization: `Bearer ${this.jwt}`,
      }
    });
    console.log(`Order response:\n${response}`);

    expect(response.status()).toBe(StatusCodes.OK);
    const responseBody = await response.json();
    console.log(`Order created:\n${responseBody}`);

    return responseBody.id;
  }
}