import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <span className="text-5xl block mb-6">🌿</span>

        <p className="font-serif text-[8rem] leading-none font-bold tracking-tight text-[#C07B60]">
          404
        </p>

        <h1 className="font-serif text-2xl font-semibold text-foreground mt-4 mb-3 tracking-tight">
          Página não encontrada
        </h1>

        <p className="text-(--color-foreground-muted) text-base leading-relaxed mb-10 max-w-sm mx-auto">
          Parece que esta flor não existe no nosso jardim.
          <br />
          Que tal voltar e explorar nossas outras fragrâncias?
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-(--color-primary) text-(--color-on-primary) text-sm font-medium px-6 py-3 rounded-full transition-all duration-300 hover:bg-(--color-secondary) hover:-translate-y-0.5"
        >
          ← Voltar à loja
        </Link>
      </div>
    </div>
  );
}
