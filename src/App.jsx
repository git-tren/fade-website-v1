import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, ArrowRight, MousePointerClick, Terminal, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ----------------------------------------------------
// NAVBAR COMPONENT
// ----------------------------------------------------
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav ref={navRef} className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-[90%] max-w-6xl transition-all duration-500 rounded-[2rem] px-6 py-4 flex items-center justify-between ${scrolled ? 'bg-primary/90 backdrop-blur-xl border border-white/5 shadow-2xl' : 'bg-transparent'}`}>
        <div className="flex items-center gap-3">
          <img src="/public/images/LOGO-FADE-BEGE.svg" alt="FADE & CO." className="h-5 md:h-6 object-contain" />
        </div>

        {/* Desktop Links - Inter Regular(400) ou Medium(500) para base de UI */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <a href="#home" className="hover:-translate-y-0.5 transition-transform opacity-80 hover:opacity-100">Home</a>
          <a href="#sobre" className="hover:-translate-y-0.5 transition-transform opacity-80 hover:opacity-100">Sobre</a>
          <a href="#projetos" className="hover:-translate-y-0.5 transition-transform opacity-80 hover:opacity-100">Projetos</a>
        </div>

        {/* Cta & Mobile Toggle */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Botão primário - Inter Medium(500) */}
          <button onClick={scrollToContact} className="flex items-center gap-1.5 md:gap-2 bg-textMain text-primary px-5 md:px-6 py-2 rounded-full font-medium text-xs md:text-sm btn-magnetic">
            Fale conosco <ArrowRight size={14} className="md:w-4 md:h-4" />
          </button>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden flex items-center justify-center p-2 rounded-full bg-surface text-textMain border border-white/10 btn-magnetic z-50">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-primary z-40 transition-transform duration-500 flex flex-col items-center justify-center gap-8 ${mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <a href="#home" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-medium tracking-tight text-textMain">Home</a>
        <a href="#sobre" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-medium tracking-tight text-textMain">Sobre</a>
        <a href="#projetos" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-medium tracking-tight text-textMain">Projetos</a>
        <button onClick={scrollToContact} className="mt-8 flex items-center gap-2 bg-textMain text-primary px-8 py-4 rounded-full font-medium text-xl btn-magnetic">
          Fale conosco <ArrowRight size={24} />
        </button>
      </div>
    </>
  );
};

import AsciiParticleCloud from './AsciiParticleCloud';

// ----------------------------------------------------
// HERO SECTION
// ----------------------------------------------------
const HeroSection = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-text',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="home" ref={containerRef} className="relative h-[100dvh] w-full flex items-end pb-12 md:pb-24 px-6 md:px-12 pt-32 overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
        <AsciiParticleCloud />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent pointer-events-none"></div>
      </div>

      {/* Retirado o w-full max-w-6xl massivo com flex-1 imenso, usando algo mais conciso em bottom-left clean layout */}
      <div className="relative z-10 w-full mx-auto max-w-7xl flex flex-col md:flex-row md:items-end justify-between gap-8 pointer-events-none">
        <div className="flex-1 max-w-xl pointer-events-auto">
          <h1 className="flex flex-col">
            {/* Subtítulo: Inter SemiBold (600) reduzido */}
            <span className="hero-text text-xs md:text-sm font-semibold tracking-widest text-[#B0B0B0] mb-2 uppercase">Da intenção ao resultado.</span>
            {/* Título: Inter Bold (700) enxugado */}
            <span className="hero-text text-5xl md:text-7xl leading-[1] font-bold tracking-tighter text-textMain">Posicionamento.</span>
          </h1>
          {/* Parágrafo longo: reduzido o max-w e text size para respiro */}
          <p className="hero-text text-sm md:text-base max-w-md leading-relaxed opacity-60 mt-4 font-normal">
            Estratégia, design e direção criativa para transformar ideias em marcas que posicionam e convertem. Nossa metodologia traduz sua essência em presença sólida.
          </p>
        </div>

        {/* Call to action em texto minimalista na extremidade oposta */}
        <div className="hero-text pb-1 md:pb-2 pointer-events-auto flex items-end">
          <button onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs md:text-sm tracking-widest uppercase hover:text-white/60 transition-colors border-b border-white/20 pb-1 flex items-center gap-2">
            Iniciar Projeto ↘
          </button>
        </div>
      </div>
    </section>
  );
};

// ----------------------------------------------------
// FEATURES SECTION
// ----------------------------------------------------
const ShufflerCard = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = ["Posicionamento", "Diagnóstico", "Identidade"];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % items.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <div className="bg-surface border border-white/5 p-8 md:p-10 rounded-[2rem] shadow-2xl flex flex-col justify-between h-[380px] relative overflow-hidden group">
      <div>
        <div className="text-[10px] md:text-xs uppercase tracking-widest opacity-50 mb-4 font-semibold">Lógica de Base</div>
        <h3 className="text-xl md:text-2xl font-semibold mb-3 tracking-tight">Diagnóstico Estratégico</h3>
        <p className="text-sm md:text-base opacity-70 leading-relaxed font-normal">
          A gente organiza antes de criar, estruturando a base da marca pra tudo fazer sentido, do posicionamento à execução.
        </p>
      </div>
      <div className="relative h-20 w-full mt-8 perspective-1000">
        {items.map((item, i) => {
          const isActive = i === activeIndex;
          const isNext = i === (activeIndex + 1) % items.length;
          return (
            <div
              key={item}
              className={`absolute inset-x-0 w-full py-3.5 px-5 rounded-xl text-center font-medium text-sm md:text-base border transition-all duration-700 ease-out flex items-center justify-between
                ${isActive ? 'opacity-100 translate-y-0 z-20 bg-textMain text-primary border-transparent shadow-lg' :
                  isNext ? 'opacity-40 translate-y-4 scale-95 z-10 bg-black border-white/10 text-white shadow-none' :
                    'opacity-0 -translate-y-8 scale-90 z-0 bg-black text-white'}`}
            >
              <span className="opacity-50 text-xs">0{i + 1}</span>
              <span>{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TypewriterCard = () => {
  const textToType = "Processo claro, sem improviso, cada etapa tem intenção e você entende como a marca evolui e se aplica.";
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let isMounted = true;
    let current = "";
    let i = 0;
    let timeoutId;

    const type = () => {
      if (!isMounted) return;
      if (i < textToType.length) {
        current += textToType.charAt(i);
        setTyped(current);
        i++;
        timeoutId = setTimeout(type, Math.random() * 50 + 30);
      } else {
        timeoutId = setTimeout(() => {
          if (isMounted) { i = 0; current = ""; setTyped(""); type(); }
        }, 5000);
      }
    };
    timeoutId = setTimeout(type, 1000);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="bg-surface border border-white/5 p-8 md:p-10 rounded-[2rem] shadow-2xl flex flex-col justify-between h-[380px]">
      <div>
        <div className="flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-widest mb-4 font-semibold text-[#E63B2E]">
          <span className="w-2 h-2 rounded-full bg-[#E63B2E] animate-pulse"></span> Live Feed
        </div>
        <h3 className="text-xl md:text-2xl font-semibold mb-3 tracking-tight">Design e Posicionamento</h3>
      </div>
      <div className="bg-[#050505] p-6 rounded-2xl border border-white/10 h-40 text-sm font-mono text-[#E4E0D5] leading-relaxed overflow-hidden relative">
        <Terminal size={16} className="opacity-30 absolute top-4 right-4" />
        {typed}
        <span className="inline-block w-1.5 h-3 bg-textMain ml-1 animate-pulse align-middle"></span>
      </div>
    </div>
  );
};

const ConversionCard = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Uma timeline infinita de gráficos de tráfego escalando em performance e lucros (ROAS)
      const tl = gsap.timeline({ repeat: -1 });

      tl.to('.bar-1', { height: '35%', duration: 1.2, ease: 'power2.out' })
        .to('.bar-2', { height: '60%', duration: 1, ease: 'power2.out' }, '-=0.8')
        .to('.bar-3', { height: '90%', duration: 1.5, ease: 'elastic.out(1, 0.7)' }, '-=0.5')
        .to('.roas-tag', { opacity: 1, y: 0, duration: 0.3 }, '-=1')
        .to('.scan-line', { top: '100%', duration: 2.5, ease: 'linear' }, 0)
        .to('.scan-line', { opacity: 0, duration: 0.2 })
        .to({}, { duration: 1.5 }) // Pausa o ciclo de admiração
        // Reset liso
        .to(['.bar-1', '.bar-2', '.bar-3'], { height: '5%', duration: 0.8, ease: 'power2.inOut' })
        .to('.roas-tag', { opacity: 0, y: 10, duration: 0.3 }, '<')
        .set('.scan-line', { top: '0%', opacity: 1 });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-surface border border-white/5 p-8 md:p-10 rounded-[2rem] shadow-2xl flex flex-col justify-between h-[380px] relative overflow-hidden group">
      <div>
        <div className="flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-widest opacity-50 mb-4 font-semibold text-[#50E3C2]">
          Scale & Performance
        </div>
        <h3 className="text-xl md:text-2xl font-semibold mb-3 tracking-tight">Tráfego e Conversão</h3>
        <p className="text-sm md:text-base opacity-70 leading-relaxed font-normal">
          Gestão de tráfego embasada em precisão. Aliviamos a verba cega e convertemos dados em aquisição de clientes altamente qualificados.
        </p>
      </div>

      <div className="w-full h-32 mt-6 relative flex items-end justify-between px-2 gap-3 border-b border-white/10 pb-0 pt-6">
        {/* Linha de "Scanner" do algorítimo lendo métricas */}
        <div className="scan-line absolute left-0 w-full h-[1px] bg-white/20 shadow-[0_0_8px_rgba(255,255,255,0.4)] z-20"></div>

        {/* Gráfico 1 - Impressões */}
        <div className="w-1/3 bg-[#0A0A0A] rounded-t-lg h-full flex items-end relative overflow-hidden">
          <div className="bar-1 w-full bg-white/10 rounded-t-lg h-[5%]"></div>
          <span className="absolute bottom-1 w-full text-center text-white/30 text-[9px] font-mono">IMP</span>
        </div>

        {/* Gráfico 2 - Cliques/Leads */}
        <div className="w-1/3 bg-[#0A0A0A] rounded-t-lg h-full flex items-end relative overflow-hidden">
          <div className="bar-2 w-full bg-white/30 rounded-t-lg h-[5%]"></div>
          <span className="absolute bottom-1 w-full text-center text-white/50 text-[9px] font-mono">CTR</span>
        </div>

        {/* Gráfico 3 - Conversão e ROAS */}
        <div className="w-1/3 bg-[#0A0A0A] rounded-t-lg h-full flex items-end relative overflow-hidden border border-white/5 border-b-0 shadow-[0_0_15px_rgba(250,246,223,0.05)]">
          <div className="bar-3 w-full bg-textMain rounded-t-lg h-[5%] relative flex justify-center items-start pt-3 shadow-[0_-5px_15px_rgba(250,246,223,0.2)]">
            <span className="roas-tag opacity-0 translate-y-3 bg-[#050505] text-textMain px-2 py-0.5 rounded border border-textMain/20 text-[9px] font-bold font-mono tracking-wider">
              +ROAS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <section id="sobre" className="py-24 px-6 md:px-12 w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <ShufflerCard />
        <TypewriterCard />
        <ConversionCard />
      </div>
    </section>
  );
}

// ----------------------------------------------------
// PHILOSOPHY SECTION
// ----------------------------------------------------
// Reformulação da "Philosophy" para a "Combinação 3". H1 e H2 bem estruturados e impactantes sem serifa (para brilhar em clean e tech).
const PhilosophySection = () => {
  const pRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.phil-text',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: {
            trigger: pRef.current,
            start: 'top 70%',
          }
        }
      );
    }, pRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={pRef} className="py-32 px-6 md:px-12 w-full bg-[#050505] relative overflow-hidden my-12 border-y border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col gap-10 relative z-10">
        <p className="phil-text text-base md:text-lg font-medium opacity-60 uppercase tracking-widest text-[#B0B0B0]">
          A maioria da indústria foca em estética superficial e improviso.
        </p>
        <h2 className="phil-text text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-snug tracking-tight">
          Nós focamos em <br />
          <span className="text-accent">execução estruturada e conversão</span>.
        </h2>
      </div>
    </section>
  );
};

// ----------------------------------------------------
// PROTOCOL SECTION (Sticky)
// ----------------------------------------------------
const ProtocolSection = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.protocol-card');
      if (cards.length > 0) {
        cards.forEach((card, i) => {
          if (i === cards.length - 1) return; // O último não pinna, ele varre os anteriores
          ScrollTrigger.create({
            trigger: card,
            start: 'top top+=100',
            endTrigger: '.protocol-wrapper',
            end: 'bottom bottom', // Mantém o pin até a base da wrapper se igualar à tela inferior (quando encostar o Footer)
            pin: true,
            pinSpacing: false,
            animation: gsap.to(card, {
              scale: 0.9,
              opacity: 0.4,
              filter: 'blur(10px)',
              ease: "none"
            }),
            scrub: true
          });
        });
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const protocols = [
    { num: '01', title: 'Imersão & Diagnóstico', desc: 'Entendemos o negócio para estruturar a base da marca, sem atalhos e sempre priorizando clareza. Você saberá exatamente como pretendemos atuar sobre as suas restrições e qual o caminho seguro para chegar lá.' },
    { num: '02', title: 'Design de Sistema', desc: 'Sistematizamos o visual para que ele posicione a sua marca. Não acreditamos em visuais que só se comunicam superficialmente; eles precisam servir tecnicamente em seu posicionamento digital em todos os pontos de contato.' },
    { num: '03', title: 'Performance e Escala', desc: 'Garantimos que a execução metodológica performa e converte com alta qualidade visual. Escalar suas vendas sempre será o principal critério validativo no nosso final product.' }
  ];

  return (
    <section id="projetos" className="protocol-wrapper py-24 px-6 md:px-12 max-w-5xl mx-auto" ref={containerRef}>
      <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center tracking-tight">Nosso Protocolo</h2>

      <div className="flex flex-col gap-0 w-full h-full pb-0 relative">
        {protocols.map((p, i) => (
          <div
            key={i}
            className="protocol-card w-full mb-24 min-h-[50vh] bg-primary rounded-[3rem] border border-white/10 p-10 md:p-14 flex flex-col justify-between shadow-2xl origin-top overflow-hidden relative"
            style={i === protocols.length - 1 ? { marginBottom: '0' } : {}}
          >
            {/* Abstrato Decorativo bg */}
            <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none w-1/2 h-1/2 flex items-end justify-end">
              <svg viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="2" className="w-[150%] h-[150%]">
                <circle cx="100" cy="100" r={30 + i * 20} />
                <circle cx="100" cy="100" r={50 + i * 20} />
                <circle cx="100" cy="100" r={70 + i * 20} strokeDasharray="4 4" />
              </svg>
            </div>

            <div className="text-6xl md:text-8xl font-mono font-bold opacity-10 text-white mb-8">{p.num}</div>
            <div>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight uppercase">{p.title}</h3>
              <p className="text-base md:text-lg opacity-70 max-w-prose leading-relaxed font-normal">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ----------------------------------------------------
// CONTACT & FOOTER SECTION
// ----------------------------------------------------
// Cole aqui a URL do Google Apps Script após implantá-lo (Extensões → Apps Script → Implantar)
// Exemplo: "https://script.google.com/macros/s/AKfycb.../exec"
const API_URL = import.meta.env.VITE_API_URL || "";

const FooterContact = () => {
  const [form, setForm] = useState({ assunto: '', orcamento: '', nome: '', email: '', fone: '', extra: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação básica
    if (!form.email || !form.fone) {
      setStatus('error');
      setErrorMsg('Preencha pelo menos seu e-mail e telefone.');
      setTimeout(() => setStatus('idle'), 4000);
      return;
    }

    if (!API_URL) {
      setStatus('error');
      setErrorMsg('URL da API não configurada. Defina VITE_API_URL no arquivo .env');
      setTimeout(() => setStatus('idle'), 5000);
      return;
    }

    setStatus('loading');

    // Mapeia os campos do form para o schema do backend (gemini.md)
    const payload = {
      assunto_principal: form.assunto,
      email: form.email,
      telefone: form.fone,
      faixa_orcamento: form.orcamento,
      como_podemos_ajudar: form.extra
    };

    try {
      await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      });

      // Google Apps Script com no-cors retorna opaque response (status 0),
      // mas os dados são gravados com sucesso na planilha.
      setStatus('success');
      setForm({ assunto: '', orcamento: '', nome: '', email: '', fone: '', extra: '' });

      setTimeout(() => setStatus('idle'), 6000);
    } catch (err) {
      setStatus('error');
      setErrorMsg('Falha ao enviar. Tente novamente em instantes.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <footer id="contact-section" className="bg-[#050505] pt-24 mt-24 rounded-t-[4rem] border-t border-white/10 relative overflow-hidden flex flex-col">
      <div className="px-6 md:px-12 max-w-7xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">

        {/* Texts */}
        <div className="flex flex-col justify-center">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.1]">
            NÃO HÁ ATALHO<br />
            <span className="text-accent underline decoration-2 underline-offset-[12px]">P/ QUALIDADE.</span>
          </h2>
          <p className="text-base md:text-lg opacity-70 mb-12 max-w-prose leading-relaxed font-normal">
            Diga-nos o que você precisa. Nossa prioridade é fornecer excelência estética, sem improviso, gerando uma taxa de conversão que transforma tráfego em clientes reais.
          </p>

          <div className="flex bg-white/5 w-fit rounded-full px-5 py-2.5 mt-8 items-center gap-3 border border-white/10 shadow-lg">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            <span className="text-xs uppercase font-semibold tracking-widest text-[#B0B0B0]">DISPONÍVEL PARA NOVOS PROJETOS</span>
          </div>
        </div>

        {/* Formulário Interativo Otimizado */}
        <div className="bg-surface/50 p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-md relative">

          {/* Overlay de Sucesso */}
          {status === 'success' && (
            <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-xl rounded-[2.5rem] z-20 flex flex-col items-center justify-center gap-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/40">
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Proposta Recebida!</h3>
                <p className="text-sm opacity-60 max-w-xs">Nosso time vai analisar e retornar em até 24h. Fique de olho no seu e-mail.</p>
              </div>
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              <input
                type="text"
                placeholder="Nome Completo"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full bg-primary/80 border-b border-white/20 focus:border-white px-5 py-4 placeholder:text-white/40 text-white outline-none rounded-t-lg transition-colors text-base font-normal"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="email"
                  placeholder="E-mail Corporativo"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-primary/80 border-b border-white/20 focus:border-white px-5 py-4 placeholder:text-white/40 text-white outline-none rounded-t-lg transition-colors text-base font-normal"
                />
                <input
                  type="tel"
                  placeholder="Telefone / WhatsApp"
                  value={form.fone}
                  onChange={(e) => setForm({ ...form, fone: e.target.value })}
                  className="w-full bg-primary/80 border-b border-white/20 focus:border-white px-5 py-4 placeholder:text-white/40 text-white outline-none rounded-t-lg transition-colors text-base font-normal"
                />
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs font-semibold mb-4 opacity-60 uppercase tracking-widest text-[#B0B0B0]">Assunto Principal</p>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {['Social Media', 'Gestão de Tráfego e Anúncios', 'Branding e Design Criativo', 'Web design e desenvolvimento'].map(opt => (
                  <button type="button" key={opt} onClick={() => setForm({ ...form, assunto: opt })} className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all border ${form.assunto === opt ? 'bg-textMain text-primary border-transparent shadow-[0_0_15px_rgba(250,246,223,0.3)]' : 'bg-transparent border-white/20 text-white/70 hover:border-white/60 hover:bg-white/5'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs font-semibold mb-4 opacity-60 uppercase tracking-widest text-[#B0B0B0]">Faixa Orçamental (BRL)</p>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {['1.000 a 2.000', '2.000 a 4.000', '4.000 a 6.000', '6.000+'].map(opt => (
                  <button type="button" key={opt} onClick={() => setForm({ ...form, orcamento: opt })} className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all border ${form.orcamento === opt ? 'bg-textMain text-primary border-transparent shadow-[0_0_15px_rgba(250,246,223,0.3)]' : 'bg-transparent border-white/20 text-white/70 hover:border-white/60 hover:bg-white/5'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 mt-4">
              <textarea
                placeholder="Como podemos ajudar em detalhes?"
                rows="4"
                value={form.extra}
                onChange={(e) => setForm({ ...form, extra: e.target.value })}
                className="w-full bg-primary/80 border border-white/20 focus:border-white/50 px-5 py-5 placeholder:text-white/40 text-white outline-none rounded-2xl transition-colors text-base font-normal resize-none"
              ></textarea>
            </div>

            {/* Mensagem de Erro */}
            {status === 'error' && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-3 text-red-400 text-sm font-medium">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className={`w-full mt-4 p-5 rounded-full font-bold uppercase tracking-widest text-sm btn-magnetic flex items-center justify-center gap-3 transition-all duration-300 ${
                status === 'loading'
                  ? 'bg-white/20 text-white/50 cursor-wait'
                  : 'bg-textMain text-primary'
              }`}
            >
              {status === 'loading' ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                <>Solicitar Proposta <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 py-8 w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-12">
        <img src="/public/images/LOGO-FADE-BEGE.svg" alt="FADE Logo" className="h-5 mb-4 md:mb-0 opacity-50 filter grayscale" />
        <p className="text-sm font-medium opacity-40">© {new Date().getFullYear()} FADE &amp; CO. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

// ----------------------------------------------------
// MAIN APP COMPONENT
// ----------------------------------------------------
export default function App() {
  return (
    <div className="w-full overflow-hidden">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PhilosophySection />
      <ProtocolSection />
      <FooterContact />
    </div>
  );
}
