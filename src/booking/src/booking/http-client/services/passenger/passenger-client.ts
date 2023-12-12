import axios, {AxiosInstance} from 'axios';
import {PassengerDto} from "building-blocks/contracts/passenger.contract";
import {Injectable} from "@nestjs/common";
import {HttpContext} from "building-blocks/context/context";
import https from "https";

export interface IPassengerClient {
  getPassengerById(id: number): Promise<PassengerDto>;
}

@Injectable()
export class PassengerClient implements IPassengerClient {
    private readonly client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: 'http://localhost:3355',
            timeout: 60000,
            maxContentLength: 500 * 1000 * 1000,
            httpsAgent: new https.Agent({ keepAlive: true }),
        });
    }

  async getPassengerById(id: number): Promise<PassengerDto> {

    const result = await this.client
      .get<PassengerDto>(`/api/v1/passenger/get-by-id?id=${id}`, {
        headers: {
          Authorization: HttpContext.headers.authorization.toString()
        }
      });

    return result?.data;
  }
}
