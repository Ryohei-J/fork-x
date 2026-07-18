export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
};

export const ARTICLES: ArticleMeta[] = [
  {
    slug: "blue-return-vs-white-return",
    title: "青色申告と白色申告、フリーランスエンジニアはどちらを選ぶべきか",
    description:
      "65万円の特別控除がある青色申告と、手続きが簡単な白色申告の違いを解説。手取りへの影響をシミュレーションで確認する方法も紹介します。",
    publishedAt: "2026-07-19",
  },
  {
    slug: "freelance-national-health-insurance",
    title: "フリーランスの国民健康保険料はいくら？計算の仕組みと軽減措置",
    description:
      "正社員の健康保険と違い全額自己負担になる国民健康保険料。所得割・均等割の計算方法と、低所得世帯向けの軽減措置について解説します。",
    publishedAt: "2026-07-19",
  },
  {
    slug: "resident-tax-freelance-first-year",
    title: "住民税はいつ・いくら払う？フリーランス1年目に手取りが減る理由",
    description:
      "住民税は前年の所得をもとに翌年課税される「後払い」の仕組みです。独立1年目に思ったより手取りが減ると感じやすい理由と、納税のタイミングを解説します。",
    publishedAt: "2026-07-19",
  },
  {
    slug: "case-study-annual-income-500",
    title: "年収500万円のWebエンジニアが独立したら手取りはどうなる？",
    description:
      "額面年収500万円を前提に、正社員とフリーランス（青色申告・経費率10%）で手取りがいくら変わるかを実際の計算ロジックでシミュレーションします。",
    publishedAt: "2026-07-19",
  },
  {
    slug: "case-study-annual-income-800",
    title: "年収800万円のWebエンジニアが独立したら手取りはどうなる？",
    description:
      "額面年収800万円を前提に、正社員とフリーランス（青色申告・経費率10%）で手取りがいくら変わるかを実際の計算ロジックでシミュレーションします。",
    publishedAt: "2026-07-19",
  },
];
