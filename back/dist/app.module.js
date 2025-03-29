"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("./config/typeorm");
const users_module_1 = require("./users/users.module");
const suscriptions_module_1 = require("./suscriptions/suscriptions.module");
const memberships_module_1 = require("./memberships/memberships.module");
const workout_routine_module_1 = require("./workout-routine/workout-routine.module");
const file_upload_module_1 = require("./file-upload/file-upload.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [typeorm_2.default],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: async (config) => {
                    const typeOrmConfig = config.get('typeorm');
                    if (!typeOrmConfig) {
                        throw new Error('TypeORM configuration is not defined in the environment.');
                    }
                    return typeOrmConfig;
                },
            }),
            users_module_1.UsersModule,
            suscriptions_module_1.SuscriptionsModule,
            memberships_module_1.MembershipsModule,
            workout_routine_module_1.WorkoutRoutineModule,
            file_upload_module_1.FileUploadModule],
        controllers: [],
        providers: [],
    })
], AppModule);
;
//# sourceMappingURL=app.module.js.map