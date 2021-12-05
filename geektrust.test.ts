import {
  getEMIAmount,
  getEMIAmountPaid,
  getEMIsRemaining,
  getInterestAmount,
  getLoan,
  getNoOfEMIsPaid,
  getLumpSumAmountPaid,
  getTotalAmountPaid,
  getTotalNoOfEMIs,
  getTotalRepaymentAmount,
  populateLedger,
  transformLoanData,
  transformPaymentData,
  transformBalanceData,
} from "./geektrust";

jest.mock("fs");

const mockLoan = {
  command: "LOAN",
  bankName: "IDIDI",
  borrowerName: "Dale",
  principalAmount: 10000,
  noOfYears: 5,
  interestRate: 4,
};

const mockPayments = [
  {
    command: "PAYMENT",
    bankName: "IDIDI",
    borrowerName: "Dale",
    lumpSumAmount: 1000,
    emiNo: 2,
  },
];

const mockLoans = [
  {
    command: "LOAN",
    bankName: "IDIDI",
    borrowerName: "Dale",
    principalAmount: 5000,
    noOfYears: 1,
    interestRate: 6,
  },
  {
    command: "LOAN",
    bankName: "MBI",
    borrowerName: "Harry",
    principalAmount: 10000,
    noOfYears: 3,
    interestRate: 7,
  },
  {
    command: "LOAN",
    bankName: "UON",
    borrowerName: "Shelly",
    principalAmount: 15000,
    noOfYears: 2,
    interestRate: 9,
  },
];

describe("geektrust", () => {
  describe("populateLedger() function", () => {
    const mockLedger = {
      loans: [],
      payments: [],
      balances: [],
    };

    test("returns a ledger with correct loan data", async () => {
      await populateLedger("LOAN IDIDI Dale 10000 5 4", mockLedger);
      expect(mockLedger).toEqual({
        ...mockLedger,
        loans: [
          {
            command: "LOAN",
            bankName: "IDIDI",
            borrowerName: "Dale",
            principalAmount: 10000,
            noOfYears: 5,
            interestRate: 4,
          },
        ],
      });
    });

    test("returns a ledger with correct balance data", async () => {
      await populateLedger("BALANCE IDIDI Dale 5", mockLedger);
      expect(mockLedger).toEqual({
        ...mockLedger,
        balances: [
          {
            command: "BALANCE",
            bankName: "IDIDI",
            borrowerName: "Dale",
            emiNo: 5,
          },
        ],
      });
    });

    test("returns a ledger with correct payment data", async () => {
      await populateLedger("PAYMENT IDIDI Dale 1000 5", mockLedger);
      expect(mockLedger).toEqual({
        ...mockLedger,
        payments: [
          {
            command: "PAYMENT",
            bankName: "IDIDI",
            borrowerName: "Dale",
            lumpSumAmount: 1000,
            emiNo: 5,
          },
        ],
      });
    });
  });

  describe("transformLoanData() function", () => {
    test("returns a loan object given a correctly formatted data string", () => {
      expect(
        transformLoanData(["LOAN", "IDIDI", "Dale", "5000", "1", "6"])
      ).toEqual({
        command: "LOAN",
        bankName: "IDIDI",
        borrowerName: "Dale",
        principalAmount: 5000,
        noOfYears: 1,
        interestRate: 6,
      });
    });
  });

  describe("transformPaymentData() function", () => {
    test("returns a payment object given a correctly formatted data string", () => {
      expect(
        transformPaymentData(["PAYMENT", "IDIDI", "Dale", "1000", "5"])
      ).toEqual({
        command: "PAYMENT",
        bankName: "IDIDI",
        borrowerName: "Dale",
        lumpSumAmount: 1000,
        emiNo: 5,
      });
    });
  });

  describe("transformBalanceData() function", () => {
    test("returns a balance object given a correctly formatted data string", () => {
      expect(transformBalanceData(["BALANCE", "IDIDI", "Dale", "3"])).toEqual({
        command: "BALANCE",
        bankName: "IDIDI",
        borrowerName: "Dale",
        emiNo: 3,
      });
    });
  });

  describe("getLoan() function", () => {
    test("returns a loan object which matches the given bank and borrower name", () => {
      expect(getLoan(mockLoans, "IDIDI", "Dale")).toEqual(mockLoans[0]);
    });

    test("returns undefined if no match found", () => {
      expect(getLoan(mockLoans, "IDIDI", "Smith")).toBeUndefined();
    });
  });

  describe("getTotalNoOfEMIs() function", () => {
    test("returns the correct no of monthly installments", () => {
      expect(getTotalNoOfEMIs(mockLoan)).toEqual(60);
      expect(getTotalNoOfEMIs({ ...mockLoan, noOfYears: 1 })).toEqual(12);
      expect(getTotalNoOfEMIs({ ...mockLoan, noOfYears: 10 })).toEqual(120);
    });
  });

  describe("getTotalRepaymentAmount() function", () => {
    test("returns the correct total payment amount", () => {
      expect(getTotalRepaymentAmount(mockLoan)).toEqual(12000);
      expect(getTotalRepaymentAmount({ ...mockLoan, noOfYears: 1 })).toEqual(
        10400
      );
      expect(getTotalRepaymentAmount({ ...mockLoan, noOfYears: 10 })).toEqual(
        14000
      );
    });
  });

  describe("getInterestAmount() function", () => {
    test("returns the correct interest amount", () => {
      expect(getInterestAmount(mockLoan)).toEqual(2000);
      expect(getInterestAmount({ ...mockLoan, noOfYears: 1 })).toEqual(400);
      expect(getInterestAmount({ ...mockLoan, noOfYears: 10 })).toEqual(4000);
    });
  });

  describe("getEMIAmount() function", () => {
    test("returns the correct amount of each monthly repayment", () => {
      expect(getEMIAmount(mockLoan)).toEqual(200);
    });
  });

  describe("getEMIAmountPaid() function", () => {
    test("returns the correct total amount of already paid monthly installments", () => {
      expect(getEMIAmountPaid(mockLoan, 6)).toEqual(1200);
      expect(getEMIAmountPaid(mockLoan, 12)).toEqual(2400);
    });
  });

  describe("getEMIsRemaining() function", () => {
    test("returns the correct total number of monthly installments left to pay", () => {
      expect(getEMIsRemaining(mockLoan, 6, [])).toEqual(54);
      expect(getEMIsRemaining(mockLoan, 6, mockPayments)).toEqual(49);
    });
  });

  describe("getNoOfEMIsPaid() function", () => {
    test("returns the total number of EMIs covered by lump sum payments", () => {
      expect(getNoOfEMIsPaid(2000, 400)).toEqual(5);
      expect(getNoOfEMIsPaid(2000, 500)).toEqual(4);
      expect(getNoOfEMIsPaid(2000, 600)).toEqual(3);
    });
  });

  describe("getLumpSumAmountPaid() function", () => {
    test("returns total lump sum payment amount made, up to and including given emi number", () => {
      expect(getLumpSumAmountPaid(mockPayments, 1)).toEqual(0);
      expect(getLumpSumAmountPaid(mockPayments, 2)).toEqual(1000);
      expect(getLumpSumAmountPaid(mockPayments, 30)).toEqual(1000);
    });
  });

  describe("getTotalAmountPaid() function", () => {
    test("returns the correct total amount paid, including any lump sum payments, up to and including given emi number", () => {
      expect(getTotalAmountPaid(mockLoan, 1, mockPayments)).toEqual(200);
      expect(getTotalAmountPaid(mockLoan, 2, mockPayments)).toEqual(1400);
    });
  });
});
