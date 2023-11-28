"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandlersFilter = void 0;
const common_1 = require("@nestjs/common");
const http_problem_details_1 = require("http-problem-details");
const joi_1 = require("joi");
const application_exception_1 = __importDefault(require("../types/exeptions/application-exception"));
const serilization_1 = require("../utils/serilization");
let ErrorHandlersFilter = class ErrorHandlersFilter {
    catch(err, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        if (err instanceof application_exception_1.default) {
            const problem = new http_problem_details_1.ProblemDocument({
                type: application_exception_1.default.name,
                title: err.message,
                detail: err.stack,
                status: err.statusCode
            });
            response.status(common_1.HttpStatus.BAD_REQUEST).json(problem);
            common_1.Logger.error((0, serilization_1.serializeObject)(problem));
            return;
        }
        if (err instanceof common_1.BadRequestException) {
            const problem = new http_problem_details_1.ProblemDocument({
                type: common_1.BadRequestException.name,
                title: err.message,
                detail: err.stack,
                status: err.getStatus()
            });
            response.status(common_1.HttpStatus.BAD_REQUEST).json(problem);
            common_1.Logger.error((0, serilization_1.serializeObject)(problem));
            return;
        }
        if (err instanceof common_1.UnauthorizedException) {
            const problem = new http_problem_details_1.ProblemDocument({
                type: common_1.UnauthorizedException.name,
                title: err.message,
                detail: err.stack,
                status: err.getStatus()
            });
            response.status(common_1.HttpStatus.UNAUTHORIZED).json(problem);
            common_1.Logger.error((0, serilization_1.serializeObject)(problem));
            return;
        }
        if (err instanceof common_1.ForbiddenException) {
            const problem = new http_problem_details_1.ProblemDocument({
                type: common_1.ForbiddenException.name,
                title: err.message,
                detail: err.stack,
                status: err.getStatus()
            });
            response.status(common_1.HttpStatus.FORBIDDEN).json(problem);
            common_1.Logger.error((0, serilization_1.serializeObject)(problem));
            return;
        }
        if (err instanceof common_1.NotFoundException) {
            const problem = new http_problem_details_1.ProblemDocument({
                type: common_1.NotFoundException.name,
                title: err.message,
                detail: err.stack,
                status: err.getStatus()
            });
            response.status(common_1.HttpStatus.NOT_FOUND).json(problem);
            common_1.Logger.error((0, serilization_1.serializeObject)(problem));
            return;
        }
        if (err instanceof common_1.ConflictException) {
            const problem = new http_problem_details_1.ProblemDocument({
                type: common_1.ConflictException.name,
                title: err.message,
                detail: err.stack,
                status: err.getStatus()
            });
            response.status(common_1.HttpStatus.CONFLICT).json(problem);
            common_1.Logger.error((0, serilization_1.serializeObject)(problem));
            return;
        }
        if (err instanceof common_1.HttpException) {
            const problem = new http_problem_details_1.ProblemDocument({
                type: common_1.HttpException.name,
                title: err.message,
                detail: err.stack,
                status: err.getStatus()
            });
            response.status(common_1.HttpStatus.CONFLICT).json(problem);
            common_1.Logger.error((0, serilization_1.serializeObject)(problem));
            return;
        }
        if (err instanceof joi_1.ValidationError) {
            const problem = new http_problem_details_1.ProblemDocument({
                type: joi_1.ValidationError.name,
                title: err.message,
                detail: err.stack,
                status: common_1.HttpStatus.BAD_REQUEST
            });
            response.status(common_1.HttpStatus.BAD_REQUEST).json(problem);
            common_1.Logger.error((0, serilization_1.serializeObject)(problem));
            return;
        }
        const problem = new http_problem_details_1.ProblemDocument({
            type: 'INTERNAL_SERVER_ERROR',
            title: err.message,
            detail: err.stack,
            status: err.statusCode || 500
        });
        response.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json(problem);
        common_1.Logger.error((0, serilization_1.serializeObject)(problem));
        return;
    }
};
exports.ErrorHandlersFilter = ErrorHandlersFilter;
exports.ErrorHandlersFilter = ErrorHandlersFilter = __decorate([
    (0, common_1.Catch)()
], ErrorHandlersFilter);
//# sourceMappingURL=error-handlers.filter.js.map