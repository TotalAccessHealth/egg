// Define configurations for each state
const stateConfigs = {
    init: [
        { color: '#00B67A', peaks: 2, maxAmplitude: 40, speed: 0.4 },
        { color: '#FFFFFF', peaks: 3, maxAmplitude: 35, speed: 0.3 },
        { color: '#FFD556', peaks: 4, maxAmplitude: 20, speed: 0.7 }
    ],
    type: [
        { color: '#00B67A', peaks: 2, maxAmplitude: 70, speed: 0.8 },
        { color: '#FFFFFF', peaks: 3, maxAmplitude: 55, speed: 1 },
        { color: '#FFD556', peaks: 4, maxAmplitude: 30, speed: 1.2 }
    ],
    search: [
        { color: '#00B67A', peaks: 5, maxAmplitude: 30, speed: 1 },
        { color: '#FFFFFF', peaks: 7, maxAmplitude: 25, speed: 1.3 },
        { color: '#FFD556', peaks: 4, maxAmplitude: 40, speed: 1.7 }
    ]
};

// Select all canvases with the class 'egg'
let wrappers = document.querySelectorAll('.egg');
wrappers.forEach(wrapper => {
    let state = wrapper.getAttribute('data-state');
    let colors = wrapper.getAttribute('data-colors');
    let canvas = document.createElement('canvas');
    canvas.setAttribute('data-state', state);
    canvas.setAttribute('data-colors', colors);
    wrapper.appendChild(canvas);
});
const canvases = document.querySelectorAll('.egg canvas');

canvases.forEach(canvas => {
    const ctx = canvas.getContext('2d');
    const scale = window.devicePixelRatio;
    canvas.width = 500 * scale;
    canvas.height = 500 * scale;
    ctx.scale(scale, scale);

    const centerX = canvas.width / 2 / scale;
    const centerY = canvas.height / 2 / scale;
    const baseRadius = 150;

    let animationFrameId;

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-state') {
                // Cancel the current animation frame
                cancelAnimationFrame(animationFrameId);
                // Start a new animation with the updated state
                startAnimation();
            }
        });
    });

    observer.observe(canvas, { attributes: true, attributeFilter: ['data-state'] });

    function startAnimation() {
        let state = canvas.getAttribute('data-state');
        if (!state) {
            state = 'init';
        }
        let colors = canvas.getAttribute('data-colors');
        let linesConfig = stateConfigs[state]; // Get configuration based on the canvas state
        let time = 0; // Reset time for animation

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

            // Draw each line according to its configuration
            linesConfig.forEach(({ color, peaks, maxAmplitude, speed }) => {
                let amplitude = maxAmplitude * Math.sin(time * speed);

                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.lineWidth = 8;

                for (let angle = 0; angle <= 2 * Math.PI; angle += 0.01) {
                    let radius = baseRadius + amplitude * Math.sin(peaks * angle);
                    let x = centerX + radius * Math.cos(angle);
                    let y = centerY + radius * Math.sin(angle);

                    if (angle === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }

                ctx.closePath();
                ctx.stroke();
            });

            time += 0.05; // Increment time for the next frame
            animationFrameId = requestAnimationFrame(draw); // Request next frame for animation
        }

        draw(); // Start the animation for this canvas
    }

    startAnimation(); // Initially start the animation
});
