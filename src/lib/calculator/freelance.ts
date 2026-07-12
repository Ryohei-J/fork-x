import {
  BLUE_RETURN_DEDUCTION,
  NATIONAL_HEALTH_INSURANCE_BASIC_DEDUCTION,
  NATIONAL_HEALTH_INSURANCE_CAP,
  NATIONAL_HEALTH_INSURANCE_CARE_INCOME_RATE,
  NATIONAL_HEALTH_INSURANCE_CARE_PER_CAPITA,
  NATIONAL_HEALTH_INSURANCE_INCOME_RATE,
  NATIONAL_HEALTH_INSURANCE_PER_CAPITA,
  NATIONAL_HEALTH_INSURANCE_REDUCTION_20_PER_PERSON,
  NATIONAL_HEALTH_INSURANCE_REDUCTION_50_PER_PERSON,
  NATIONAL_HEALTH_INSURANCE_REDUCTION_BASE,
  NATIONAL_PENSION_ANNUAL,
  WHITE_RETURN_DEDUCTION,
} from "./constants";
import {
  calcBasicDeduction,
  calcDependentDeduction,
  calcIncomeTax,
  calcResidentTax,
  isCareInsuranceEligible,
} from "./tax";
import type { FreelanceBreakdown, TaxFilingType } from "./types";

/**
 * 国民健康保険料・均等割の軽減割合（7割・5割・2割軽減）を判定する。
 * 判定基準は全国共通（自治体差はない）。
 */
function calcReductionRate(businessIncomeAfterDeductions: number, householdSize: number): number {
  if (businessIncomeAfterDeductions <= NATIONAL_HEALTH_INSURANCE_REDUCTION_BASE) return 0.7;
  if (
    businessIncomeAfterDeductions <=
    NATIONAL_HEALTH_INSURANCE_REDUCTION_BASE +
      NATIONAL_HEALTH_INSURANCE_REDUCTION_50_PER_PERSON * householdSize
  ) {
    return 0.5;
  }
  if (
    businessIncomeAfterDeductions <=
    NATIONAL_HEALTH_INSURANCE_REDUCTION_BASE +
      NATIONAL_HEALTH_INSURANCE_REDUCTION_20_PER_PERSON * householdSize
  ) {
    return 0.2;
  }
  return 0;
}

/**
 * 国民健康保険料（医療分+支援金分＋介護分）を概算する。
 * 全国平均レートを使用し、自治体ごとの差は反映しない。
 * 低所得世帯向けの均等割軽減（7割・5割・2割）は全国共通の基準額で判定する。
 * 賦課限度額は医療分・介護分の合計に対して一律で適用する簡略計算。
 */
function calcNationalHealthInsurance(
  businessIncomeAfterDeductions: number,
  dependents: number,
  careEligible: boolean
): { total: number; care: number } {
  const assessmentBase = Math.max(
    0,
    businessIncomeAfterDeductions - NATIONAL_HEALTH_INSURANCE_BASIC_DEDUCTION
  );
  const householdSize = 1 + Math.max(0, dependents);
  const reductionRate = calcReductionRate(businessIncomeAfterDeductions, householdSize);
  const perCapitaFactor = 1 - reductionRate;

  const medical =
    assessmentBase * NATIONAL_HEALTH_INSURANCE_INCOME_RATE +
    NATIONAL_HEALTH_INSURANCE_PER_CAPITA * householdSize * perCapitaFactor;
  const care = careEligible
    ? assessmentBase * NATIONAL_HEALTH_INSURANCE_CARE_INCOME_RATE +
      NATIONAL_HEALTH_INSURANCE_CARE_PER_CAPITA * householdSize * perCapitaFactor
    : 0;

  const total = Math.round(Math.min(medical + care, NATIONAL_HEALTH_INSURANCE_CAP));
  return { total, care: Math.round(care) };
}

/** フリーランスとして働いた場合の手取りを概算する */
export function calcFreelanceTakeHome(
  annualRevenue: number,
  dependents: number,
  expenseRate: number,
  taxFilingType: TaxFilingType,
  age: number
): FreelanceBreakdown {
  const expenses = Math.round(annualRevenue * expenseRate);
  const businessIncome = annualRevenue - expenses;
  const returnDeduction = taxFilingType === "blue" ? BLUE_RETURN_DEDUCTION : WHITE_RETURN_DEDUCTION;
  const businessIncomeAfterReturn = Math.max(0, businessIncome - returnDeduction);

  const { total: healthInsuranceTotal, care: careInsurance } = calcNationalHealthInsurance(
    businessIncomeAfterReturn,
    dependents,
    isCareInsuranceEligible(age)
  );
  const nationalHealthInsurance = healthInsuranceTotal - careInsurance;
  const nationalPension = NATIONAL_PENSION_ANNUAL;
  const socialInsurance = healthInsuranceTotal + nationalPension;

  const taxableIncome = Math.max(
    0,
    businessIncomeAfterReturn -
      socialInsurance -
      calcBasicDeduction() -
      calcDependentDeduction(dependents)
  );

  const incomeTax = calcIncomeTax(taxableIncome);
  const residentTax = calcResidentTax(taxableIncome, businessIncomeAfterReturn, dependents);
  const takeHomePay = annualRevenue - expenses - socialInsurance - incomeTax - residentTax;

  return {
    grossIncome: annualRevenue,
    expenses,
    socialInsurance,
    nationalHealthInsurance,
    careInsurance,
    nationalPension,
    incomeTax,
    residentTax,
    takeHomePay,
  };
}
