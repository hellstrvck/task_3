let palettes = [];

async function loadPalettes() {
    try {
        const response = await fetch('palette.json');
        palettes = await response.json();
        displayPalettes();
    } catch (error) {
        console.error('Помилка завантаження палітр:', error);
    }
}

function displayPalettes() {
    const grid = document.getElementById('palettesGrid');
    
    palettes.forEach(palette => {
        const card = document.createElement('div');
        card.className = 'palette-card';
        card.onclick = () => showColors(palette);

        const preview = document.createElement('div');
        preview.className = 'palette-preview';
        
        
        palette.colors.slice(0, 5).forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.style.backgroundColor = color.hex;
            preview.appendChild(colorDiv);
        });

        const name = document.createElement('div');
        name.className = 'palette-name';
        name.textContent = palette.name;

        card.appendChild(preview);
        card.appendChild(name);
        grid.appendChild(card);
    });
}

function showColors(palette) {
    const colorScreen = document.getElementById('colorScreen');
    const colorsGrid = document.getElementById('colorsGrid');
    colorsGrid.innerHTML = '';

    palette.colors.forEach(color => {
        const colorItem = document.createElement('div');
        colorItem.className = 'color-item';
        colorItem.style.backgroundColor = color.hex;
        colorItem.textContent = color.name;
        colorItem.onclick = () => showFullColor(color);
        colorsGrid.appendChild(colorItem);
    });

    colorScreen.style.display = 'block';
}

function showFullColor(color) {
    const fullColor = document.getElementById('fullColor');
    const colorCode = document.getElementById('colorCode');
    const clickSound = document.getElementById('clickSound');

    fullColor.style.backgroundColor = color.hex;
    colorCode.textContent = color.hex;
    fullColor.style.display = 'flex';

    
    navigator.clipboard.writeText(color.hex);
    
    
    clickSound.play();

    
    setTimeout(() => {
        fullColor.style.display = 'none';
    }, 1500);
}

document.getElementById('backButton').onclick = () => {
    document.getElementById('colorScreen').style.display = 'none';
};


loadPalettes(); 