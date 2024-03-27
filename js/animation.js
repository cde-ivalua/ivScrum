function explodeParticles(origin, color) {
    const numberOfParticles = 20;
    const radius = 200;
  
    for (let i = 0; i < numberOfParticles; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
  
      // Position initiale des particules (centre de la div)
      const originRect = origin.getBoundingClientRect();
      const x = originRect.left + originRect.width / 2;
      const y = originRect.top + originRect.height / 2;
  
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.backgroundColor = color;

      var r = Math.random();
      particle.style.width = `${ r * 10 + 5}px`;
      particle.style.height = `${r * 10 + 5}px`;
  
      document.body.appendChild(particle);
  
      // Calculer une direction et une vitesse aléatoires pour chaque particule
      const angle = Math.random() * 2 * Math.PI;
      const speed = (Math.random() * 15) + 5; // 5 à 20px par animation frame
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
  
      // Fonction pour animer la particule
      function animateParticle(time) {
        requestAnimationFrame((newTime) => {
          const deltaTime = newTime - time;
          const moveX = vx * deltaTime * 0.05; // Ajuster la vitesse en fonction du deltaTime
          const moveY = vy * deltaTime * 0.05;
  
          const currentX = parseFloat(particle.style.left);
          const currentY = parseFloat(particle.style.top);
  
          particle.style.left = `${currentX + moveX}px`;
          particle.style.top = `${currentY + moveY}px`;


          const targetX = Math.abs(currentX - x);
          const targetY = Math.abs(currentY - y);

          const alpha = 1 - Math.sqrt(targetX * targetX + targetY * targetY) / radius;
          particle.style.opacity = alpha;
  
          // Continue l'animation si nécessaire
          if (Math.abs(currentX - x) < radius && Math.abs(currentY - y) < radius) { // Limite de l'explosion
            animateParticle(newTime);
          } else {
            particle.remove(); // Nettoyer la particule après l'animation
          }
        });
      }
  
      // Commencer l'animation
      animateParticle(performance.now());
    }
  }