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
      <nav ref={navRef} className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 py-6 md:px-12 flex items-center justify-between ${scrolled ? 'bg-[#111111]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl' : 'bg-transparent'}`}>
        <div className="flex items-center gap-3">
          <img src="./images/LOGO-FADE-BEGE.svg" alt="FADE & CO. Logo" className="h-6 md:h-7" />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-[0.1em] text-white/70 uppercase">
          <a href="#home" className="hover:-translate-y-0.5 transition-transform hover:text-white">Home</a>
          <a href="#sobre" className="hover:-translate-y-0.5 transition-transform hover:text-white">Serviços</a>
          <a href="#projetos" className="hover:-translate-y-0.5 transition-transform hover:text-white">Processo</a>
          <a href="#cases" className="hover:-translate-y-0.5 transition-transform hover:text-white">Projetos</a>
        </div>

        {/* Cta & Mobile Toggle */}
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={scrollToContact} className="flex items-center gap-1.5 md:gap-2 bg-[#F5F3EE] text-[#111111] px-4 py-2 md:px-5 md:py-2.5 rounded-full font-bold text-[10px] md:text-sm uppercase tracking-wider md:tracking-widest whitespace-nowrap btn-magnetic">
            Fale conosco
          </button>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden flex items-center justify-center p-2 rounded-full bg-white/10 text-white border border-white/10 btn-magnetic z-50">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-[#111111] z-40 transition-transform duration-500 flex flex-col items-center justify-center gap-8 ${mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <a href="#home" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-medium tracking-tight text-white">Home</a>
        <a href="#sobre" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-medium tracking-tight text-white">Serviços</a>
        <a href="#projetos" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-medium tracking-tight text-white">Processo</a>
        <a href="#cases" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-medium tracking-tight text-white">Projetos</a>
        <button onClick={scrollToContact} className="mt-8 flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-medium text-xl btn-magnetic">
          Fale conosco <ArrowRight size={24} />
        </button>
      </div>
    </>
  );
};

// ----------------------------------------------------
// HERO SECTION
// ----------------------------------------------------
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Center } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

// Carrega e extruda os paths SVG da logo real FADE
const useFadeLogoData = () => {
  const [data, setData] = React.useState({ geos: [], offset: new THREE.Vector3() });

  React.useEffect(() => {
    const loader = new SVGLoader();
    loader.load('./images/LOGO-REDUZIDA-CIRCULO-BEGE-400x400.svg', (svgData) => {
      const svgSize = 362.94;
      const scale = 5.5 / svgSize;

      const geos = [];
      const globalBox = new THREE.Box3();

      svgData.paths.forEach((path) => {
        const shapes = SVGLoader.createShapes(path);
        shapes.forEach((shape) => {
          const geo = new THREE.ExtrudeGeometry(shape, {
            depth: 8,
            bevelEnabled: true,
            bevelThickness: 4,
            bevelSize: 2,
            bevelSegments: 8,
            curveSegments: 16,
          });
          geo.computeVertexNormals();
          geo.scale(scale, -scale, scale);
          geo.computeBoundingBox();

          const size = new THREE.Vector3();
          geo.boundingBox.getSize(size);

          if (size.x < 1.5 && size.y < 1.5) {
            const dotCenter = new THREE.Vector3();
            geo.boundingBox.getCenter(dotCenter);
            geo.translate(-dotCenter.x, -dotCenter.y, -dotCenter.z);
            geo.scale(0.7, 0.7, 0.85);
            geo.translate(dotCenter.x - 0.18, dotCenter.y + 0.18, dotCenter.z);
            geo.computeBoundingBox();
          }

          if (geo.boundingBox) globalBox.union(geo.boundingBox);
          geos.push(geo);
        });
      });

      const center = new THREE.Vector3();
      globalBox.getCenter(center);
      setData({ geos, offset: center });
    });
  }, []);

  return data;
};

// FIX 1: useProceduralEnvMap declarado ANTES de ChromeMaterial
const useProceduralEnvMap = () => {
  const envMap = React.useMemo(() => {
    const S = 1024, buf = new Uint8Array(S * S * 4);
    const spots = [
      [0.50, 0.02, 0.16, 255, 252, 240, 3.5],
      [0.08, 0.06, 0.40, 20, 55, 255, 2.2],
      [0.92, 0.78, 0.30, 170, 15, 240, 2.0],
      [0.06, 0.93, 0.28, 220, 130, 8, 2.0],
      [0.90, 0.15, 0.20, 0, 200, 215, 2.0],
      [0.12, 0.65, 0.22, 210, 8, 155, 1.8],
      [0.50, 0.98, 0.18, 255, 240, 200, 1.5],
    ];
    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const i = (y * S + x) * 4, u = x / S, v = y / S;
        let r = 4, g = 4, b = 6;
        for (const [su, sv, sr, cr, cg, cb, pw] of spots) {
          const d = Math.hypot(u - su, v - sv);
          if (d < sr) { const f = Math.pow(Math.max(0, 1 - d / sr), pw); r += f * cr; g += f * cg; b += f * cb; }
        }
        buf[i] = Math.min(255, r); buf[i + 1] = Math.min(255, g); buf[i + 2] = Math.min(255, b); buf[i + 3] = 255;
      }
    }
    const t = new THREE.DataTexture(buf, S, S, THREE.RGBAFormat);
    t.mapping = THREE.EquirectangularReflectionMapping;
    t.needsUpdate = true;
    return t;
  }, []);
  return envMap;
};

// FIX 1: ChromeMaterial agora vem DEPOIS de useProceduralEnvMap
// FIX 2: Usando meshPhysicalMaterial (chrome escuro) em vez de MeshTransmissionMaterial
const ChromeMaterial = () => {
  const envMap = useProceduralEnvMap();
  return (
    <meshPhysicalMaterial
      color="#080812"
      metalness={1.0}
      roughness={0.015}
      envMap={envMap}
      envMapIntensity={6.0}
      clearcoat={1.0}
      clearcoatRoughness={0.0}
      reflectivity={1.0}
    />
  );
};

const CustomEnvironment = () => {
  const envMap = useProceduralEnvMap();
  return <Environment map={envMap} />;
};

const ChromeLights = () => {
  const lKey = useRef();
  const lFill = useRef();
  const lRim = useRef();
  const lCyan = useRef();
  const lTop = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (lKey.current) {
      lKey.current.position.x = -3 + Math.sin(t * 0.55) * 2.5;
      lKey.current.position.y = 5 + Math.cos(t * 0.38) * 2;
    }
    if (lFill.current) {
      lFill.current.position.x = 4 + Math.cos(t * 0.47) * 2;
      lFill.current.position.z = 3 + Math.sin(t * 0.63) * 1.5;
    }
    if (lRim.current) {
      lRim.current.position.x = 2 + Math.sin(t * 0.42) * 2.5;
    }
    if (lCyan.current) {
      lCyan.current.position.y = -2 + Math.cos(t * 0.66) * 2;
    }
  });

  return (
    <>
      <pointLight ref={lKey} color={0x3355ff} intensity={22} distance={18} position={[-4, 5, 4]} />
      <pointLight ref={lFill} color={0xee8800} intensity={10} distance={14} position={[4, -4, 3]} />
      <pointLight ref={lRim} color={0xcc00ff} intensity={14} distance={14} position={[2, 3, -4]} />
      <pointLight ref={lCyan} color={0x00ddff} intensity={8} distance={12} position={[-3, -2, 3]} />
      <pointLight ref={lTop} color={0xffffff} intensity={6} distance={10} position={[0, 6, 3]} />
      <ambientLight color={0x080820} intensity={3} />
    </>
  );
};

const AnimatedLogo = () => {
  const groupRef = useRef();
  const { size } = useThree();

  // Se a largura da tela for menor que 768px (mobile), a logo fica menor (55% do tamanho)
  const baseScale = size.width < 768 ? 0.55 : 1.0;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Rotação autônoma suave
    groupRef.current.rotation.y = Math.sin(t * 0.35) * 0.28;
    groupRef.current.rotation.x = Math.cos(t * 0.27) * 0.13;
    groupRef.current.rotation.z = Math.sin(t * 0.19) * 0.045;

    // Escala pulsante (Breathe) multiplicada pela escala base (desktop/mobile)
    const s = baseScale + Math.sin(t * 0.85) * 0.011;
    groupRef.current.scale.setScalar(s);
  });

  const { geos, offset } = useFadeLogoData();

  if (geos.length === 0) return null;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Center>
        <group position={[-offset.x, -offset.y, -offset.z]}>
          {geos.map((geo, index) => (
            <mesh key={index} geometry={geo} castShadow receiveShadow>
              <ChromeMaterial />
            </mesh>
          ))}
        </group>
      </Center>
    </group>
  );
};

const HeroSection = () => {
  return (
    <section id="home" className="relative w-full h-[100dvh] overflow-hidden flex flex-col items-center justify-center pt-20">

      {/* Feixe de luz suave */}
      <div className="absolute top-[-10%] left-[-15%] w-[80vw] h-[30vw] bg-gradient-to-r from-white to-transparent opacity-[0.05] blur-[80px] md:blur-[120px] rotate-[-25deg] pointer-events-none z-0"></div>

      {/* 3D CANVAS — z-0 (Fundo absoluto) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-full pointer-events-none">
          <Canvas
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
            dpr={[1, 1.5]}
          >
            <React.Suspense fallback={null}>
              <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={45} />
              <ChromeLights />
              <CustomEnvironment />
              <AnimatedLogo />
            </React.Suspense>
          </Canvas>
        </div>
      </div>

      {/* TEXTO TIPOGRÁFICO (Imagem SVG) — z-10 (Na frente do 3D) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none select-none px-4 md:px-8">
        <img
          src="/images/Criamos_Marcas.svg"
          alt="Criamos Marcas Que Não Desaparecem"
          className="w-full max-w-[1000px] md:max-w-[1200px] opacity-90"
        />
      </div>

      {/* Granular Noise */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-overlay z-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      {/* Bottom texts */}
      <div className="absolute bottom-12 px-6 md:px-12 w-full flex justify-between items-end text-[10px] md:text-xs font-semibold tracking-widest uppercase text-white/50 z-30">
        <div className="max-w-[200px] md:max-w-none">DISPONÍVEL PARA NOVOS PROJETOS EM 2026.</div>
        <div className="text-right">[SCROLL PARA EXPLORAR]</div>
      </div>

    </section>
  );
};


// ----------------------------------------------------
// MARQUEE SEPARATOR
// ----------------------------------------------------
const MarqueeSeparator = () => {
  const texts = [
    "BRANDING & REBRANDING", "*",
    "IDENTIDADE VISUAL", "*",
    "DIREÇÃO CRIATIVA", "*",
    "WEBSITES", "*",
    "TRÁFEGO PAGO", "*",
    "MARKETING STRATEGY", "*"
  ];

  return (
    <div className="relative w-full h-40 md:h-56 z-30 flex items-center justify-center">

      {/* Faixa 1 (Inclinada levemente para baixo, movendo p/ direita) */}
      <div
        className="absolute bg-[#FAF6DF] py-3 md:py-4 flex items-center shadow-xl border-y border-[#D6D3C8]/30 z-20 rotate-6 md:rotate-3"
        style={{ width: '150%', left: '-25%' }}
      >
        <div className="whitespace-nowrap flex font-bold text-xs md:text-sm tracking-widest uppercase text-[#0D0D0D] animate-marquee-right w-max">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex shrink-0 items-center justify-center">
              {texts.map((text, idx) => (
                <span key={idx} className="mx-4">{text}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Faixa 2 (Inclinada levemente para cima, movendo p/ direita, atrás da primeira) */}
      <div
        className="absolute bg-[#FAF6DF] py-3 md:py-4 flex items-center shadow-lg border-y border-[#D6D3C8]/30 z-10 opacity-90 -rotate-6 md:-rotate-3"
        style={{ width: '150%', left: '-25%' }}
      >
        <div className="whitespace-nowrap flex font-bold text-xs md:text-sm tracking-widest uppercase text-[#0D0D0D] animate-marquee-right w-max" style={{ animationDelay: '-15s', animationDuration: '90s' }}>
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex shrink-0 items-center justify-center">
              {texts.map((text, idx) => (
                <span key={idx} className="mx-4">{text}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

// ----------------------------------------------------
// SERVICES SECTION
// ----------------------------------------------------
const ServicesSection = () => {
  const services = [
    {
      num: '01',
      title: 'Branding & Identidade Visual',
      desc: 'Definimos o tom de voz e a personalidade que fazem sua marca ter vida própria. Criamos todo o ecossistema e os códigos visuais para sua empresa ter autoridade e ser reconhecida em qualquer lugar, de olhos fechados.'
    },
    {
      num: '02',
      title: 'Websites & Experiência Digital',
      desc: 'Sites que carregam rápido, convertem vendas e clientes e não parecem um template genérico de 2015. É a sua melhor vitrine, projetada para ser intuitiva e prender a atenção de quem importa.'
    },
    {
      num: '03',
      title: 'Direção Criativa',
      desc: 'O olhar que coloca ordem no caos. Transformamos conceitos abstratos em narrativas visuais sólidas para garantir que cada detalhe da marca comunique exatamente o que precisa.'
    },
    {
      num: '04',
      title: 'Tráfego Pago',
      desc: 'Colocamos sua marca na frente das pessoas certas. Usamos dados reais para escalar seu alcance e garantir que seu investimento chegue onde traz retorno, sem queimar dinheiro com tentativa e erro.'
    }
  ];

  return (
    <section id="sobre" className="py-24 md:py-32 px-6 md:px-12 w-full relative z-20">
      <div className="max-w-6xl mx-auto w-full">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-16 md:mb-24 tracking-tight uppercase font-headline">
          O Que Fazemos de Melhor
        </h2>

        <div className="flex flex-col border-t border-white/20">
          {services.map((svc, idx) => (
            <div key={idx} className="flex flex-col md:flex-row py-8 md:py-12 border-b border-white/20 gap-4 md:gap-16 group hover:bg-white/[0.02] transition-colors duration-300">
              <div className="md:w-[45%] flex items-start gap-6 md:gap-8">
                <span className="text-sm md:text-base font-mono opacity-60 mt-1">{svc.num}</span>
                <h3 className="text-xl md:text-3xl font-semibold tracking-tight">{svc.title}</h3>
              </div>
              <div className="md:w-[55%] flex items-start">
                <p className="text-sm md:text-base opacity-70 leading-relaxed font-normal">
                  {svc.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
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
          if (i === cards.length - 1) return;
          ScrollTrigger.create({
            trigger: card,
            start: 'top top+=100',
            endTrigger: cards[cards.length - 1],
            end: 'top top+=100',
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
    { num: '01', title: 'ALINHAMENTO', desc: 'Você nos apresenta o cenário atual e nós desenhamos a solução. Se as expectativas estiverem alinhadas, enviamos a proposta comercial e definimos os próximos passos.' },
    { num: '02', title: 'IMERSÃO & PESQUISA', desc: 'Com 50% do projeto garantido, mergulhamos no seu negócio. Analisamos o briefing, fazemos uma pesquisa de mercado aprofundada e realizamos a reunião de alinhamento para garantir que estamos mirando no alvo certo.' },
    { num: '03', title: 'CONCEITO & MOODBOARD', desc: 'Apresentamos a proposta de moodboard para validarmos juntos o universo visual. É o momento de garantir que as referências e os caminhos criativos traduzem exatamente o que o projeto pede.' },
    { num: '04', title: 'EXECUÇÃO & REFINAMENTO', desc: 'Aqui a ideia ganha forma. Desenvolvemos o projeto com foco total em originalidade e funcionalidade, preparando tudo para a grande entrega.' },
    { num: '05', title: 'APRESENTAÇÃO & ENTREGA', desc: 'Após o acerto final, apresentamos o resultado. Com tudo aprovado, enviamos o kit completo de arquivos prontos para o mundo.' }
  ];

  return (
    <section id="projetos" className="protocol-wrapper py-24 px-6 md:px-12 max-w-5xl mx-auto" ref={containerRef}>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-16 text-center tracking-tight uppercase font-headline text-white">O PROCESSO</h2>

      <div className="flex flex-col gap-0 w-full h-full pb-0 relative">
        {protocols.map((p, i) => (
          <div
            key={i}
            className="protocol-card w-full mb-24 min-h-[40vh] bg-[#FAF6DF] text-[#0A0A0A] rounded-[2rem] md:rounded-[3rem] border border-black/10 p-10 md:p-14 flex flex-col justify-start shadow-2xl origin-top overflow-hidden relative"
            style={i === protocols.length - 1 ? { marginBottom: '0' } : {}}
          >
            <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none w-1/2 h-1/2 flex items-end justify-end">
              <svg viewBox="0 0 100 100" fill="none" stroke="#0A0A0A" strokeWidth="2" className="w-[150%] h-[150%]">
                <circle cx="100" cy="100" r={30 + i * 20} />
                <circle cx="100" cy="100" r={50 + i * 20} />
                <circle cx="100" cy="100" r={70 + i * 20} strokeDasharray="4 4" />
              </svg>
            </div>

            <div className="text-6xl md:text-8xl font-mono font-bold text-[#0A0A0A] mb-8 md:mb-12">{p.num}</div>
            <div>
              <h3 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight uppercase font-headline">{p.title}</h3>
              <p className="text-base md:text-lg opacity-80 max-w-prose leading-relaxed font-normal">{p.desc}</p>
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
const API_URL = import.meta.env.VITE_API_URL || "";

const FooterContact = () => {
  const [form, setForm] = useState({ assunto: '', orcamento: '', nome: '', email: '', fone: '', extra: '' });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    <footer id="contact-section" className="bg-[#050505] pt-24 mt-24 rounded-t-[4rem] border-t border-white/10 relative overflow-hidden flex flex-col items-center">
      <div className="px-6 md:px-12 max-w-3xl mx-auto w-full z-10 flex flex-col items-center mb-24">

        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-12 text-center uppercase font-headline text-[#FAF6DF]">
          Dúvidas, ideias ou só<br className="hidden md:block" /> quer dar um oi?
        </h2>

        <div className="bg-[#0A0A0A] w-full p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative">

          {status === 'success' && (
            <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-xl rounded-[2.5rem] z-20 flex flex-col items-center justify-center gap-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/40">
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Mensagem Recebida!</h3>
                <p className="text-sm opacity-60 max-w-xs">Nosso time vai analisar e retornar em até 24h. Fique de olho no seu e-mail.</p>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Nome Completo"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full bg-[#111] border-b border-white/10 focus:border-white/30 px-4 py-3 placeholder:text-white/40 text-[#FAF6DF] outline-none rounded-t-lg transition-colors text-sm font-normal"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-[#111] border-b border-white/10 focus:border-white/30 px-4 py-3 placeholder:text-white/40 text-[#FAF6DF] outline-none rounded-t-lg transition-colors text-sm font-normal"
                />
                <input
                  type="tel"
                  placeholder="Telefone / WhatsApp"
                  value={form.fone}
                  onChange={(e) => setForm({ ...form, fone: e.target.value })}
                  className="w-full bg-[#111] border-b border-white/10 focus:border-white/30 px-4 py-3 placeholder:text-white/40 text-[#FAF6DF] outline-none rounded-t-lg transition-colors text-sm font-normal"
                />
              </div>
            </div>

            <div className="pt-1">
              <p className="text-[10px] md:text-xs font-semibold mb-3 opacity-50 uppercase tracking-widest text-[#FAF6DF]">Assunto Principal</p>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {['Social Media', 'Gestão de Tráfego e Anúncios', 'Branding e Design Criativo', 'Web design e desenvolvimento'].map(opt => (
                  <button type="button" key={opt} onClick={() => setForm({ ...form, assunto: opt })} className={`px-4 py-2 rounded-full text-xs font-medium transition-all border ${form.assunto === opt ? 'bg-[#FAF6DF] text-[#050505] border-transparent font-bold shadow-md' : 'bg-transparent border-white/10 text-white/60 hover:border-white/30 hover:bg-white/5'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-1">
              <p className="text-[10px] md:text-xs font-semibold mb-3 opacity-50 uppercase tracking-widest text-[#FAF6DF]">Faixa Orçamental (BRL)</p>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {['1.000 a 2.000', '2.000 a 4.000', '4.000 a 6.000', '6.000+'].map(opt => (
                  <button type="button" key={opt} onClick={() => setForm({ ...form, orcamento: opt })} className={`px-4 py-2 rounded-full text-xs font-medium transition-all border ${form.orcamento === opt ? 'bg-[#FAF6DF] text-[#050505] border-transparent font-bold shadow-md' : 'bg-transparent border-white/10 text-white/60 hover:border-white/30 hover:bg-white/5'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-1">
              <textarea
                placeholder="Como podemos ajudar?"
                rows="3"
                value={form.extra}
                onChange={(e) => setForm({ ...form, extra: e.target.value })}
                className="w-full bg-[#111] border border-white/10 focus:border-white/30 px-4 py-4 placeholder:text-white/40 text-[#FAF6DF] outline-none rounded-2xl transition-colors text-sm font-normal resize-none"
              ></textarea>
            </div>

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
              className={`w-full mt-4 p-4 rounded-full font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all duration-300 ${status === 'loading'
                ? 'bg-[#FAF6DF]/20 text-[#FAF6DF]/50 cursor-wait'
                : 'bg-[#FAF6DF] text-[#050505] hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(250,246,223,0.3)]'
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
                <>Enviar Mensagem <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="w-full flex flex-col items-center mt-auto">
        <p className="text-xs md:text-sm font-medium opacity-40 mb-8 md:mb-12 text-[#FAF6DF]">© {new Date().getFullYear()} FADE &amp; CO. Todos os direitos reservados.</p>
        <div className="w-full px-4 md:px-8 flex justify-center items-end">
          <img src="./images/LOGO-FADE-BEGE.svg" alt="FADE Logo" className="w-full h-auto opacity-100 translate-y-[30%]" />
        </div>
      </div>
    </footer>
  );
};

// ----------------------------------------------------
// BACKGROUND EFFECTS
// ----------------------------------------------------
const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Ponto 1 - Topo Esquerda */}
      <div className="absolute top-[15%] left-[10%] w-64 h-64 rounded-full bg-[#FAF6DF]/[0.02] blur-[80px] mix-blend-screen animate-pulse" style={{ animationDuration: '7s' }}></div>

      {/* Ponto 2 - Meio Direita */}
      <div className="absolute top-[45%] right-[15%] w-80 h-80 rounded-full bg-[#C1BBAE]/[0.015] blur-[90px] mix-blend-screen animate-pulse" style={{ animationDuration: '11s' }}></div>

      {/* Ponto 3 - Baixo Centro-Esquerda */}
      <div className="absolute bottom-[20%] left-[30%] w-72 h-72 rounded-full bg-[#FAF6DF]/[0.015] blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '9s' }}></div>
    </div>
  );
};

// ----------------------------------------------------
// MAIN APP COMPONENT
// ----------------------------------------------------
export default function App() {
  return (
    <div className="w-full overflow-hidden relative">
      <BackgroundEffects />
      <Navbar />
      <HeroSection />
      <MarqueeSeparator />
      <ServicesSection />
      <ProtocolSection />
      <FooterContact />
    </div>
  );
}