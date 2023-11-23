import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const port = process.env.PORT || 3344; // Use the specified port or default to 3000
    const app = await NestFactory.create(AppModule);
    await app.listen(port);
}

bootstrap()
    .then(() => console.log('Microservice is listening'))
    .catch((err) => console.error(`Error: ${err.message}`));
