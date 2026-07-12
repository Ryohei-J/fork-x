import type { SimulatorInput } from "./types";

export type ValidationErrors = Partial<Record<keyof SimulatorInput, string>>;

const MAX_AMOUNT = 1_000_000_000; // 10億円（現実的な上限として設定）
const MAX_DEPENDENTS = 20;
const MAX_AGE = 120;

/** シミュレーターの入力値を検証し、フィールドごとのエラーメッセージを返す */
export function validateInput(input: SimulatorInput): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!Number.isFinite(input.employeeAmount) || input.employeeAmount < 0) {
    errors.employeeAmount = "0以上の数値を入力してください";
  } else if (input.employeeAmount > MAX_AMOUNT) {
    errors.employeeAmount = "金額が大きすぎます";
  }

  if (!Number.isFinite(input.freelanceAmount) || input.freelanceAmount < 0) {
    errors.freelanceAmount = "0以上の数値を入力してください";
  } else if (input.freelanceAmount > MAX_AMOUNT) {
    errors.freelanceAmount = "金額が大きすぎます";
  }

  if (
    !Number.isFinite(input.dependents) ||
    !Number.isInteger(input.dependents) ||
    input.dependents < 0
  ) {
    errors.dependents = "0以上の整数を入力してください";
  } else if (input.dependents > MAX_DEPENDENTS) {
    errors.dependents = "人数が多すぎます";
  }

  if (
    !Number.isFinite(input.expenseRate) ||
    input.expenseRate < 0 ||
    input.expenseRate > 1
  ) {
    errors.expenseRate = "0〜100の範囲で入力してください";
  }

  if (
    !Number.isFinite(input.age) ||
    !Number.isInteger(input.age) ||
    input.age < 0 ||
    input.age > MAX_AGE
  ) {
    errors.age = `0〜${MAX_AGE}の範囲で整数を入力してください`;
  }

  return errors;
}
