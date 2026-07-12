"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { simulate } from "@/lib/calculator";
import { DEFAULT_FREELANCE_EXPENSE_RATE } from "@/lib/calculator/constants";
import type { IncomeInputMode, SimulatorInput, TaxFilingType } from "@/lib/calculator/types";
import { validateInput } from "@/lib/calculator/validation";
import { formatYen } from "@/lib/format";
import { PREFECTURES } from "@/lib/prefectures";

const STORAGE_KEY = "fork-x:simulator-input";

const INPUT_CLASS_NAME =
  "w-full rounded-lg border border-black/[.08] bg-transparent px-3 py-2 text-base outline-none transition-colors focus:border-accent-500 focus:ring-2 focus:ring-accent-500/30 dark:border-white/[.145]";

const DEFAULT_INPUT: SimulatorInput = {
  employeeAmount: 6_000_000,
  employeeMode: "annual",
  freelanceAmount: 6_000_000,
  freelanceMode: "annual",
  prefecture: "東京都",
  dependents: 0,
  expenseRate: DEFAULT_FREELANCE_EXPENSE_RATE,
  taxFilingType: "blue",
  age: 30,
};

let storedInputCache: SimulatorInput | undefined;

// localStorage の読み取りはSSR時にできないため、useSyncExternalStore で
// サーバー/クライアントの初回描画は常に DEFAULT_INPUT を返し、
// マウント後に実際の保存値へ差し替える（ハイドレーション不一致を避けるため）
function readStoredInput(): SimulatorInput {
  if (storedInputCache) return storedInputCache;
  const raw = localStorage.getItem(STORAGE_KEY);
  let result = DEFAULT_INPUT;
  if (raw) {
    try {
      result = { ...DEFAULT_INPUT, ...JSON.parse(raw) };
    } catch {
      result = DEFAULT_INPUT;
    }
  }
  storedInputCache = result;
  return result;
}

function subscribeNoop() {
  return () => {};
}

function getServerSnapshot() {
  return DEFAULT_INPUT;
}

export default function SimulatorForm() {
  const storedInput = useSyncExternalStore(subscribeNoop, readStoredInput, getServerSnapshot);
  const [input, setInput] = useState<SimulatorInput>(DEFAULT_INPUT);

  // input がまだ初期値のままで、保存済みデータが読み込まれたら一度だけ反映する。
  // （input は同期後・ユーザー編集後は必ず新しいオブジェクト参照になるため、以後この条件は成立しない）
  if (input === DEFAULT_INPUT && storedInput !== DEFAULT_INPUT) {
    setInput(storedInput);
  }

  useEffect(() => {
    storedInputCache = input;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(input));
  }, [input]);

  const errors = validateInput(input);
  const hasErrors = Object.keys(errors).length > 0;
  const result = hasErrors ? null : simulate(input);

  return (
    <div className="flex w-full max-w-4xl flex-col gap-8">
      <section className="flex flex-col gap-4 rounded-2xl border border-black/[.08] bg-white p-6 dark:border-white/[.145] dark:bg-zinc-950">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              正社員の入力単位
            </label>
            <ModeToggle
              value={input.employeeMode}
              onChange={(employeeMode) => setInput((prev) => ({ ...prev, employeeMode }))}
              annualLabel="年収"
              monthlyLabel="月給"
            />
            <label
              htmlFor="employeeAmount"
              className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              正社員の{input.employeeMode === "annual" ? "年収" : "月給"}（額面）
            </label>
            <div className="flex items-center gap-2">
              <input
                id="employeeAmount"
                type="number"
                min={0}
                step={1}
                value={input.employeeAmount / 10_000}
                onChange={(e) =>
                  setInput((prev) => ({
                    ...prev,
                    employeeAmount: Number(e.target.value) * 10_000,
                  }))
                }
                className={INPUT_CLASS_NAME}
              />
              <span className="text-sm text-zinc-500">万円</span>
            </div>
            <FieldError message={errors.employeeAmount} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              フリーランスの入力単位
            </label>
            <ModeToggle
              value={input.freelanceMode}
              onChange={(freelanceMode) => setInput((prev) => ({ ...prev, freelanceMode }))}
              annualLabel="年間報酬"
              monthlyLabel="月額報酬"
            />
            <label
              htmlFor="freelanceAmount"
              className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              フリーランスの{input.freelanceMode === "annual" ? "報酬（年間）" : "報酬（月額）"}
            </label>
            <div className="flex items-center gap-2">
              <input
                id="freelanceAmount"
                type="number"
                min={0}
                step={1}
                value={input.freelanceAmount / 10_000}
                onChange={(e) =>
                  setInput((prev) => ({
                    ...prev,
                    freelanceAmount: Number(e.target.value) * 10_000,
                  }))
                }
                className={INPUT_CLASS_NAME}
              />
              <span className="text-sm text-zinc-500">万円</span>
            </div>
            <FieldError message={errors.freelanceAmount} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="expenseRate" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            フリーランスの必要経費率（報酬に対する割合）
          </label>
          <div className="flex items-center gap-2">
            <input
              id="expenseRate"
              type="number"
              min={0}
              max={100}
              step={1}
              value={Math.round(input.expenseRate * 100)}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, expenseRate: Number(e.target.value) / 100 }))
              }
              className={INPUT_CLASS_NAME}
            />
            <span className="text-sm text-zinc-500">%</span>
          </div>
          <FieldError message={errors.expenseRate} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            フリーランスの確定申告方式
          </label>
          <div className="flex gap-2">
            {(["blue", "white"] as TaxFilingType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setInput((prev) => ({ ...prev, taxFilingType: type }))}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  input.taxFilingType === type
                    ? "bg-accent-600 text-white dark:bg-accent-500"
                    : "border border-black/[.08] text-zinc-600 hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-400 dark:hover:bg-white/[.06]"
                }`}
              >
                {type === "blue" ? "青色申告（65万円控除）" : "白色申告（控除なし）"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="prefecture" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              居住地（都道府県）
            </label>
            <select
              id="prefecture"
              value={input.prefecture}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, prefecture: e.target.value }))
              }
              className={INPUT_CLASS_NAME}
            >
              {PREFECTURES.map((pref) => (
                <option key={pref} value={pref}>
                  {pref}
                </option>
              ))}
            </select>
            <p className="text-xs text-zinc-500">
              ※ 現在は計算に反映しておらず、参考表示のみです
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="dependents" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              扶養人数
            </label>
            <input
              id="dependents"
              type="number"
              min={0}
              step={1}
              value={input.dependents}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, dependents: Number(e.target.value) }))
              }
              className={INPUT_CLASS_NAME}
            />
            <FieldError message={errors.dependents} />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="age" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              年齢
            </label>
            <input
              id="age"
              type="number"
              min={0}
              step={1}
              value={input.age}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, age: Number(e.target.value) }))
              }
              className={INPUT_CLASS_NAME}
            />
            <p className="text-xs text-zinc-500">
              ※ 40〜64歳は介護保険料の対象として計算します
            </p>
            <FieldError message={errors.age} />
          </div>
        </div>
      </section>

      {result ? (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ResultCard title="正社員の場合">
              <BreakdownRow label="額面年収" value={result.employee.grossIncome} />
              <BreakdownRow label="健康保険料" value={-result.employee.healthInsurance} />
              {result.employee.careInsurance > 0 && (
                <BreakdownRow label="介護保険料" value={-result.employee.careInsurance} />
              )}
              <BreakdownRow label="厚生年金保険料" value={-result.employee.employeePension} />
              <BreakdownRow label="雇用保険料" value={-result.employee.employmentInsurance} />
              <BreakdownRow label="所得税" value={-result.employee.incomeTax} />
              <BreakdownRow label="住民税" value={-result.employee.residentTax} />
              <TakeHomeRow value={result.employee.takeHomePay} />
            </ResultCard>

            <ResultCard title="フリーランスの場合">
              <BreakdownRow label="報酬総額" value={result.freelance.grossIncome} />
              <BreakdownRow
                label={`必要経費（経費率${Math.round(input.expenseRate * 100)}%）`}
                value={-result.freelance.expenses}
              />
              <BreakdownRow label="国民健康保険料" value={-result.freelance.nationalHealthInsurance} />
              {result.freelance.careInsurance > 0 && (
                <BreakdownRow label="介護分保険料" value={-result.freelance.careInsurance} />
              )}
              <BreakdownRow label="国民年金保険料" value={-result.freelance.nationalPension} />
              <BreakdownRow label="所得税" value={-result.freelance.incomeTax} />
              <BreakdownRow label="住民税" value={-result.freelance.residentTax} />
              <TakeHomeRow value={result.freelance.takeHomePay} />
            </ResultCard>
          </section>

          <section className="rounded-2xl border border-black/[.08] bg-white p-6 text-center dark:border-white/[.145] dark:bg-zinc-950">
            <DiffSummary
              employeeTakeHome={result.employee.takeHomePay}
              freelanceTakeHome={result.freelance.takeHomePay}
            />
          </section>
        </>
      ) : (
        <section className="rounded-2xl border border-rose-300 bg-rose-50 p-6 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          入力内容にエラーがあります。上記の項目を確認してください。
        </section>
      )}

      <section className="rounded-2xl border border-black/[.08] bg-white p-6 dark:border-white/[.145] dark:bg-zinc-950">
        <h2 className="text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          この試算の前提条件
        </h2>
        <ul className="mt-3 flex flex-col gap-1.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
          <li>・フリーランスの必要経費率: {Math.round(input.expenseRate * 100)}%（入力で変更可能）</li>
          <li>
            ・フリーランスの確定申告方式:{" "}
            {input.taxFilingType === "blue" ? "青色申告（65万円控除）" : "白色申告（控除なし）"}
            （入力で変更可能）
          </li>
          <li>・社会保険料は全国平均レートによる概算。健康保険料率や国民健康保険料は都道府県・自治体ごとの実際の差を反映していません</li>
          <li>・居住地（都道府県）は現在参考表示のみで、計算には反映されません</li>
          <li>・個人事業税・消費税は未算入（免税事業者を前提）</li>
          <li>・介護保険料は40〜64歳のみ加算（年齢による他の控除の違いは未対応）</li>
          <li>
            ・住民税の非課税措置、国民健康保険料の均等割軽減（7割・5割・2割）は全国共通の基準額で概算反映していますが、実際の判定はより複雑です
          </li>
          <li>
            ・正社員の健康保険料・厚生年金保険料は、年収を「月給12ヶ月分+賞与4ヶ月分（年2回）」という一般的な比率で分解したうえで、それぞれの上限（標準報酬月額・標準賞与額）を反映しています
          </li>
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-zinc-500">
          ※ 本ツールの計算結果はあくまで概算です。正確な金額は税理士や自治体窓口にご確認ください。
        </p>
      </section>
    </div>
  );
}

function ModeToggle({
  value,
  onChange,
  annualLabel,
  monthlyLabel,
}: {
  value: IncomeInputMode;
  onChange: (mode: IncomeInputMode) => void;
  annualLabel: string;
  monthlyLabel: string;
}) {
  return (
    <div className="flex gap-2">
      {(["annual", "monthly"] as IncomeInputMode[]).map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => onChange(mode)}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
            value === mode
              ? "bg-accent-600 text-white dark:bg-accent-500"
              : "border border-black/[.08] text-zinc-600 hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-400 dark:hover:bg-white/[.06]"
          }`}
        >
          {mode === "annual" ? annualLabel : monthlyLabel}
        </button>
      ))}
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-rose-600 dark:text-rose-400">{message}</p>;
}

function DiffSummary({
  employeeTakeHome,
  freelanceTakeHome,
}: {
  employeeTakeHome: number;
  freelanceTakeHome: number;
}) {
  const diff = freelanceTakeHome - employeeTakeHome;

  if (diff === 0) {
    return (
      <p className="text-base text-zinc-700 dark:text-zinc-300">
        正社員とフリーランスの手取りは同額です
      </p>
    );
  }

  const higher = diff > 0 ? "フリーランス" : "正社員";
  const lower = diff > 0 ? "正社員" : "フリーランス";

  return (
    <p className="text-base text-zinc-700 dark:text-zinc-300">
      {higher}の方が{lower}より{" "}
      <strong className="text-3xl font-bold tracking-tight text-accent-600 dark:text-accent-400">
        {formatYen(Math.abs(diff))}
      </strong>{" "}
      多い
    </p>
  );
}

function ResultCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-black/[.08] bg-white p-6 dark:border-white/[.145] dark:bg-zinc-950">
      <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        <span className="h-2.5 w-2.5 rounded-full bg-accent-500" aria-hidden="true" />
        {title}
      </h2>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}

function BreakdownRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="font-medium tabular-nums text-zinc-800 dark:text-zinc-200">
        {value >= 0 ? "" : "−"}
        {formatYen(Math.abs(value))}
      </span>
    </div>
  );
}

function TakeHomeRow({ value }: { value: number }) {
  return (
    <div className="mt-3 flex items-center justify-between border-t-2 border-accent-100 pt-3 dark:border-accent-900">
      <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">手取り</span>
      <span className="text-xl font-bold tabular-nums text-accent-700 dark:text-accent-400">
        {formatYen(value)}
      </span>
    </div>
  );
}
