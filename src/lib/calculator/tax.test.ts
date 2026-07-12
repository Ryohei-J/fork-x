import { describe, expect, it } from "vitest";
import {
  calcBasicDeduction,
  calcDependentDeduction,
  calcIncomeTax,
  calcResidentTax,
  calcSalaryDeduction,
} from "./tax";

describe("calcIncomeTax", () => {
  it("課税所得が0以下なら0円", () => {
    expect(calcIncomeTax(0)).toBe(0);
    expect(calcIncomeTax(-100)).toBe(0);
  });

  it("5%の税率区分（195万円以下）を復興特別所得税込みで計算する", () => {
    // 1,000,000 * 5% * 1.021 = 51,050
    expect(calcIncomeTax(1_000_000)).toBe(51_050);
  });

  it("10%の税率区分（195万円超330万円以下）を計算する", () => {
    // 2,995,000 * 10% - 97,500 = 202,000 → * 1.021 = 206,242
    expect(calcIncomeTax(2_995_000)).toBe(206_242);
  });

  it("20%の税率区分（330万円超695万円以下）を計算する", () => {
    // 3,632,440 * 20% - 427,500 = 298,988 → * 1.021 ≈ 305,267
    expect(calcIncomeTax(3_632_440)).toBe(305_267);
  });

  it("最高税率区分（4,000万円超）を計算する", () => {
    // 50,000,000 * 45% - 4,796,000 = 17,704,000 → * 1.021 = 18,075,784
    expect(calcIncomeTax(50_000_000)).toBe(18_075_784);
  });
});

describe("calcResidentTax", () => {
  it("所得割10% + 均等割5,000円で計算する（非課税限度額を超える場合）", () => {
    expect(calcResidentTax(3_000_000, 3_000_000, 0)).toBe(305_000);
  });

  it("合計所得金額が非課税限度額（単身45万円）以下なら住民税は0円", () => {
    expect(calcResidentTax(0, 450_000, 0)).toBe(0);
    expect(calcResidentTax(0, 0, 0)).toBe(0);
  });

  it("合計所得金額が均等割の非課税限度額は超えるが所得割の非課税限度額以下なら均等割のみ課税される", () => {
    // 扶養1人: 均等割の限度額101万円 < 所得割の限度額122万円
    expect(calcResidentTax(50_000, 1_100_000, 1)).toBe(5_000);
  });

  it("課税所得が0円でも合計所得金額が非課税限度額を超えていれば均等割は課税される", () => {
    expect(calcResidentTax(0, 1_000_000, 0)).toBe(5_000);
  });

  it("扶養人数が増えると非課税限度額も上がる", () => {
    // 扶養1人の非課税限度額（101万円）以下なら住民税は0円
    expect(calcResidentTax(0, 1_000_000, 1)).toBe(0);
  });
});

describe("calcBasicDeduction", () => {
  it("基礎控除は48万円固定", () => {
    expect(calcBasicDeduction()).toBe(480_000);
  });
});

describe("calcDependentDeduction", () => {
  it("扶養人数0人なら控除0円", () => {
    expect(calcDependentDeduction(0)).toBe(0);
  });

  it("扶養人数×38万円で計算する", () => {
    expect(calcDependentDeduction(2)).toBe(760_000);
  });

  it("負の人数は0人として扱う", () => {
    expect(calcDependentDeduction(-1)).toBe(0);
  });
});

describe("calcSalaryDeduction", () => {
  it("162.5万円以下は一律55万円", () => {
    expect(calcSalaryDeduction(1_000_000)).toBe(550_000);
  });

  it("360万円超660万円以下は収入×20%+44万円", () => {
    // 6,000,000 * 20% + 440,000 = 1,640,000
    expect(calcSalaryDeduction(6_000_000)).toBe(1_640_000);
  });

  it("850万円超は上限195万円", () => {
    expect(calcSalaryDeduction(10_000_000)).toBe(1_950_000);
  });
});
