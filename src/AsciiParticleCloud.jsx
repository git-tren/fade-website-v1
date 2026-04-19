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
    // Caracteres customizados usados no ASCII art
    const chars = ['%', '#', '@', '*', '&', '+', '-', ':', 'f', 'a', 'd', 'e'];
    
    // Centroide do polvo (calculado no initImage)
    let octopusCenterX = 0;
    let octopusCenterY = 0;
    let octopusMaxRadius = 0;
    // Tempo global para animacao de tentaculos
    let time = 0;
    // Offset vertical global para efeito de flutuacao no mobile
    let floatOffsetY = 0;
    const isMobileDevice = () => width < 768;
    
    class Particle {
      constructor(x, y) {
        this.baseX = x;
        this.baseY = y;
        this.x = x + (Math.random() * 20 - 10);
        this.y = y + (Math.random() * 20 - 10);
        this.char = chars[Math.floor(Math.random() * chars.length)];
        // Fase unica por particula para dessincronizar o movimento
        this.phase = Math.random() * Math.PI * 2;
        // Frequencia ligeiramente variada para cada particula
        this.freqOffset = 0.7 + Math.random() * 0.6;
        // Offset horizontal unico para ondulacao lateral variada
        this.xPhase = Math.random() * Math.PI * 2;
      }
      
      draw() {
        ctx.fillStyle = 'rgba(250, 246, 223, 0.6)';
        ctx.font = '8px monospace';
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
            let maxDistance = 230;
            
            if (distance < maxDistance) {
               let forceDirectionX = dx / distance;
               let forceDirectionY = dy / distance;
               
               let targetX = mouse.x - forceDirectionX * maxDistance;
               let targetY = mouse.y - forceDirectionY * maxDistance;
               
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
        } else if (isMobileDevice()) {
           // === TENTACLE SWAY + FLUTUACAO — Mobile only ===
           if (octopusMaxRadius > 0) {
             const dx = this.baseX - octopusCenterX;
             const dy = this.baseY - octopusCenterY;
             const dist = Math.sqrt(dx * dx + dy * dy);
             const radialRatio = Math.min(dist / octopusMaxRadius, 1);
             
             if (radialRatio > 0.3) {
               const tentacleRatio = (radialRatio - 0.3) / 0.7;
               const amplitude = Math.pow(tentacleRatio, 2.2) * 8;
               const speed = 0.0008 * this.freqOffset;
               
               const angle = Math.atan2(dy, dx);
               const perpX = -Math.sin(angle);
               const perpY = Math.cos(angle);
               
               const wavePhase = dist * 0.015;
               const sway = Math.sin(time * speed + this.phase + wavePhase) * amplitude;
               
               const radialSway = Math.cos(time * speed * 0.7 + this.xPhase + wavePhase) * amplitude * 0.2;
               const radialDirX = dist > 0 ? dx / dist : 0;
               const radialDirY = dist > 0 ? dy / dist : 0;
               
               const targetX = this.baseX + perpX * sway + radialDirX * radialSway;
               const targetY = this.baseY + perpY * sway + radialDirY * radialSway + floatOffsetY;
               this.x += (targetX - this.x) * 0.04;
               this.y += (targetY - this.y) * 0.04;
             } else {
               // Nucleo central — respiracao + flutuacao global
               const breathe = Math.sin(time * 0.0004 + this.phase) * 1.2;
               this.x += (this.baseX + breathe * 0.3 - this.x) * 0.03;
               this.y += (this.baseY + breathe * 0.15 + floatOffsetY - this.y) * 0.03;
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
        ctx.font = '7px monospace';
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
        
        const mapWidth = 250;
        const aspectRatio = image.height / image.width;
        const mapHeight = mapWidth * aspectRatio;
        
        offCanvas.width = mapWidth;
        offCanvas.height = mapHeight;
        offCtx.drawImage(image, 0, 0, mapWidth, mapHeight);
        
        const imageData = offCtx.getImageData(0, 0, mapWidth, mapHeight);
        const data = imageData.data;
        
        particlesArray = [];
        
        const isMobile = width < 768;
        const maxFitHeight = isMobile ? window.innerHeight * 0.55 : window.innerHeight * 0.82; 
        const maxFitWidth = (maxFitHeight / mapHeight) * mapWidth;
        const scale = maxFitHeight / mapHeight;
        
        const offsetX = (width/2) - (maxFitWidth/2); 
        // Mobile: sobe o polvo um pouco para centralizar melhor na area preta visivel
        const offsetY = isMobile 
          ? (height/2) - (maxFitHeight/2) - (window.innerHeight * 0.06)
          : (height/2) - (maxFitHeight/2);
        
        // Grid step: mobile=4px (menos denso, mais clean), desktop=3px
        const gridStep = isMobile ? 4 : 3;
        for(let y = 0; y < mapHeight; y += gridStep) {
           for(let x = 0; x < mapWidth; x += gridStep) {
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
        
        // Calcular centroide e raio maximo do polvo para animacao radial
        let sumX = 0, sumY = 0;
        for (let i = 0; i < particlesArray.length; i++) {
          sumX += particlesArray[i].baseX;
          sumY += particlesArray[i].baseY;
        }
        const count = particlesArray.length;
        octopusCenterX = count > 0 ? sumX / count : 0;
        octopusCenterY = count > 0 ? sumY / count : 0;
        
        // Raio maximo = particula mais distante do centroide
        octopusMaxRadius = 0;
        for (let i = 0; i < count; i++) {
          const ddx = particlesArray[i].baseX - octopusCenterX;
          const ddy = particlesArray[i].baseY - octopusCenterY;
          const d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d > octopusMaxRadius) octopusMaxRadius = d;
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
          
          const maxLogoScale = width < 768 ? 175 : 250; 
          offCanvas.width = maxLogoScale;
          offCanvas.height = maxLogoScale;
          offCtx.drawImage(image, 0, 0, maxLogoScale, maxLogoScale);
          
          const imageData = offCtx.getImageData(0, 0, maxLogoScale, maxLogoScale);
          const data = imageData.data;
          logoParticlesArray = [];

          const offsetX = (width / 2) - (maxLogoScale / 2);
          const offsetY = (height / 2) - (maxLogoScale / 2);

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
       time += 16;
       // Flutuacao global no mobile — polvo sobe e desce suavemente
       floatOffsetY = isMobileDevice() ? Math.sin(time * 0.0003) * 6 : 0;
       ctx.clearRect(0, 0, width, height);

       // Revelacao de SCRATCH-OFF com as Particulas da Logo
       if (mouse.x !== null && logoLoaded) {
           ctx.save();
           ctx.beginPath();
           ctx.arc(mouse.x, mouse.y, 230, 0, Math.PI * 2);
           ctx.clip(); 
           
           for(let j = 0; j < logoParticlesArray.length; j++){
              logoParticlesArray[j].draw();
              logoParticlesArray[j].update();
           }
           
           ctx.restore();
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
