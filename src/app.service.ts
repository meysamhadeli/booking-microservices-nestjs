// import { Injectable } from '@nestjs/common';
// import { context, trace, diag } from '@opentelemetry/api';
//
// @Injectable()
// export class AppService {
//     getHello(): string {
//         const span = trace.getSpan(context.active());
//         console.log(context);
//         span.setAttribute('test_setAttribute', true);
//         span.setAttribute('some-other-attribute', true);
//         console.log('should log error after this');
//         diag.error('test error');
//         span.end();
//         return 'Hello World!';
//     }
// }
