"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app/app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prometheus_metrics_1 = require("building-blocks/src/modules/monitoring/prometheus.metrics");
const error_handlers_filter_1 = require("building-blocks/src/filters/error-handlers.filter");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        const globalPrefix = 'api';
        app.setGlobalPrefix(globalPrefix);
        const port = process.env.PORT || 3333;
        app.enableVersioning({
            type: common_1.VersioningType.URI,
        });
        const config = new swagger_1.DocumentBuilder()
            .setTitle('booking-microservices-nestjs')
            .setDescription('booking-microservices-nestjs api description')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('swagger', app, document);
        app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
        prometheus_metrics_1.PrometheusMetrics.registerMetricsEndpoint(app);
        app.useGlobalFilters(new error_handlers_filter_1.ErrorHandlersFilter());
        yield app.listen(port);
        common_1.Logger.log(`🚀 Application is running on: http://localhost:${port}`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map