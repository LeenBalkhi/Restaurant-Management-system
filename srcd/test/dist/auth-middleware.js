"use strict";
exports.__esModule = true;
var checkJwt_1 = require("../middlewares/checkJwt");
var chai_1 = require("chai");
var jwt = require("jsonwebtoken");
//import * as sinon from "ts-sinon";
var sinon = require('sinon');
var express_1 = require("express");
describe('Auth middleware', function () {
    it('should throw an error if no authorization header is present', function () {
        var req = {
            get: function (headerName) {
                return null;
            }
        };
        chai_1.expect(checkJwt_1.checkJwt.bind(this, req, {}, function () { })).to["throw"]();
    });
    it('should throw an error if the authorization header is only one string', function () {
        var req = {
            get: function (headerName) {
                return 'xyz';
            }
        };
        chai_1.expect(checkJwt_1.checkJwt.bind(this, req, {}, function () { })).to["throw"]();
    });
    var headers = [];
    headers["Authorization"] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2Mjk2NDk0NDEsImV4cCI6MTYzMDI1NDI0MX0.KFdsyPdOl7TzhQJCs3mxSvkhKBdXAnrjOYwcpq08lzg';
    it('should yield a userId after decoding the token', function () {
        var req = {
            headers: headers,
            get: function (headerName) {
                return 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2Mjk2NDk0NDEsImV4cCI6MTYzMDI1NDI0MX0.KFdsyPdOl7TzhQJCs3mxSvkhKBdXAnrjOYwcpq08lzg';
            }
        };
        // console.log("koko",req.headers["Authorization"]);
        sinon.stub(jwt, 'verify');
        jwt.verify.returns({ userId: 1 });
        //  checkJwt(req, {}, () => {});
        checkJwt_1.checkJwt(req, express_1.response, function () { });
        chai_1.expect(express_1.response.locals.jwtPayload).to.have.property('userId');
        chai_1.expect(express_1.response.locals.jwtPayload).to.have.property('userId');
        chai_1.expect(jwt.verify.called).to.be["true"];
        jwt.verify.restore();
    });
    it('should throw an error if the token cannot be verified', function () {
        var req = {
            get: function (headerName) {
                return 'Bearer xyz';
            }
        };
        chai_1.expect(checkJwt_1.checkJwt.bind(this, req, {}, function () { })).to["throw"]();
    });
});
