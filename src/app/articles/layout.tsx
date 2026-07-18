import Header from "@/components/Header";

export default function ArticlesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-zinc-900">
      <Header />
      <div className="flex w-full flex-1 justify-center px-4 py-8 sm:px-8">
        <div className="flex w-full max-w-3xl flex-col gap-6">{children}</div>
      </div>
    </div>
  );
}
