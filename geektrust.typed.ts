export interface Ledger {
  loans: Loan[];
  payments: Payment[];
  balances: Balance[];
}

export interface Loan {
  command: string;
  bankName: string;
  borrowerName: string;
  principalAmount: number;
  noOfYears: number;
  interestRate: number;
}

export interface Payment {
  command: string;
  bankName: string;
  borrowerName: string;
  lumpSumAmount: number;
  emiNo: number;
}

export interface Balance {
  command: string;
  bankName: string;
  borrowerName: string;
  emiNo: number;
}
