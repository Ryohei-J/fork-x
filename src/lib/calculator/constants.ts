/**
 * 概算計算用の税率・保険料率の定数。
 * 2024年分（令和6年度）の制度をベースにした概算値。
 * 制度改正があった場合はこのファイルの値を更新する。
 */

// 所得税の速算表（超過累進課税、2015年分以降変更なし）
export const INCOME_TAX_BRACKETS = [
  { max: 1_950_000, rate: 0.05, deduction: 0 },
  { max: 3_300_000, rate: 0.1, deduction: 97_500 },
  { max: 6_950_000, rate: 0.2, deduction: 427_500 },
  { max: 9_000_000, rate: 0.23, deduction: 636_000 },
  { max: 18_000_000, rate: 0.33, deduction: 1_536_000 },
  { max: 40_000_000, rate: 0.4, deduction: 2_796_000 },
  { max: Infinity, rate: 0.45, deduction: 4_796_000 },
] as const;

// 復興特別所得税率（所得税額に対して、2037年分まで）
export const RECONSTRUCTION_SURTAX_RATE = 0.021;

// 住民税
export const RESIDENT_TAX_INCOME_RATE = 0.1; // 所得割（道府県民税+市町村民税、概算で一律10%）
export const RESIDENT_TAX_PER_CAPITA = 5_000; // 均等割（概算の全国平均値）

// 住民税の非課税限度額（1級地基準、全国共通の概算式）。
// 均等割・所得割とも「合計所得金額 ≤ 35万円×(本人+扶養親族数)+10万円」が基本で、
// 扶養親族がいる場合のみ均等割は+21万円、所得割は+42万円をそれぞれ加算する。
export const RESIDENT_TAX_EXEMPTION_BASE_PER_PERSON = 350_000;
export const RESIDENT_TAX_EXEMPTION_FLAT_ADDITION = 100_000;
export const RESIDENT_TAX_EXEMPTION_PER_CAPITA_DEPENDENT_BONUS = 210_000;
export const RESIDENT_TAX_EXEMPTION_INCOME_DEPENDENT_BONUS = 420_000;

// 所得控除
export const BASIC_DEDUCTION = 480_000; // 基礎控除（合計所得2,400万円以下）
export const DEPENDENT_DEDUCTION_PER_PERSON = 380_000; // 扶養控除（一般の控除対象扶養親族、簡略化して一律）

// 給与所得控除の速算表
export const SALARY_DEDUCTION_BRACKETS = [
  { max: 1_625_000, calc: () => 550_000 },
  { max: 1_800_000, calc: (income: number) => income * 0.4 - 100_000 },
  { max: 3_600_000, calc: (income: number) => income * 0.3 + 80_000 },
  { max: 6_600_000, calc: (income: number) => income * 0.2 + 440_000 },
  { max: 8_500_000, calc: (income: number) => income * 0.1 + 1_100_000 },
  { max: Infinity, calc: () => 1_950_000 },
] as const;

// 正社員の社会保険料率（本人負担分、概算）
export const EMPLOYEE_HEALTH_INSURANCE_RATE = 0.05; // 協会けんぽ全国平均を折半した概算
export const EMPLOYEE_PENSION_RATE = 0.0915; // 厚生年金（18.3%の折半分）
export const EMPLOYMENT_INSURANCE_RATE = 0.006; // 雇用保険（一般の事業、労働者負担分）。月給・賞与を区別せず総額に一律で課される

// 年収を「月給」と「賞与」に分解する際の仮定。
// 賞与を年4ヶ月分・年2回（夏季・冬季）支給と仮定する一般的なモデルケースを採用（月給12ヶ月+賞与4ヶ月=16ヶ月分で年収を割る）。
// 実際の月給・賞与の内訳を入力させるとMVPの入力項目が増えすぎるため、この仮定で健康保険・厚生年金の上限判定の精度のみ上げる。
export const ANNUAL_BONUS_MONTHS = 4;
export const BONUS_PAYMENTS_PER_YEAR = 2;

// 健康保険・厚生年金は「標準報酬月額」と「標準賞与額」で別々に上限が定められている
export const EMPLOYEE_HEALTH_INSURANCE_MONTHLY_CAP = 1_390_000; // 標準報酬月額の上限（協会けんぽ、最高等級）
export const EMPLOYEE_HEALTH_INSURANCE_BONUS_ANNUAL_CAP = 5_730_000; // 標準賞与額の年度累計上限
export const EMPLOYEE_PENSION_MONTHLY_CAP = 650_000; // 標準報酬月額の上限（厚生年金、最高等級）
export const EMPLOYEE_PENSION_BONUS_PAYMENT_CAP = 1_500_000; // 標準賞与額の1回あたりの上限（厚生年金）

// 介護保険料（40〜64歳が対象、本人負担分、概算）
export const CARE_INSURANCE_MIN_AGE = 40;
export const CARE_INSURANCE_MAX_AGE = 64;
export const EMPLOYEE_CARE_INSURANCE_RATE = 0.0091; // 協会けんぽ全国平均を折半した概算
export const NATIONAL_HEALTH_INSURANCE_CARE_INCOME_RATE = 0.02; // 介護分の所得割（概算）
export const NATIONAL_HEALTH_INSURANCE_CARE_PER_CAPITA = 16_000; // 介護分の均等割（概算）

// フリーランスの経費率（初期値。ユーザーが入力で上書きできる）
export const DEFAULT_FREELANCE_EXPENSE_RATE = 0.1;

// 確定申告の控除額（青色申告はe-Taxでの電子申告を前提とした満額、白色申告は特別控除なし）
export const BLUE_RETURN_DEDUCTION = 650_000;
export const WHITE_RETURN_DEDUCTION = 0;

// 国民健康保険料（全国平均レートによる概算。自治体ごとの差は反映しない）
export const NATIONAL_HEALTH_INSURANCE_INCOME_RATE = 0.09; // 所得割
export const NATIONAL_HEALTH_INSURANCE_PER_CAPITA = 45_000; // 均等割（1人あたり）
export const NATIONAL_HEALTH_INSURANCE_BASIC_DEDUCTION = 430_000; // 所得割算定時の基礎控除相当額
export const NATIONAL_HEALTH_INSURANCE_CAP = 1_060_000; // 賦課限度額（令和6年度、介護分込み）

// 国民健康保険料・均等割の軽減判定（全国共通の基準額。7割/5割/2割軽減）
export const NATIONAL_HEALTH_INSURANCE_REDUCTION_BASE = 430_000; // 43万円
export const NATIONAL_HEALTH_INSURANCE_REDUCTION_50_PER_PERSON = 295_000; // 29.5万円×世帯人数
export const NATIONAL_HEALTH_INSURANCE_REDUCTION_20_PER_PERSON = 545_000; // 54.5万円×世帯人数

// 国民年金保険料（定額、本人分のみ）
export const NATIONAL_PENSION_MONTHLY = 16_980;
export const NATIONAL_PENSION_ANNUAL = NATIONAL_PENSION_MONTHLY * 12;
