import { describe, expect, it } from "vitest";
import { calcEmployeeTakeHome } from "./employee";

describe("calcEmployeeTakeHome", () => {
  it("年収600万円・扶養0人・30歳（介護保険対象外）の場合を計算する", () => {
    const result = calcEmployeeTakeHome(6_000_000, 0, 30);

    expect(result.grossIncome).toBe(6_000_000);
    expect(result.expenses).toBe(0);
    expect(result.careInsurance).toBe(0);
    expect(result.socialInsurance).toBe(885_000);
    expect(result.incomeTax).toBe(206_242);
    expect(result.residentTax).toBe(304_500);
    expect(result.takeHomePay).toBe(4_604_258);
  });

  it("内訳の合計が社会保険料の合計と一致する", () => {
    const result = calcEmployeeTakeHome(6_000_000, 0, 30);
    expect(
      result.healthInsurance +
        result.careInsurance +
        result.employeePension +
        result.employmentInsurance
    ).toBe(result.socialInsurance);
  });

  it("40〜64歳は介護保険料が追加でかかり手取りが減る", () => {
    const notEligible = calcEmployeeTakeHome(6_000_000, 0, 39);
    const eligible = calcEmployeeTakeHome(6_000_000, 0, 40);

    expect(eligible.careInsurance).toBe(54_600); // 6,000,000 * 0.91%
    expect(notEligible.careInsurance).toBe(0);
    expect(eligible.takeHomePay).toBeLessThan(notEligible.takeHomePay);
  });

  it("65歳になると介護保険料の対象から外れる", () => {
    const result = calcEmployeeTakeHome(6_000_000, 0, 65);
    expect(result.careInsurance).toBe(0);
  });

  it("年収を月給12ヶ月+賞与4ヶ月(年2回)に分解し、それぞれの上限内であれば単純な年収×料率と一致する", () => {
    // 6,000,000円なら 月給375,000円・賞与750,000円×2回 で、どちらも上限（65万円/150万円）内
    const result = calcEmployeeTakeHome(6_000_000, 0, 30);
    expect(result.employeePension).toBe(Math.round(6_000_000 * 0.0915));
    expect(result.healthInsurance).toBe(Math.round(6_000_000 * 0.05));
  });

  it("厚生年金は標準報酬月額（65万円/月）と標準賞与額（150万円/回）の上限を超えると頭打ちになる", () => {
    // 月給・賞与ともに上限に達する年収(1,200万円)と、それを超える年収を比較
    const atCap = calcEmployeeTakeHome(12_000_000, 0, 30);
    const aboveCap = calcEmployeeTakeHome(20_000_000, 0, 30);

    const maxPensionBase = 650_000 * 12 + 1_500_000 * 2; // 10,800,000円
    expect(atCap.employeePension).toBe(Math.round(maxPensionBase * 0.0915));
    expect(aboveCap.employeePension).toBe(atCap.employeePension);
  });

  it("健康保険は標準報酬月額と標準賞与額（年度累計573万円）の上限を超えると頭打ちになる", () => {
    const result = calcEmployeeTakeHome(100_000_000, 0, 30);
    const maxHealthInsuranceBase = 1_390_000 * 12 + 5_730_000; // 22,410,000円
    expect(result.healthInsurance).toBe(Math.round(maxHealthInsuranceBase * 0.05));
  });

  it("年収0円は住民税の非課税限度額以下のため所得税・住民税とも0円になる", () => {
    const result = calcEmployeeTakeHome(0, 0, 30);
    expect(result.incomeTax).toBe(0);
    expect(result.socialInsurance).toBe(0);
    expect(result.residentTax).toBe(0);
    expect(result.takeHomePay).toBe(0);
  });

  it("合計所得金額が住民税の非課税限度額を超えると均等割が課税される", () => {
    // 給与所得控除(55万円)を引いた後の給与所得(合計所得金額)が非課税限度額(45万円)を超える年収
    const result = calcEmployeeTakeHome(1_200_000, 0, 30);
    expect(result.residentTax).toBeGreaterThan(0);
  });

  it("扶養人数が増えると税負担が減り手取りが増える", () => {
    const withoutDependents = calcEmployeeTakeHome(6_000_000, 0, 30);
    const withDependents = calcEmployeeTakeHome(6_000_000, 2, 30);
    expect(withDependents.takeHomePay).toBeGreaterThan(withoutDependents.takeHomePay);
  });
});
