function generateStars(numberOfStars) {
  const container = document.querySelector('.star-container');

  if (!container) {
    console.error('El contenedor .star-container no fue encontrado.');
    return;
  }

  const animationTypes = ['pulsing', 'flickering', 'rotating'];

  for (let i = 0; i < numberOfStars; i++) {
    const star = document.createElement('div');
    star.classList.add('star');

    const animationType = animationTypes[i % animationTypes.length];
    star.setAttribute('data-star-type', animationType);

    // Posiciona la estrella aleatoriamente
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    star.style.left = `${x}vw`;
    star.style.top = `${y}vh`;

    // Si la estrella es de tipo "flickering", asigna un retraso aleatorio
    if (animationType === 'flickering') {
      const randomDelay = Math.random() * 2; // Retraso aleatorio entre 0 y 2 segundos
      star.style.animationDelay = `${randomDelay}s`;
    }

    container.appendChild(star);
  }
}

generateStars(169);