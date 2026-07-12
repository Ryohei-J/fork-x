import {
  ANNUAL_BONUS_MONTHS,
  BONUS_PAYMENTS_PER_YEAR,
  EMPLOYEE_CARE_INSURANCE_RATE,
  EMPLOYEE_HEALTH_INSURANCE_BONUS_ANNUAL_CAP,
  EMPLOYEE_HEALTH_INSURANCE_MONTHLY_CAP,
  EMPLOYEE_HEALTH_INSURANCE_RATE,
  EMPLOYEE_PENSION_BONUS_PAYMENT_CAP,
  EMPLOYEE_PENSION_MONTHLY_CAP,
  EMPLOYEE_PENSION_RATE,
  EMPLOYMENT_INSURANCE_RATE,
} from "./constants";
import {
  calcBasicDeduction,
  calcDependentDeduction,
  calcIncomeTax,
  calcResidentTax,
  calcSalaryDeduction,
  isCareInsuranceEligible,
} from "./tax";
import type { EmployeeBreakdown } from "./types";

/**
 * 年収を「月給」と「賞与」に分解する。
 * 賞与は年4ヶ月分・年2回支給という一般的なモデルケースを仮定する（実際の内訳は入力させない）。
 */
function splitIntoMonthlyAndBonus(annualIncome: number) {
  const totalMonths = 12 + ANNUAL_BONUS_MONTHS;
  const monthlySalary = annualIncome / totalMonths;
  const bonusPerPayment = (monthlySalary * ANNUAL_BONUS_MONTHS) / BONUS_PAYMENTS_PER_YEAR;
  return { monthlySalary, bonusPerPayment };
}

/** 健康保険・介護保険の算定基礎額（標準報酬月額と標準賞与額、それぞれの上限を適用した後の合計） */
function calcHealthInsuranceBase(annualIncome: number): number {
  const { monthlySalary, bonusPerPayment } = splitIntoMonthlyAndBonus(annualIncome);
  const monthlyBase = Math.min(monthlySalary, EMPLOYEE_HEALTH_INSURANCE_MONTHLY_CAP) * 12;
  const bonusTotal = bonusPerPayment * BONUS_PAYMENTS_PER_YEAR;
  const bonusBase = Math.min(bonusTotal, EMPLOYEE_HEALTH_INSURANCE_BONUS_ANNUAL_CAP);
  return monthlyBase + bonusBase;
}

/** 厚生年金の算定基礎額（標準報酬月額と標準賞与額、それぞれの上限を適用した後の合計） */
function calcPensionBase(annualIncome: number): number {
  const { monthlySalary, bonusPerPayment } = splitIntoMonthlyAndBonus(annualIncome);
  const monthlyBase = Math.min(monthlySalary, EMPLOYEE_PENSION_MONTHLY_CAP) * 12;
  const bonusBase =
    Math.min(bonusPerPayment, EMPLOYEE_PENSION_BONUS_PAYMENT_CAP) * BONUS_PAYMENTS_PER_YEAR;
  return monthlyBase + bonusBase;
}

/** 正社員として働いた場合の手取りを概算する */
export function calcEmployeeTakeHome(
  annualIncome: number,
  dependents: number,
  age: number
): EmployeeBreakdown {
  const healthInsuranceBase = calcHealthInsuranceBase(annualIncome);
  const healthInsurance = Math.round(healthInsuranceBase * EMPLOYEE_HEALTH_INSURANCE_RATE);
  const careInsurance = isCareInsuranceEligible(age)
    ? Math.round(healthInsuranceBase * EMPLOYEE_CARE_INSURANCE_RATE)
    : 0;
  const employeePension = Math.round(calcPensionBase(annualIncome) * EMPLOYEE_PENSION_RATE);
  const employmentInsurance = Math.round(annualIncome * EMPLOYMENT_INSURANCE_RATE);
  const socialInsurance = healthInsurance + careInsurance + employeePension + employmentInsurance;

  const salaryIncome = Math.max(0, annualIncome - calcSalaryDeduction(annualIncome));
  const taxableIncome = Math.max(
    0,
    salaryIncome - socialInsurance - calcBasicDeduction() - calcDependentDeduction(dependents)
  );

  const incomeTax = calcIncomeTax(taxableIncome);
  const residentTax = calcResidentTax(taxableIncome, salaryIncome, dependents);
  const takeHomePay = annualIncome - socialInsurance - incomeTax - residentTax;

  return {
    grossIncome: annualIncome,
    expenses: 0,
    socialInsurance,
    healthInsurance,
    careInsurance,
    employeePension,
    employmentInsurance,
    incomeTax,
    residentTax,
    takeHomePay,
  };
}
