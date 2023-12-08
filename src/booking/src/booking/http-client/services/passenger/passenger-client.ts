import axios, { AxiosResponse } from 'axios';
import {PassengerDto} from "building-blocks/contracts/passenger.contract";
import HttpClientException from "building-blocks/types/exeptions/http-client.exception";
const httpContext = require('express-http-context');

export interface IPassengerClient {
  getPassengerById(id: number): Promise<PassengerDto>;
}

export class PassengerClient implements IPassengerClient {
  private passengerUrl = 'http://localhost:3355';

  async getPassengerById(id: number): Promise<PassengerDto> {

    const result = axios
      .get<PassengerDto>(`${this.passengerUrl}/passenger/v1/get-by-id?id=${id}`, {
        headers: {
          Authorization: httpContext.request.headers.Authorization?.toString()
        }
      })
      .then((response: AxiosResponse<PassengerDto>) => {
        const passengerDto: PassengerDto = response.data;
        return passengerDto;
      })
      .catch((error) => {
        throw new HttpClientException(error);
      });
    return result;
  }
}
