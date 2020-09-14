"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResponseData = void 0;
exports.getResponseData = function (data, errMsg) {
    if (errMsg) {
        return {
            result: false,
            errMsg: errMsg,
            data: data,
        };
    }
    else {
        return {
            result: true,
            data: data,
        };
    }
};
