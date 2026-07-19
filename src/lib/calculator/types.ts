export type IncomeInputMode = "annual" | "monthly";
export type TaxFilingType = "blue" | "white";

export interface SimulatorInput {
  /** 正社員の場合の金額（円） */
  employeeAmount: number;
  /** employeeAmount が年収か月給か */
  employeeMode: IncomeInputMode;
  /** フリーランスの場合の金額（円） */
  freelanceAmount: number;
  /** freelanceAmount が年収か月額報酬か */
  freelanceMode: IncomeInputMode;
  /** 扶養人数 */
  dependents: number;
  /** フリーランスの必要経費率（0〜1） */
  expenseRate: number;
  /** フリーランスの確定申告方式（青色申告=65万円控除、白色申告=控除なし） */
  taxFilingType: TaxFilingType;
  /** 年齢（介護保険料の対象判定に使用） */
  age: number;
}

export interface ResultBreakdown {
  /** 額面年収（フリーランスの場合は報酬総額） */
  grossIncome: number;
  /** 必要経費（フリーランスのみ、正社員は0） */
  expenses: number;
  /** 社会保険料の合計 */
  socialInsurance: number;
  /** 所得税 */
  incomeTax: number;
  /** 住民税 */
  residentTax: number;
  /** 手取り額 */
  takeHomePay: number;
}

export interface EmployeeBreakdown extends ResultBreakdown {
  healthInsurance: number;
  /** 介護保険料（40〜64歳のみ発生） */
  careInsurance: number;
  employeePension: number;
  employmentInsurance: number;
}

export interface FreelanceBreakdown extends ResultBreakdown {
  nationalHealthInsurance: number;
  /** 介護保険料（40〜64歳のみ発生） */
  careInsurance: number;
  nationalPension: number;
}

export interface SimulationResult {
  employee: EmployeeBreakdown;
  freelance: FreelanceBreakdown;
}
