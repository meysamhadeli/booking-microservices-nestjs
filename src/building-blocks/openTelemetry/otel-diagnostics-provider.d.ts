import { Context, Meter, Span, Tracer } from '@opentelemetry/api';
import { Logger } from '@opentelemetry/api-logs';
export declare class OtelDiagnosticsProvider {
    constructor();
    getInstrumentationName(): string;
    getTracer(): Tracer;
    getMeter(): Meter;
    getLogger(): Logger;
    getCurrentSpan(): Span | undefined;
    getSpanFromContext(ctx: Context): Span | undefined;
}
