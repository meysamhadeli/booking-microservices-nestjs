import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

// Determine the environment from NODE_ENV; default to 'development' if not set
const nodeEnv = process.env.NODE_ENV || 'development';

// Load the appropriate .env file based on the environment
dotenv.config({ path: path.join(process.cwd(), `.env.${nodeEnv}`) });

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string()
            .valid('production', 'development', 'test')
            .required(),
        SERVICE_NAME: Joi.string(),
        PORT: Joi.number().default(3000),
        RABBITMQ_Host: Joi.string()
            .default('localhost')
            .description('Rabbitmq host'),
        RABBITMQ_PORT: Joi.number().default(5672).description('Rabbitmq port'),
        RABBITMQ_USERNAME: Joi.string()
            .default('guest')
            .description('Rabbitmq username'),
        RABBITMQ_PASSWORD: Joi.string()
            .default('guest')
            .description('Rabbitmq password'),
        RABBITMQ_EXCHANGE: Joi.string().description('Rabbitmq exchange'),
        RETRY_COUNT: Joi.number().default(3).description('Number of retries'),
        RETRY_FACTOR: Joi.number()
            .default(2)
            .description('Exponential backoff factor'),
        RETRY_MIN_TIMEOUT: Joi.number()
            .default(1000)
            .description('Minimum time before retrying (1 second)'),
        RETRY_MAX_TIMEOUT: Joi.number()
            .default(60000)
            .description('Maximum time before retrying (60 seconds)'),
        MONITORING_JAEGER_ENDPOINT: Joi.string()
            .default('http://localhost:14268/api/traces')
            .description('Jaeger Endpoint'),
        MONITORING_ZIPKIN_ENDPOINT: Joi.string()
            .default('http://zipkin-server:9411/api/v2/spans')
            .description('Zipkin Endpoint'),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: 'key' } })
    .validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export default {
    env: envVars.NODE_ENV,
    serviceName: envVars.SERVICE_NAME,
    port: envVars.PORT,
    rabbitmq: {
        host: envVars.RABBITMQ_Host,
        port: envVars.RABBITMQ_PORT,
        username: envVars.RABBITMQ_USERNAME,
        password: envVars.RABBITMQ_PASSWORD,
        exchange: envVars.RABBITMQ_EXCHANGE,
    },
    retry: {
        count: envVars.RETRY_COUNT,
        factor: envVars.RETRY_FACTOR,
        minTimeout: envVars.RETRY_MIN_TIMEOUT,
        maxTimeout: envVars.RETRY_MAX_TIMEOUT,
    },
    monitoring: {
        jaegerEndpoint: envVars.MONITORING_JAEGER_ENDPOINT,
        zipkinEndpoint: envVars.MONITORING_ZIPKIN_ENDPOINT,
    },
};
