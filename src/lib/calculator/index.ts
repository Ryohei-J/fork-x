import { calcEmployeeTakeHome } from "./employee";
import { calcFreelanceTakeHome } from "./freelance";
import type { IncomeInputMode, SimulationResult, SimulatorInput } from "./types";

export * from "./types";
export { calcEmployeeTakeHome } from "./employee";
export { calcFreelanceTakeHome } from "./freelance";

/** 入力値（年収 or 月報酬）を年額に正規化する */
function toAnnualAmount(amount: number, mode: IncomeInputMode): number {
  return mode === "monthly" ? amount * 12 : amount;
}

/** 正社員とフリーランス、それぞれ異なる金額での手取りを概算する */
export function simulate(input: SimulatorInput): SimulationResult {
  const employeeAnnual = toAnnualAmount(input.employeeAmount, input.employeeMode);
  const freelanceAnnual = toAnnualAmount(input.freelanceAmount, input.freelanceMode);

  return {
    employee: calcEmployeeTakeHome(employeeAnnual, input.dependents, input.age),
    freelance: calcFreelanceTakeHome(
      freelanceAnnual,
      input.dependents,
      input.expenseRate,
      input.taxFilingType,
      input.age
    ),
  };
}
