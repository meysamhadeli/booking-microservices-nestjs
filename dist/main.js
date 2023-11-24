"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app/app.module");
const prometheusMetrics_1 = require("./modules/monitorings/prometheusMetrics");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    prometheusMetrics_1.PrometheusMetrics.registerMetricsEndpoint(app);
    await app.listen(3400);
}
bootstrap();
//# sourceMappingURL=main.js.map