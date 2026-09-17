import { purposeConfig } from "@/lib/config";

export function PurposePanel() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <section className="min-h-[28rem] rounded-3xl border-2 border-ko-accent bg-white p-8 shadow-sm sm:min-h-[32rem] sm:p-12">
        <h2 className="text-4xl font-bold text-ko-dark sm:text-5xl">
          {purposeConfig.title}
        </h2>

        <ul className="mt-8 space-y-4 text-xl text-ko-dark/80 sm:text-2xl">
          {purposeConfig.bullets.map((bullet, index) => (
            <li key={`purpose-${index}`} className="flex gap-3">
              <span className="mt-2.5 h-2.5 w-2.5 shrink-0 rounded-full bg-ko-accent" />
              <span className="min-h-[1.5em] flex-1">{bullet || "\u00A0"}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
