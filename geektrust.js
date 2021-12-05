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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getTotalAmountPaid = exports.getLumpSumAmountPaid = exports.getNoOfEMIsPaid = exports.getEMIAmountPaid = exports.getEMIAmount = exports.getTotalRepaymentAmount = exports.getInterestAmount = exports.getEMIsRemaining = exports.getTotalNoOfEMIs = exports.getPayments = exports.getLoan = exports.transformBalanceData = exports.transformPaymentData = exports.transformLoanData = exports.populateLedger = void 0;
var fs = require("fs");
var readline = require("readline");
var events = require("events");
// Assumptions:
// 1. ledger data format is correct (eg this script does not need to validate line data)
// 2. amounts (principal, interest rate, no of years, etc) will always be integers
// 3. borrower can only have 1 loan at a bank
var printLoanRepaymentData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var filename, ledger, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                if (!(process.argv.length >= 2)) return [3 /*break*/, 2];
                filename = process.argv[2];
                if (!filename) return [3 /*break*/, 2];
                return [4 /*yield*/, getLedger(filename)];
            case 1:
                ledger = _a.sent();
                processBalances(ledger);
                _a.label = 2;
            case 2: return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.error(err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var getLedger = function (filename) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, rl, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ledger = {
                    loans: [],
                    payments: [],
                    balances: []
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                rl = readline.createInterface({
                    input: fs.createReadStream(filename),
                    crlfDelay: Infinity
                });
                rl.on("line", function (line) { return (0, exports.populateLedger)(line, ledger); });
                return [4 /*yield*/, events.once(rl, "close")];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3:
                error_1 = _a.sent();
                console.log(error_1);
                return [3 /*break*/, 5];
            case 4: return [2 /*return*/, ledger];
            case 5: return [2 /*return*/];
        }
    });
}); };
var populateLedger = function (line, ledger) { return __awaiter(void 0, void 0, void 0, function () {
    var data, loan, payment, balance;
    return __generator(this, function (_a) {
        data = line.split(" ");
        switch (data[0]) {
            case "LOAN":
                loan = (0, exports.transformLoanData)(data);
                return [2 /*return*/, ledger.loans.push(loan)];
            case "PAYMENT":
                payment = (0, exports.transformPaymentData)(data);
                return [2 /*return*/, ledger.payments.push(payment)];
            case "BALANCE":
                balance = (0, exports.transformBalanceData)(data);
                return [2 /*return*/, ledger.balances.push(balance)];
        }
        return [2 /*return*/];
    });
}); };
exports.populateLedger = populateLedger;
var transformLoanData = function (data) { return ({
    command: data[0],
    bankName: data[1],
    borrowerName: data[2],
    principalAmount: parseInt(data[3]),
    noOfYears: parseInt(data[4]),
    interestRate: parseInt(data[5])
}); };
exports.transformLoanData = transformLoanData;
var transformPaymentData = function (data) { return ({
    command: data[0],
    bankName: data[1],
    borrowerName: data[2],
    lumpSumAmount: parseInt(data[3]),
    emiNo: parseInt(data[4])
}); };
exports.transformPaymentData = transformPaymentData;
var transformBalanceData = function (data) { return ({
    command: data[0],
    bankName: data[1],
    borrowerName: data[2],
    emiNo: parseInt(data[3])
}); };
exports.transformBalanceData = transformBalanceData;
var processBalances = function (ledger) {
    ledger.balances.map(function (balance) {
        var loan = (0, exports.getLoan)(ledger.loans, balance.bankName, balance.borrowerName);
        if (loan) {
            var payments = (0, exports.getPayments)(ledger.payments, balance.bankName, balance.borrowerName);
            var amountPaid = (0, exports.getTotalAmountPaid)(loan, balance.emiNo, payments);
            var emisRemaining = (0, exports.getEMIsRemaining)(loan, balance.emiNo, payments);
            console.log("".concat(balance.bankName, " ").concat(balance.borrowerName, " ").concat(amountPaid, " ").concat(emisRemaining));
        }
    });
};
var getLoan = function (loans, bankName, borrowerName) {
    return loans.find(function (li) { return li.bankName === bankName && li.borrowerName === borrowerName; });
};
exports.getLoan = getLoan;
var getPayments = function (payments, bankName, borrowerName) {
    return payments.filter(function (payment) {
        return payment.bankName === bankName && payment.borrowerName === borrowerName;
    });
};
exports.getPayments = getPayments;
var getTotalNoOfEMIs = function (loan) { return loan.noOfYears * 12; };
exports.getTotalNoOfEMIs = getTotalNoOfEMIs;
var getEMIsRemaining = function (loan, emiNo, payments) {
    return (0, exports.getTotalNoOfEMIs)(loan) -
        emiNo -
        (0, exports.getNoOfEMIsPaid)((0, exports.getLumpSumAmountPaid)(payments, emiNo), (0, exports.getEMIAmount)(loan));
};
exports.getEMIsRemaining = getEMIsRemaining;
var getInterestAmount = function (loan) {
    return loan.principalAmount * (loan.interestRate / 100) * loan.noOfYears;
};
exports.getInterestAmount = getInterestAmount;
var getTotalRepaymentAmount = function (loan) {
    return loan.principalAmount + (0, exports.getInterestAmount)(loan);
};
exports.getTotalRepaymentAmount = getTotalRepaymentAmount;
var getEMIAmount = function (loan) {
    return Math.ceil((0, exports.getTotalRepaymentAmount)(loan) / (0, exports.getTotalNoOfEMIs)(loan));
};
exports.getEMIAmount = getEMIAmount;
var getEMIAmountPaid = function (loan, emiNo) {
    return (0, exports.getEMIAmount)(loan) * emiNo;
};
exports.getEMIAmountPaid = getEMIAmountPaid;
var getNoOfEMIsPaid = function (lumpSumAmountPaid, emiAmount) { return Math.floor(lumpSumAmountPaid / emiAmount); };
exports.getNoOfEMIsPaid = getNoOfEMIsPaid;
var getLumpSumAmountPaid = function (payments, emiNo) {
    return payments
        .filter(function (li) { return li.emiNo <= emiNo; })
        .reduce(function (total, payment) { return total + payment.lumpSumAmount; }, 0);
};
exports.getLumpSumAmountPaid = getLumpSumAmountPaid;
var getTotalAmountPaid = function (loan, emiNo, payments) {
    return (0, exports.getEMIAmountPaid)(loan, emiNo) + (0, exports.getLumpSumAmountPaid)(payments, emiNo);
};
exports.getTotalAmountPaid = getTotalAmountPaid;
printLoanRepaymentData();
