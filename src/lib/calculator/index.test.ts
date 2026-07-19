import { describe, expect, it } from "vitest";
import { simulate } from "./index";

describe("simulate", () => {
  it("正社員とフリーランスで異なる金額を独立して計算する", () => {
    const result = simulate({
      employeeAmount: 5_000_000,
      employeeMode: "annual",
      freelanceAmount: 7_000_000,
      freelanceMode: "annual",
      dependents: 0,
      expenseRate: 0.1,
      taxFilingType: "blue",
      age: 30,
    });

    expect(result.employee.grossIncome).toBe(5_000_000);
    expect(result.freelance.grossIncome).toBe(7_000_000);
  });

  it("正社員とフリーランスで異なる入力単位（年収/月額）を独立して指定できる", () => {
    const mixed = simulate({
      employeeAmount: 500_000,
      employeeMode: "monthly",
      freelanceAmount: 7_000_000,
      freelanceMode: "annual",
      dependents: 0,
      expenseRate: 0.1,
      taxFilingType: "blue",
      age: 30,
    });

    expect(mixed.employee.grossIncome).toBe(6_000_000);
    expect(mixed.freelance.grossIncome).toBe(7_000_000);
  });

  it("月額入力の場合は12倍して年額として計算する", () => {
    const monthly = simulate({
      employeeAmount: 500_000,
      employeeMode: "monthly",
      freelanceAmount: 500_000,
      freelanceMode: "monthly",
      dependents: 0,
      expenseRate: 0.1,
      taxFilingType: "blue",
      age: 30,
    });
    const annual = simulate({
      employeeAmount: 6_000_000,
      employeeMode: "annual",
      freelanceAmount: 6_000_000,
      freelanceMode: "annual",
      dependents: 0,
      expenseRate: 0.1,
      taxFilingType: "blue",
      age: 30,
    });

    expect(monthly.employee.grossIncome).toBe(annual.employee.grossIncome);
    expect(monthly.freelance.grossIncome).toBe(annual.freelance.grossIncome);
    expect(monthly.employee.takeHomePay).toBe(annual.employee.takeHomePay);
    expect(monthly.freelance.takeHomePay).toBe(annual.freelance.takeHomePay);
  });

  it("経費率が異なるとフリーランスの手取りに反映される", () => {
    const result = simulate({
      employeeAmount: 6_000_000,
      employeeMode: "annual",
      freelanceAmount: 6_000_000,
      freelanceMode: "annual",
      dependents: 0,
      expenseRate: 0.2,
      taxFilingType: "blue",
      age: 30,
    });

    expect(result.freelance.expenses).toBe(1_200_000);
  });
});
