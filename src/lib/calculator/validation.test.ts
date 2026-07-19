import { describe, expect, it } from "vitest";
import { validateInput } from "./validation";
import type { SimulatorInput } from "./types";

const VALID_INPUT: SimulatorInput = {
  employeeAmount: 6_000_000,
  employeeMode: "annual",
  freelanceAmount: 6_000_000,
  freelanceMode: "annual",
  dependents: 0,
  expenseRate: 0.1,
  taxFilingType: "blue",
  age: 30,
};

describe("validateInput", () => {
  it("正常な入力値ではエラーがない", () => {
    expect(validateInput(VALID_INPUT)).toEqual({});
  });

  it("金額がマイナスならエラーになる", () => {
    const errors = validateInput({ ...VALID_INPUT, employeeAmount: -1 });
    expect(errors.employeeAmount).toBeDefined();
  });

  it("金額がNaNならエラーになる", () => {
    const errors = validateInput({ ...VALID_INPUT, freelanceAmount: NaN });
    expect(errors.freelanceAmount).toBeDefined();
  });

  it("扶養人数が負の値・小数ならエラーになる", () => {
    expect(validateInput({ ...VALID_INPUT, dependents: -1 }).dependents).toBeDefined();
    expect(validateInput({ ...VALID_INPUT, dependents: 1.5 }).dependents).toBeDefined();
  });

  it("経費率が0〜1の範囲外ならエラーになる", () => {
    expect(validateInput({ ...VALID_INPUT, expenseRate: -0.1 }).expenseRate).toBeDefined();
    expect(validateInput({ ...VALID_INPUT, expenseRate: 1.1 }).expenseRate).toBeDefined();
  });

  it("年齢が負の値・小数・範囲外ならエラーになる", () => {
    expect(validateInput({ ...VALID_INPUT, age: -1 }).age).toBeDefined();
    expect(validateInput({ ...VALID_INPUT, age: 30.5 }).age).toBeDefined();
    expect(validateInput({ ...VALID_INPUT, age: 200 }).age).toBeDefined();
  });
});
