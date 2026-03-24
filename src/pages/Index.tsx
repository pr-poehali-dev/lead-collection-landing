import { useState } from "react";
import Icon from "@/components/ui/icon";

const Index = () => {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("https://functions.poehali.dev/eb3c9f40-140e-4354-860a-3748e547f86a", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", phone: "", email: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#080B12] font-golos overflow-hidden relative">

      {/* Фоновые декоры */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[#39FF5A]/10 blur-[120px]" />
        <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] rounded-full bg-[#FF2D78]/10 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-[#00C8FF]/8 blur-[100px]" />
        {/* Сетка */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">

        {/* Бейдж */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#39FF5A]/30 bg-[#39FF5A]/5 text-[#39FF5A] text-sm font-medium mb-8 opacity-0 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="w-2 h-2 rounded-full bg-[#39FF5A] animate-pulse" />
          Принимаем заявки
        </div>

        {/* Главный заголовок */}
        <h1
          className="font-oswald font-bold uppercase text-white leading-none mb-6 opacity-0 animate-fade-in"
          style={{
            fontSize: "clamp(2.8rem, 8vw, 7rem)",
            letterSpacing: "-0.02em",
            animationDelay: "0.2s",
          }}
        >
          Оставьте{" "}
          <span
            className="relative inline-block"
            style={{
              background: "linear-gradient(135deg, #39FF5A 0%, #00C8FF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            заявку
          </span>
          <br />
          прямо сейчас
        </h1>

        {/* Подзаголовок */}
        <p
          className="text-white/50 text-lg md:text-xl max-w-xl mb-14 leading-relaxed opacity-0 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          Заполните форму — мы свяжемся с вами в течение часа и ответим на все вопросы
        </p>

        {/* Карточка формы */}
        <div
          className="w-full max-w-md opacity-0 animate-scale-in"
          style={{ animationDelay: "0.6s" }}
        >
          <div
            className="rounded-2xl p-[1px]"
            style={{
              background: "linear-gradient(135deg, rgba(57,255,90,0.4) 0%, rgba(0,200,255,0.2) 50%, rgba(255,45,120,0.2) 100%)",
            }}
          >
            <div className="bg-[#0D1220]/90 backdrop-blur-xl rounded-2xl p-8">

              {status === "success" ? (
                <div className="flex flex-col items-center gap-4 py-6 text-center animate-scale-in">
                  <div className="w-16 h-16 rounded-full bg-[#39FF5A]/15 flex items-center justify-center animate-glow-pulse">
                    <Icon name="CheckCircle" size={36} className="text-[#39FF5A]" />
                  </div>
                  <h3 className="text-white text-xl font-semibold font-oswald uppercase tracking-wide">
                    Заявка принята!
                  </h3>
                  <p className="text-white/50 text-sm">
                    Мы уже получили вашу заявку и скоро свяжемся с вами
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-2 text-[#39FF5A] text-sm underline underline-offset-4 hover:text-[#39FF5A]/70 transition-colors"
                  >
                    Отправить ещё одну
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <h2 className="font-oswald font-semibold uppercase text-white text-2xl tracking-wide mb-2 text-left">
                    Ваши данные
                  </h2>

                  {/* Поле: Имя */}
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#39FF5A] transition-colors">
                      <Icon name="User" size={16} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ваше имя"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-white/30 text-sm outline-none focus:border-[#39FF5A]/50 focus:bg-white/8 transition-all"
                    />
                  </div>

                  {/* Поле: Телефон */}
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#39FF5A] transition-colors">
                      <Icon name="Phone" size={16} />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+7 (___) ___-__-__"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-white/30 text-sm outline-none focus:border-[#39FF5A]/50 focus:bg-white/8 transition-all"
                    />
                  </div>

                  {/* Поле: Email */}
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#39FF5A] transition-colors">
                      <Icon name="Mail" size={16} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-white/30 text-sm outline-none focus:border-[#39FF5A]/50 focus:bg-white/8 transition-all"
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-[#FF2D78] text-xs flex items-center gap-1.5">
                      <Icon name="AlertCircle" size={14} />
                      Ошибка отправки. Попробуйте ещё раз.
                    </p>
                  )}

                  {/* Кнопка */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="relative mt-2 w-full rounded-xl py-4 font-oswald font-semibold uppercase tracking-widest text-sm transition-all overflow-hidden group"
                    style={{
                      background: "linear-gradient(135deg, #39FF5A 0%, #00C8FF 100%)",
                      color: "#080B12",
                    }}
                  >
                    <span className="absolute inset-0 bg-white/0 group-hover:bg-white/15 transition-colors duration-200" />
                    {status === "loading" ? (
                      <span className="flex items-center justify-center gap-2">
                        <Icon name="Loader2" size={16} className="animate-spin" />
                        Отправляем...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Отправить заявку
                        <Icon name="ArrowRight" size={16} />
                      </span>
                    )}
                  </button>

                  <p className="text-white/20 text-xs text-center leading-relaxed">
                    Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Доверие */}
        <div
          className="flex items-center gap-6 mt-10 opacity-0 animate-fade-in"
          style={{ animationDelay: "0.9s" }}
        >
          {[
            { icon: "ShieldCheck", text: "Безопасно" },
            { icon: "Clock", text: "Ответ за 1 час" },
            { icon: "Star", text: "Бесплатно" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 text-white/35 text-xs">
              <Icon name={icon as "Star"} size={14} className="text-[#39FF5A]/60" />
              {text}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;