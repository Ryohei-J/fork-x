import Header from "@/components/Header";
import SimulatorForm from "@/components/SimulatorForm";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-zinc-900">
      <Header />
      <div className="flex flex-1 flex-col items-center px-4 py-6 sm:px-8 sm:py-8">
        <p className="mb-6 w-full max-w-6xl text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-left">
          年収または月の報酬を入力すると、正社員として働いた場合とフリーランスとして働いた場合の手取りを概算で比較できます。
        </p>
        <main className="flex w-full flex-1 justify-center">
          <SimulatorForm />
        </main>
      </div>
    </div>
  );
}
