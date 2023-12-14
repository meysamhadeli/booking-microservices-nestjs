declare const _default: {
    env: any;
    serviceName: any;
    port: any;
    rabbitmq: {
        host: any;
        port: any;
        username: any;
        password: any;
        exchange: any;
    };
    postgres: {
        host: any;
        port: any;
        username: any;
        password: any;
        database: any;
        synchronize: any;
        autoLoadEntities: any;
        entities: any;
        migrations: any;
        logging: any;
        migrationsRun: any;
    };
    jwt: {
        secret: any;
        accessExpirationMinutes: any;
        refreshExpirationDays: any;
    };
    retry: {
        count: any;
        factor: any;
        minTimeout: any;
        maxTimeout: any;
    };
    monitoring: {
        jaegerEndpoint: any;
        zipkinEndpoint: any;
    };
};
export default _default;
