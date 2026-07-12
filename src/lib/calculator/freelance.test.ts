import { describe, expect, it } from "vitest";
import { calcFreelanceTakeHome } from "./freelance";

describe("calcFreelanceTakeHome", () => {
  it("報酬600万円・扶養0人・経費率10%・青色申告・30歳（介護保険対象外）の場合を計算する", () => {
    const result = calcFreelanceTakeHome(6_000_000, 0, 0.1, "blue", 30);

    expect(result.grossIncome).toBe(6_000_000);
    expect(result.expenses).toBe(600_000);
    expect(result.careInsurance).toBe(0);
    expect(result.nationalHealthInsurance).toBe(433_800);
    expect(result.nationalPension).toBe(203_760);
    expect(result.incomeTax).toBe(305_267);
    expect(result.residentTax).toBe(368_244);
    expect(result.takeHomePay).toBe(4_088_929);
  });

  it("白色申告は青色申告特別控除がない分、事業所得が65万円多くなり手取りが減る", () => {
    const blue = calcFreelanceTakeHome(6_000_000, 0, 0.1, "blue", 30);
    const white = calcFreelanceTakeHome(6_000_000, 0, 0.1, "white", 30);
    expect(white.takeHomePay).toBeLessThan(blue.takeHomePay);
  });

  it("40〜64歳は介護分の国民健康保険料が追加でかかる", () => {
    const notEligible = calcFreelanceTakeHome(6_000_000, 0, 0.1, "blue", 39);
    const eligible = calcFreelanceTakeHome(6_000_000, 0, 0.1, "blue", 40);

    expect(eligible.careInsurance).toBeGreaterThan(0);
    expect(notEligible.careInsurance).toBe(0);
    expect(eligible.takeHomePay).toBeLessThan(notEligible.takeHomePay);
  });

  it("経費率が上がると事業所得が減り手取りも下がる", () => {
    const lowExpense = calcFreelanceTakeHome(6_000_000, 0, 0.1, "blue", 30);
    const highExpense = calcFreelanceTakeHome(6_000_000, 0, 0.3, "blue", 30);
    expect(highExpense.expenses).toBe(1_800_000);
    expect(highExpense.takeHomePay).toBeLessThan(lowExpense.takeHomePay);
  });

  it("国民健康保険料（医療分+介護分）は賦課限度額（106万円）で頭打ちになる", () => {
    const result = calcFreelanceTakeHome(100_000_000, 0, 0.1, "blue", 45);
    expect(result.nationalHealthInsurance + result.careInsurance).toBe(1_060_000);
  });

  it("高所得（軽減対象外）では扶養人数が増えると国民健康保険料の均等割が増える", () => {
    const withoutDependents = calcFreelanceTakeHome(6_000_000, 0, 0.1, "blue", 30);
    const withDependents = calcFreelanceTakeHome(6_000_000, 2, 0.1, "blue", 30);
    expect(withDependents.nationalHealthInsurance).toBe(
      withoutDependents.nationalHealthInsurance + 45_000 * 2
    );
  });

  it("事業所得が43万円以下なら国民健康保険料の均等割は7割軽減される", () => {
    // 報酬43万円・経費率0%・青色申告なし相当（白色申告）で事業所得=43万円ちょうど
    const result = calcFreelanceTakeHome(430_000, 0, 0, "white", 30);
    // 均等割45,000円のうち7割軽減 → 3割の13,500円のみ
    expect(result.nationalHealthInsurance).toBe(13_500);
  });

  it("報酬0円でも国民健康保険料の均等割（7割軽減後）・国民年金は定額でかかるが、住民税は非課税になる", () => {
    const result = calcFreelanceTakeHome(0, 0, 0.1, "blue", 30);
    expect(result.incomeTax).toBe(0);
    // 事業所得0円は7割軽減の対象のため、均等割45,000円のうち3割(13,500円)のみ課税
    expect(result.nationalHealthInsurance).toBe(13_500);
    // 国民年金は定額
    expect(result.nationalPension).toBe(203_760);
    // 合計所得金額0円は住民税の非課税限度額以下のため住民税は0円
    expect(result.residentTax).toBe(0);
    expect(result.takeHomePay).toBe(-(13_500 + 203_760));
  });
});
