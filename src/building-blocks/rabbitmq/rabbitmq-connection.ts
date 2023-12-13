import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import configs from '../configs/configs';
import asyncRetry from 'async-retry';

export interface RabbitmqOptions {
  host: string,
  port: number,
  username: string,
  password: string,
  exchange: string;
}

export interface IRabbitmqConnection {
  getChannel(): Promise<amqp.Channel>;

  closeChanel(): Promise<void>;

  closeConnection(): Promise<void>;
}

@Injectable()
export class RabbitmqConnection implements OnModuleInit, IRabbitmqConnection {
  private connection: amqp.Connection = null;
  private channel: amqp.Channel = null;

  async onModuleInit(): Promise<void> {
    await this.initializeConnection();
  }

  async getChannel(): Promise<amqp.Channel> {
    try {
      if (!this.connection) {
        await this.initializeConnection();
      }

      if ((this.connection && !this.channel) || !this.channel) {
        await asyncRetry(
          async () => {
            this.channel = await this.connection.createChannel();
            Logger.log('Channel Created successfully');
          },
          {
            retries: configs.retry.count,
            factor: configs.retry.factor,
            minTimeout: configs.retry.minTimeout,
            maxTimeout: configs.retry.maxTimeout
          }
        );
      }

      this.channel.on("error", async (error): Promise<void> => {
        Logger.error(`Error occurred on channel rabbitmq: ${error}`);
        await this.closeChanel();
        await this.getChannel();
      });

      return this.channel;
    } catch (error) {
      Logger.error('Failed to get channel!');
    }
  }

  async closeChanel(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
        Logger.log('Channel closed successfully');
      }
    } catch (error) {
      Logger.error('Channel close failed!');
    }
  }

  async closeConnection(): Promise<void> {
    try {
      if (this.connection) {
        await this.connection.close();
        Logger.log('Connection closed successfully');
      }
    } catch (error) {
      Logger.error('Connection close failed!');
    }
  }


  private async initializeConnection(): Promise<void> {

    try {
      if (!this.connection || this.connection == undefined) {
        await asyncRetry(
          async () => {
            this.connection = await amqp.connect(
              `amqp://${configs.rabbitmq.host}:${configs.rabbitmq.port}`,
              {
                username: configs.rabbitmq.username,
                password: configs.rabbitmq.password
              }
            );

            Logger.log('RabbitMq connection created successfully');
          },
          {
            retries: configs.retry.count,
            factor: configs.retry.factor,
            minTimeout: configs.retry.minTimeout,
            maxTimeout: configs.retry.maxTimeout
          }
        );

        this.connection.on("error", async (error): Promise<void> => {
          Logger.error(`Error occurred on connection rabbitmq: ${error}`);
          await this.closeConnection();
          await this.initializeConnection();
        });
      }
    } catch (error) {
      throw new Error('Rabbitmq connection failed!');
    }
  }
}
