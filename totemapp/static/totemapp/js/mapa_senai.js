document.addEventListener('DOMContentLoaded', () => {
    const imagemFundo = document.querySelector('.imagem-acima');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const pontoInicialBtn = document.getElementById('ponto-inicial');

    let zoomLevel = 1;
    let posX = 0;
    let posY = 0;
    let isMovable = false;

    function updatePosition() {
        imagemFundo.style.transform = `translate(${posX}px, ${posY}px) scale(${zoomLevel})`;
    }

    function updateZoom() {
        imagemFundo.style.transformOrigin = "center center";
        updatePosition();
    }

    function resetView() {
        imagemFundo.style.transition = "transform 0.4s ease"; // Suaviza o retorno ao centro
        zoomLevel = 1;
        posX = 0;
        posY = 0;
        updatePosition();
        setTimeout(() => {
            imagemFundo.style.transition = ""; // Remove a transição para o próximo arraste
        }, 400);
    }

    zoomInBtn.addEventListener('click', () => {
        zoomLevel = Math.min(zoomLevel + 0.1, 2);
        updateZoom();
    });

    zoomOutBtn.addEventListener('click', () => {
        zoomLevel = Math.max(zoomLevel - 0.1, 0.5);
        updateZoom();
    });

    pontoInicialBtn.addEventListener('click', resetView);

    imagemFundo.addEventListener('click', () => {
        isMovable = !isMovable;
        imagemFundo.style.cursor = isMovable ? 'grab' : 'pointer';
        if (!isMovable) {
            resetView();
        }
    });

    imagemFundo.addEventListener('mousedown', (event) => {
        if (!isMovable) return;

        let startX = event.clientX;
        let startY = event.clientY;

        imagemFundo.style.cursor = 'grabbing';

        const onMouseMove = (moveEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;

            posX += deltaX;
            posY += deltaY;

            updatePosition();

            startX = moveEvent.clientX;
            startY = moveEvent.clientY;
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            imagemFundo.style.cursor = 'grab';
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    resetView();
});