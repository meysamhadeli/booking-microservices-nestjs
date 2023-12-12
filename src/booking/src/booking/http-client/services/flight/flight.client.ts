import axios from 'axios';
import {FlightDto, ReserveSeatRequestDto, SeatDto} from "building-blocks/contracts/flight.contract";
import {Injectable} from "@nestjs/common";
import {HttpContext} from "building-blocks/context/context";
import * as https from "https";
import {AxiosInstance} from "axios/index";

export interface IFlightClient {
    getFlightById(id: number): Promise<FlightDto>;

    getAvalibaleSeats(flightId: number): Promise<SeatDto[]>;

    reserveSeat(request: ReserveSeatRequestDto): Promise<void>;
}

@Injectable()
export class FlightClient implements IFlightClient {

    private readonly client: AxiosInstance;
    constructor() {
        this.client = axios.create({
            baseURL: 'http://localhost:3344',
            timeout: 60000,
            maxContentLength: 500 * 1000 * 1000,
            httpsAgent: new https.Agent({keepAlive: true}),
        });
    }

    async getFlightById(id: number): Promise<FlightDto> {
        const result = await this.client
            .get<FlightDto>(`/api/v1/flight/get-by-id?id=${id}`, {
                headers: {
                    Authorization: HttpContext.headers.authorization.toString()
                }
            });

        return result?.data;
    }

    async getAvalibaleSeats(flightId: number): Promise<SeatDto[]> {
        const result = await this.client
            .get<SeatDto[]>(`/api/v1/seat/get-available-seats?flightId=${flightId}`, {
                headers: {
                    Authorization: HttpContext.headers.authorization.toString()
                }
            });

        return result?.data;
    }

    async reserveSeat(request: ReserveSeatRequestDto): Promise<void> {
        await this.client
            .post(`/api/v1/seat/reserve`, request, {
                headers: {
                    Authorization: HttpContext.headers.authorization.toString()
                }
            });
    }
}
