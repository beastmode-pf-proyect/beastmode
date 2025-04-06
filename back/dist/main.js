"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
require("reflect-metadata");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        exceptionFactory: ((errors) => {
            const clearError = errors.map((error) => {
                return { property: error.property, constraints: error.constraints };
            });
            return new common_1.BadRequestException({
                alert: "Errors has been detected, this are:",
                errors: clearError
            });
        })
    }));
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Beast Mode API')
        .setDescription('Esta es una Api construida con Nest JS para ser empleada en las demos del backend de Beast Mode')
        .setVersion('1.0').build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.enableCors({
        origin: 'http://localhost:3001',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map