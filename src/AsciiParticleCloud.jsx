import React, { useEffect, useRef } from 'react';

export default function AsciiParticleCloud() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    let width, height;
    
    const setCanvasSize = () => {
      width = canvas.parentElement.offsetWidth;
      height = canvas.parentElement.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    setCanvasSize();

    let mouse = { x: null, y: null, radius: 100 };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    let particlesArray = [];
    // Caracteres customizados usados no Estúdio 017/ASCII art
    const chars = ['%', '#', '@', '*', '&', '+', '-', ':', 'f', 'a', 'd', 'e'];
    
    class Particle {
      constructor(x, y) {
        this.baseX = x;
        this.baseY = y;
        this.x = x + (Math.random() * 20 - 10);
        this.y = y + (Math.random() * 20 - 10);
        this.char = chars[Math.floor(Math.random() * chars.length)];
      }
      
      draw() {
        ctx.fillStyle = 'rgba(250, 246, 223, 0.6)'; // Brilho balanceado
        ctx.font = '8px monospace'; // Letra pequena e elegante
        ctx.fillText(this.char, this.x, this.y);
      }
      
      update() {
        if (Math.random() < 0.05) { 
          this.char = chars[Math.floor(Math.random() * chars.length)];
        }

        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let maxDistance = 230; // Aumento do raio da proteção pro novo tamanho
            
            if (distance < maxDistance) {
               // Formando a barreira Circular Nítida (Eclipse Escudo) - a pedido exato!
               let forceDirectionX = dx / distance;
               let forceDirectionY = dy / distance;
               
               // Alvo de Repulsão Exata: Beirada do anel de proteção
               let targetX = mouse.x - forceDirectionX * maxDistance;
               let targetY = mouse.y - forceDirectionY * maxDistance;
               
               // Jitter Vibratório Vivo para a borda virar uma tempestade na repulsão
               let chaosX = (Math.random() - 0.5) * 12;
               let chaosY = (Math.random() - 0.5) * 12;

               this.x += (targetX - this.x + chaosX) * 0.15;
               this.y += (targetY - this.y + chaosY) * 0.15;

               if (Math.random() < 0.4) {
                  this.char = chars[Math.floor(Math.random() * chars.length)];
               }
               ctx.fillStyle = 'rgba(250, 246, 223, 1)'; 
            } else {
               if (this.x !== this.baseX) {
                 this.x += (this.baseX - this.x) * 0.08;
               }
               if (this.y !== this.baseY) {
                 this.y += (this.baseY - this.y) * 0.08;
               }
            }
        } else {
           if (this.x !== this.baseX) {
             this.x += (this.baseX - this.x) * 0.08;
           }
           if (this.y !== this.baseY) {
             this.y += (this.baseY - this.y) * 0.08;
           }
        }
      }
    }

    class LogoParticle {
      constructor(x, y) {
        this.baseX = x;
        this.baseY = y;
        this.char = chars[Math.floor(Math.random() * chars.length)];
      }
      draw() {
        ctx.fillStyle = 'rgba(250, 246, 223, 0.9)'; 
        ctx.font = '7px monospace'; // Mais refinado dentro da área densa
        ctx.fillText(this.char, this.baseX, this.baseY);
      }
      update() {
        if (Math.random() < 0.05) { 
          this.char = chars[Math.floor(Math.random() * chars.length)];
        }
      }
    }

    const initImage = () => {
      const image = new Image();
      image.src = '/images/octopus.png'; 
      image.onload = () => {
        const offCanvas = document.createElement('canvas');
        const offCtx = offCanvas.getContext('2d');
        
        // Mais resolução mapeada pra não perder qualidade na escala massiva
        const mapWidth = 250;
        const aspectRatio = image.height / image.width;
        const mapHeight = mapWidth * aspectRatio;
        
        offCanvas.width = mapWidth;
        offCanvas.height = mapHeight;
        offCtx.drawImage(image, 0, 0, mapWidth, mapHeight);
        
        const imageData = offCtx.getImageData(0, 0, mapWidth, mapHeight);
        const data = imageData.data;
        
        particlesArray = [];
        
        // Polvo CLEAN. Totalmente centralizado com respiro.
        const isMobile = width < 768;
        // Aumentado a pedido do cliente para encostar sutilmente nas extremidades sem engolir a NavBar
        const maxFitHeight = isMobile ? window.innerHeight * 0.55 : window.innerHeight * 0.82; 
        const maxFitWidth = (maxFitHeight / mapHeight) * mapWidth;
        const scale = maxFitHeight / mapHeight;
        
        // Centralizado absoluto
        const offsetX = (width/2) - (maxFitWidth/2); 
        const offsetY = (height/2) - (maxFitHeight/2);
        
        // Passo da rede: 3 pixels
        for(let y = 0; y < mapHeight; y += 3) {
           for(let x = 0; x < mapWidth; x += 3) {
               let index = (y * mapWidth + x) * 4;
               let r = data[index];
               let g = data[index+1];
               let b = data[index+2];
               let a = data[index+3];

               if(r + g + b < 200 && a > 128) {
                   let posX = (x * scale) + offsetX;
                   let posY = (y * scale) + offsetY;
                   particlesArray.push(new Particle(posX, posY));
               }
           }
        }
      };
    };
    
    // Pequeno atraso garantindo que o CSS renderizou a box parental
    setTimeout(() => {
        initImage();
        initLogo();
    }, 100);

    let logoParticlesArray = [];
    let logoLoaded = false;

    const initLogo = () => {
       const image = new Image();
       image.src = '/images/LOGO-REDUZIDA-BEGE-400x400.svg';
       image.onload = () => { 
          const offCanvas = document.createElement('canvas');
          const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
          
          // Escala proporcional ao novo Polvo e novo buraco alargado 
          const maxLogoScale = width < 768 ? 175 : 250; 
          offCanvas.width = maxLogoScale;
          offCanvas.height = maxLogoScale;
          offCtx.drawImage(image, 0, 0, maxLogoScale, maxLogoScale);
          
          const imageData = offCtx.getImageData(0, 0, maxLogoScale, maxLogoScale);
          const data = imageData.data;
          logoParticlesArray = [];

          const offsetX = (width / 2) - (maxLogoScale / 2);
          const offsetY = (height / 2) - (maxLogoScale / 2);

          // Espaçamento muito maior pra não aglomerar os caracteres uns em cima dos outros
          for(let y = 0; y < maxLogoScale; y += 6) {
             for(let x = 0; x < maxLogoScale; x += 6) {
                 let index = (y * maxLogoScale + x) * 4;
                 let a = data[index+3];
                 if(a > 128) {
                     logoParticlesArray.push(new LogoParticle(x + offsetX, y + offsetY));
                 }
             }
          }
          logoLoaded = true; 
       };
    };

    let animationFrameId;
    const animate = () => {
       ctx.clearRect(0, 0, width, height);

       // Revelação de SCRATCH-OFF com as Partículas da Logo
       if (mouse.x !== null && logoLoaded) {
           ctx.save();
           // Criando Lente (Recorte do Canvas) acompanhando as novas dimensões exatas de escudo
           ctx.beginPath();
           ctx.arc(mouse.x, mouse.y, 230, 0, Math.PI * 2);
           ctx.clip(); 
           
           for(let j = 0; j < logoParticlesArray.length; j++){
              logoParticlesArray[j].draw();
              logoParticlesArray[j].update();
           }
           
           ctx.restore(); // Fecha o tubo do clip
       }

       for(let i = 0; i < particlesArray.length; i++){
          particlesArray[i].draw();
          particlesArray[i].update();
       }
       animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
       setCanvasSize();
       initImage();
       initLogo();
    };
    window.addEventListener('resize', handleResize);

    return () => {
       window.removeEventListener('mousemove', handleMouseMove);
       canvas.removeEventListener('mouseleave', handleMouseLeave);
       window.removeEventListener('resize', handleResize);
       cancelAnimationFrame(animationFrameId);
    };

  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full pointer-events-auto"
      style={{ zIndex: 0 }}
    />
  );
}
