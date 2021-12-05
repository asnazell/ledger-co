const fs = require("fs");
const readline = require("readline");
const events = require("events");

import type { Ledger, Loan, Payment, Balance } from "./geektrust.typed";

// Assumptions:
// 1. ledger data format is correct (eg this script does not need to validate line data)
// 2. amounts (principal, interest rate, no of years, etc) will always be integers
// 3. borrower can only have 1 loan at a bank

const printLoanRepaymentData = async () => {
  try {
    if (process.argv.length >= 2) {
      const filename = process.argv[2];
      if (filename) {
        const ledger = await getLedger(filename);
        processBalances(ledger);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const getLedger = async (filename: string): Promise<Ledger> => {
  const ledger: Ledger = {
    loans: [],
    payments: [],
    balances: [],
  };
  try {
    const rl = readline.createInterface({
      input: fs.createReadStream(filename),
      crlfDelay: Infinity,
    });
    rl.on("line", (line: string) => populateLedger(line, ledger));
    await events.once(rl, "close");
  } catch (error) {
    console.log(error);
  } finally {
    return ledger;
  }
};

export const populateLedger = async (line: string, ledger: Ledger) => {
  const data = line.split(" ");
  switch (data[0]) {
    case "LOAN":
      const loan = transformLoanData(data);
      return ledger.loans.push(loan);
    case "PAYMENT":
      const payment = transformPaymentData(data);
      return ledger.payments.push(payment);
    case "BALANCE":
      const balance = transformBalanceData(data);
      return ledger.balances.push(balance);
  }
};

export const transformLoanData = (data: string[]): Loan => ({
  command: data[0],
  bankName: data[1],
  borrowerName: data[2],
  principalAmount: parseInt(data[3]),
  noOfYears: parseInt(data[4]),
  interestRate: parseInt(data[5]),
});

export const transformPaymentData = (data: string[]): Payment => ({
  command: data[0],
  bankName: data[1],
  borrowerName: data[2],
  lumpSumAmount: parseInt(data[3]),
  emiNo: parseInt(data[4]),
});

export const transformBalanceData = (data: string[]): Balance => ({
  command: data[0],
  bankName: data[1],
  borrowerName: data[2],
  emiNo: parseInt(data[3]),
});

const processBalances = (ledger: Ledger) => {
  ledger.balances.map((balance) => {
    const loan = getLoan(ledger.loans, balance.bankName, balance.borrowerName);
    if (loan) {
      const payments = getPayments(
        ledger.payments,
        balance.bankName,
        balance.borrowerName
      );
      const amountPaid = getTotalAmountPaid(loan, balance.emiNo, payments);
      const emisRemaining = getEMIsRemaining(loan, balance.emiNo, payments);
      console.log(
        `${balance.bankName} ${balance.borrowerName} ${amountPaid} ${emisRemaining}`
      );
    }
  });
};

export const getLoan = (
  loans: Loan[],
  bankName: string,
  borrowerName: string
): Loan | undefined =>
  loans.find(
    (li) => li.bankName === bankName && li.borrowerName === borrowerName
  );

export const getPayments = (
  payments: Payment[],
  bankName: string,
  borrowerName: string
): Payment[] =>
  payments.filter(
    (payment) =>
      payment.bankName === bankName && payment.borrowerName === borrowerName
  );

export const getTotalNoOfEMIs = (loan: Loan): number => loan.noOfYears * 12;

export const getEMIsRemaining = (
  loan: Loan,
  emiNo: number,
  payments: Payment[]
): number =>
  getTotalNoOfEMIs(loan) -
  emiNo -
  getNoOfEMIsPaid(getLumpSumAmountPaid(payments, emiNo), getEMIAmount(loan));

export const getInterestAmount = (loan: Loan): number =>
  loan.principalAmount * (loan.interestRate / 100) * loan.noOfYears;

export const getTotalRepaymentAmount = (loan: Loan): number =>
  loan.principalAmount + getInterestAmount(loan);

export const getEMIAmount = (loan: Loan): number =>
  Math.ceil(getTotalRepaymentAmount(loan) / getTotalNoOfEMIs(loan));

export const getEMIAmountPaid = (loan: Loan, emiNo: number): number =>
  getEMIAmount(loan) * emiNo;

export const getNoOfEMIsPaid = (
  lumpSumAmountPaid: number,
  emiAmount: number
): number => Math.floor(lumpSumAmountPaid / emiAmount);

export const getLumpSumAmountPaid = (
  payments: Payment[],
  emiNo: number
): number =>
  payments
    .filter((li) => li.emiNo <= emiNo)
    .reduce((total, payment) => total + payment.lumpSumAmount, 0);

export const getTotalAmountPaid = (
  loan: Loan,
  emiNo: number,
  payments: Payment[]
): number =>
  getEMIAmountPaid(loan, emiNo) + getLumpSumAmountPaid(payments, emiNo);

printLoanRepaymentData();
