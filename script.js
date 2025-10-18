// Configuración de partículas animadas
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

// Ajustar tamaño del canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
window.addEventListener('scroll', () => {
    canvas.height = document.documentElement.scrollHeight;
});

// Partículas
class Particle {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.size = Math.random() * 4 + 2;
        this.speedY = Math.random() * 1 + 0.5;
        this.speedX = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.2;

        // Solo círculos brillantes, sin emojis para evitar deformación
        this.type = 'circle';
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 2 - 1;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;

        // Efecto de ondulación
        this.x += Math.sin(this.y * 0.01) * 0.5;

        if (this.y > canvas.height + 10 || this.x < -10 || this.x > canvas.width + 10) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;

        if (this.type === 'circle') {
            // Círculos brillantes
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Emojis
            ctx.font = `${this.size * 4}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillText(this.type, 0, 0);
        }

        ctx.restore();
    }
}

// Crear partículas
const particlesArray = [];
const numberOfParticles = 80;

for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
}

// Animación de partículas
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesArray.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animateParticles);
}

animateParticles();

// Efecto de parallax en scroll
let scrollY = 0;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;

    const floatingElements = document.querySelectorAll('.floating-pozole');
    floatingElements.forEach((element, index) => {
        const speed = (index + 1) * 0.1;
        element.style.transform = `translateY(${scrollY * speed}px)`;
    });
});

// Animación de entrada para las tarjetas
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, observerOptions);

// Observar elementos para animación de entrada
document.querySelectorAll('.reason-card, .detail-card, .dish-container').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    observer.observe(el);
});

// Función para abrir Google Maps
function openMap() {
    const address = 'Mercurio de Echeveste 129 Int. 11, Hacienda Echeveste';
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

    // Efecto de confeti antes de abrir el mapa
    createConfetti();

    setTimeout(() => {
        window.open(mapsUrl, '_blank');
    }, 500);
}

// Función de confirmación de asistencia
function confirmAttendance(response) {
    const modal = document.getElementById('confirmModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalIcon = document.querySelector('.modal-icon');

    if (response === 'yes') {
        modalIcon.textContent = '🎉';
        modalTitle.textContent = '¡Genial!';
        modalMessage.textContent = '¡Nos vemos el domingo para celebrar! 🍲💕';
        createConfetti();
    } else if (response === 'maybe') {
        modalIcon.textContent = '🤔';
        modalTitle.textContent = '¡Esperamos verte!';
        modalMessage.textContent = 'Esperamos que puedas acompañarnos. ¡Habrá mucho pozole!';
    }

    modal.style.display = 'block';

    // Animación de vibración en el modal
    const modalContent = document.querySelector('.modal-content');
    modalContent.style.animation = 'none';
    setTimeout(() => {
        modalContent.style.animation = 'modalEnter 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    }, 10);
}

// Cerrar modal
function closeModal() {
    const modal = document.getElementById('confirmModal');
    modal.style.animation = 'fadeOut 0.3s';

    setTimeout(() => {
        modal.style.display = 'none';
        modal.style.animation = 'fadeIn 0.3s';
    }, 300);
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('confirmModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Crear confeti
function createConfetti() {
    const confettiCount = 100;
    const confettiColors = ['#ff6b6b', '#4ecdc4', '#ffd93d', '#95e1d3', '#f38181', '#aa96da'];
    const confettiEmojis = ['🎉', '🎊', '✨', '💕', '⭐', '🎈'];

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-20px';
            confetti.style.fontSize = (Math.random() * 20 + 15) + 'px';
            confetti.style.zIndex = '10000';
            confetti.style.pointerEvents = 'none';
            confetti.style.userSelect = 'none';

            // Mezcla de emojis y formas
            if (Math.random() > 0.5) {
                confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
            } else {
                confetti.textContent = '●';
                confetti.style.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            }

            document.body.appendChild(confetti);

            const duration = Math.random() * 3 + 2;
            const rotations = Math.random() * 5 + 2;
            const xMovement = (Math.random() - 0.5) * 200;

            confetti.animate([
                {
                    transform: 'translateY(0) translateX(0) rotate(0deg)',
                    opacity: 1
                },
                {
                    transform: `translateY(${window.innerHeight + 100}px) translateX(${xMovement}px) rotate(${rotations * 360}deg)`,
                    opacity: 0
                }
            ], {
                duration: duration * 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });

            setTimeout(() => {
                confetti.remove();
            }, duration * 1000);
        }, i * 15);
    }
}

// Efecto de cursor personalizado con estela
const cursorTrail = [];
const trailLength = 10;

document.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 768) { // Solo en desktop
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + window.scrollY + 'px';
        document.body.appendChild(trail);

        cursorTrail.push(trail);

        if (cursorTrail.length > trailLength) {
            const oldTrail = cursorTrail.shift();
            oldTrail.remove();
        }

        setTimeout(() => {
            trail.style.opacity = '0';
            trail.style.transform = 'scale(0)';
            setTimeout(() => trail.remove(), 500);
        }, 100);
    }
});

// Añadir estilos del cursor trail
const style = document.createElement('style');
style.textContent = `
    .cursor-trail {
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        pointer-events: none;
        z-index: 9999;
        transition: all 0.5s;
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

// Efecto de "typing" en el título
const titleMain = document.querySelector('.title-main');
if (titleMain) {
    const text = titleMain.textContent;
    titleMain.textContent = '';
    titleMain.style.opacity = '1';

    let i = 0;
    const typingEffect = setInterval(() => {
        if (i < text.length) {
            titleMain.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typingEffect);
        }
    }, 100);
}

// Sonido al hacer hover en botones (simulado con vibración en móviles)
document.querySelectorAll('.rsvp-btn, .map-button').forEach(button => {
    button.addEventListener('mouseenter', () => {
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    });

    button.addEventListener('click', () => {
        if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100]);
        }
    });
});

// Efecto de rotación 3D en las tarjetas al mover el mouse
document.querySelectorAll('.reason-card, .dish-container').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// Efecto de revelación progresiva
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s';
        document.body.style.opacity = '1';
    }, 100);

    // Confeti de bienvenida
    setTimeout(() => {
        createConfetti();
    }, 1000);
});

// Actualizar altura del canvas cuando cambia el contenido
const resizeObserver = new ResizeObserver(() => {
    canvas.height = document.documentElement.scrollHeight;
});
resizeObserver.observe(document.body);

// Función para abrir Uber con el destino
function openUber() {
    const address = 'Mercurio de Echeveste 129 Int. 11, Hacienda Echeveste';
    const lat = '21.183568068517882'; // Latitud exacta de la dirección
    const lng = '-101.66613701310614'; // Longitud exacta de la dirección

    // Deep link de Uber con coordenadas para mejor precisión
    const uberAppUrl = `uber://?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${encodeURIComponent('Hacienda Echeveste')}&dropoff[formatted_address]=${encodeURIComponent(address)}`;

    // URL web de Uber como fallback
    const uberWebUrl = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${encodeURIComponent('Hacienda Echeveste')}&dropoff[formatted_address]=${encodeURIComponent(address)}`;

    // Efecto de confeti antes de abrir Uber
    createConfetti();

    setTimeout(() => {
        // Intentar abrir la app primero
        window.location.href = uberAppUrl;

        // Fallback a la web después de 1.5 segundos si no abrió la app
        setTimeout(() => {
            window.open(uberWebUrl, '_blank');
        }, 1500);
    }, 500);
}

// Función para abrir DiDi con el destino
function openDidi() {
    const lat = '21.183568068517882'; // Latitud exacta de la dirección
    const lng = '-101.66613701310614'; // Longitud exacta de la dirección

    // URL universal de DiDi que abre la app si está instalada
    const didiUrl = `https://api.didi.com.mx/redirect?lat=${lat}&lng=${lng}`;

    // Efecto de confeti antes de abrir DiDi
    createConfetti();

    setTimeout(() => {
        // Abrir DiDi
        window.open(didiUrl, '_blank');
    }, 500);
}

// Agregar vibración a los botones de transporte
document.querySelectorAll('.transport-btn').forEach(button => {
    button.addEventListener('mouseenter', () => {
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    });

    button.addEventListener('click', () => {
        if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100]);
        }
    });
});

// Efecto de animación para las tarjetas de pozole
document.querySelectorAll('.pozole-type').forEach(card => {
    card.addEventListener('click', () => {
        // Efecto de selección con confeti pequeño
        const confettiCount = 20;
        const confettiEmojis = card.classList.contains('pozole-rojo') ? ['🔴', '🌶️', '❤️'] : ['🟢', '🌿', '💚'];

        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.left = Math.random() * window.innerWidth + 'px';
                confetti.style.top = '-20px';
                confetti.style.fontSize = (Math.random() * 15 + 10) + 'px';
                confetti.style.zIndex = '10000';
                confetti.style.pointerEvents = 'none';
                confetti.style.userSelect = 'none';
                confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];

                document.body.appendChild(confetti);

                const duration = Math.random() * 2 + 1;
                const rotations = Math.random() * 3 + 1;
                const xMovement = (Math.random() - 0.5) * 100;

                confetti.animate([
                    {
                        transform: 'translateY(0) translateX(0) rotate(0deg)',
                        opacity: 1
                    },
                    {
                        transform: `translateY(${window.innerHeight + 100}px) translateX(${xMovement}px) rotate(${rotations * 360}deg)`,
                        opacity: 0
                    }
                ], {
                    duration: duration * 1000,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                });

                setTimeout(() => {
                    confetti.remove();
                }, duration * 1000);
            }, i * 10);
        }

        // Vibración en dispositivos móviles
        if ('vibrate' in navigator) {
            navigator.vibrate([50, 30, 50]);
        }
    });
});

// Reproductor de Música Flotante
const audioPlayer = document.getElementById('audioPlayer');
const musicFloatBtn = document.getElementById('musicFloatBtn');
const musicIcon = document.querySelector('.music-icon');

let isPlaying = false;
let hasStarted = false;

// Configurar volumen inicial
if (audioPlayer) {
    audioPlayer.volume = 0.6;

    // Detectar cuando el audio realmente empieza a reproducir
    audioPlayer.addEventListener('play', () => {
        isPlaying = true;
        hasStarted = true;
        musicFloatBtn.classList.add('playing');
        musicFloatBtn.classList.remove('paused');
    });

    audioPlayer.addEventListener('pause', () => {
        isPlaying = false;
        musicFloatBtn.classList.add('paused');
        musicFloatBtn.classList.remove('playing');
    });

    // Reproducir música con el primer click en cualquier parte de la página
    const startMusicOnFirstClick = () => {
        if (!hasStarted) {
            audioPlayer.play().then(() => {
                createConfetti();
                console.log('🎵 Música iniciada con el primer click');
            }).catch((error) => {
                console.log('No se pudo reproducir el audio:', error);
            });
            // Remover el listener después del primer click
            document.removeEventListener('click', startMusicOnFirstClick);
            document.removeEventListener('touchstart', startMusicOnFirstClick);
        }
    };

    // Escuchar el primer click o touch
    document.addEventListener('click', startMusicOnFirstClick);
    document.addEventListener('touchstart', startMusicOnFirstClick);
}

function toggleMusic() {
    // Siempre generar confeti al hacer click en el botón
    createConfetti();

    if (isPlaying) {
        audioPlayer.pause();
    } else {
        audioPlayer.play().catch((error) => {
            console.log('No se pudo reproducir el audio:', error);
        });
    }
}

// Control de teclado para el reproductor (tecla M)
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        toggleMusic();
    }
});

// Forzar recarga si la página está en caché
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        window.location.reload();
    }
});

console.log('🎉 ¡Invitación cargada con éxito! 🍲');
console.log('💕 Celebremos juntos el cumpleaños y aniversario de Arturo y Fabiola 💕');
console.log('🚗 Botones de Uber y DiDi disponibles para transporte fácil');
console.log('🍲 ¡Elige entre pozole rojo o verde!');
console.log('🎵 Reproductor de música "verso_1" disponible');
console.log('📅 Fecha actualizada: Domingo 19 de Octubre 2025');
