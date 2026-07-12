import {
  BASIC_DEDUCTION,
  CARE_INSURANCE_MAX_AGE,
  CARE_INSURANCE_MIN_AGE,
  DEPENDENT_DEDUCTION_PER_PERSON,
  INCOME_TAX_BRACKETS,
  RECONSTRUCTION_SURTAX_RATE,
  RESIDENT_TAX_EXEMPTION_BASE_PER_PERSON,
  RESIDENT_TAX_EXEMPTION_FLAT_ADDITION,
  RESIDENT_TAX_EXEMPTION_INCOME_DEPENDENT_BONUS,
  RESIDENT_TAX_EXEMPTION_PER_CAPITA_DEPENDENT_BONUS,
  RESIDENT_TAX_INCOME_RATE,
  RESIDENT_TAX_PER_CAPITA,
  SALARY_DEDUCTION_BRACKETS,
} from "./constants";

/** 課税所得に対する所得税額（復興特別所得税を含む）を計算する */
export function calcIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;

  const bracket = INCOME_TAX_BRACKETS.find((b) => taxableIncome <= b.max);
  const baseTax = bracket
    ? taxableIncome * bracket.rate - bracket.deduction
    : 0;

  const tax = Math.max(0, baseTax);
  return Math.round(tax * (1 + RECONSTRUCTION_SURTAX_RATE));
}

/** 住民税の非課税限度額（均等割・所得割それぞれ）を計算する */
function calcResidentTaxExemptionThresholds(dependents: number) {
  const d = Math.max(0, dependents);
  const base = RESIDENT_TAX_EXEMPTION_BASE_PER_PERSON * (1 + d) + RESIDENT_TAX_EXEMPTION_FLAT_ADDITION;
  const hasDependents = d > 0;
  return {
    perCapitaThreshold: base + (hasDependents ? RESIDENT_TAX_EXEMPTION_PER_CAPITA_DEPENDENT_BONUS : 0),
    incomeThreshold: base + (hasDependents ? RESIDENT_TAX_EXEMPTION_INCOME_DEPENDENT_BONUS : 0),
  };
}

/**
 * 住民税額を計算する。
 * taxableIncome: 課税所得（所得割算定用、各種控除後）
 * totalIncome: 合計所得金額（非課税判定用、基礎控除・扶養控除を引く前の所得）
 */
export function calcResidentTax(
  taxableIncome: number,
  totalIncome: number,
  dependents: number
): number {
  const { perCapitaThreshold, incomeThreshold } = calcResidentTaxExemptionThresholds(dependents);

  if (totalIncome <= perCapitaThreshold) return 0; // 均等割・所得割とも非課税
  if (totalIncome <= incomeThreshold || taxableIncome <= 0) return RESIDENT_TAX_PER_CAPITA; // 均等割のみ課税

  return Math.round(taxableIncome * RESIDENT_TAX_INCOME_RATE) + RESIDENT_TAX_PER_CAPITA;
}

/** 基礎控除額 */
export function calcBasicDeduction(): number {
  return BASIC_DEDUCTION;
}

/** 扶養控除額（扶養人数に応じて一律の控除額を合算する簡略計算） */
export function calcDependentDeduction(dependents: number): number {
  return Math.max(0, dependents) * DEPENDENT_DEDUCTION_PER_PERSON;
}

/** 給与所得控除額 */
export function calcSalaryDeduction(annualIncome: number): number {
  if (annualIncome <= 0) return 0;
  const bracket = SALARY_DEDUCTION_BRACKETS.find((b) => annualIncome <= b.max);
  return bracket ? Math.round(bracket.calc(annualIncome)) : 0;
}

/** 介護保険料の対象年齢（40〜64歳）かどうか */
export function isCareInsuranceEligible(age: number): boolean {
  return age >= CARE_INSURANCE_MIN_AGE && age <= CARE_INSURANCE_MAX_AGE;
}
