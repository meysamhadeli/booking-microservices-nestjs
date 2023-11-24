"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const joi_1 = __importDefault(require("joi"));
const nodeEnv = process.env.NODE_ENV || 'development';
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), `.env.${nodeEnv}`) });
const envVarsSchema = joi_1.default.object()
    .keys({
    NODE_ENV: joi_1.default.string()
        .valid('production', 'development', 'test')
        .required(),
    SERVICE_NAME: joi_1.default.string(),
    PORT: joi_1.default.number().default(3000),
    RABBITMQ_Host: joi_1.default.string()
        .default('localhost')
        .description('Rabbitmq host'),
    RABBITMQ_PORT: joi_1.default.number().default(5672).description('Rabbitmq port'),
    RABBITMQ_USERNAME: joi_1.default.string()
        .default('guest')
        .description('Rabbitmq username'),
    RABBITMQ_PASSWORD: joi_1.default.string()
        .default('guest')
        .description('Rabbitmq password'),
    RABBITMQ_EXCHANGE: joi_1.default.string().description('Rabbitmq exchange'),
    RETRY_COUNT: joi_1.default.number().default(3).description('Number of retries'),
    RETRY_FACTOR: joi_1.default.number()
        .default(2)
        .description('Exponential backoff factor'),
    RETRY_MIN_TIMEOUT: joi_1.default.number()
        .default(1000)
        .description('Minimum time before retrying (1 second)'),
    RETRY_MAX_TIMEOUT: joi_1.default.number()
        .default(60000)
        .description('Maximum time before retrying (60 seconds)'),
    MONITORING_JAEGER_ENDPOINT: joi_1.default.string()
        .default('http://localhost:14268/api/traces')
        .description('Jaeger Endpoint'),
    MONITORING_ZIPKIN_ENDPOINT: joi_1.default.string()
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
exports.default = {
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
//# sourceMappingURL=config.js.map