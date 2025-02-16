import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [palettes, setPalettes] = useState([]);
  const [selectedPalette, setSelectedPalette] = useState(null);
  const [showFullColor, setShowFullColor] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    console.log('Завантаження палітр...');
    fetch('./pallete.json')
      .then(response => {
        console.log('Відповідь отримана:', response);
        if (!response.ok) {
          throw new Error(`Помилка HTTP! статус: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Дані завантажено:', data);
        console.log('Кількість палітр:', data.length);
        console.log('First palette:', JSON.stringify(data[0], null, 2));
        setPalettes(data);
      })
      .catch(error => {
        console.error('Помилка завантаження палітр:', error);
      });
  }, []);

  useEffect(() => {
    console.log('Current palettes:', palettes);
  }, [palettes]);

  const handleColorClick = (color) => {
    setShowFullColor(color);
    setShowNotification(true);
    
    navigator.clipboard.writeText(color.hex)
      .then(() => {
        console.log('Колір скопійовано:', color.hex);
      })
      .catch(err => {
        console.error('Не вдалося скопіювати колір:', err);
      });
    
    const audio = new Audio('./src_notify.mp3');
    audio.play()
      .catch(err => {
        console.error('Не вдалося відтворити звук:', err);
      });

    setTimeout(() => {
      setShowFullColor(null);
      setShowNotification(false);
    }, 1500);
  };

  return (
    <div className="App">
      <header>
        <h1>FLAT UI COLORS 2</h1>
        <div>Designer Inspiration</div>
      </header>

      {!selectedPalette && (
        <main>
          <div className="palettes-grid">
            {palettes.length === 0 ? (
              <div className="loading">Loading palettes...</div>
            ) : (
              palettes.map((palette, index) => (
                <div 
                  key={index} 
                  className="palette-card"
                  onClick={() => setSelectedPalette(palette)}
                >
                  <div className="palette-preview">
                    {palette.colors.slice(0, 10).map((color, colorIndex) => (
                      <div 
                        key={colorIndex}
                        style={{ 
                          backgroundColor: color.hex
                        }}
                      />
                    ))}
                  </div>
                  <div className="palette-info">
                    <div className="palette-name">{palette.name}</div>
                    <div className="palette-country">{palette.country || 'US'}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      )}

      {selectedPalette && (
        <div className="color-screen">
          <button 
            className="back-button"
            onClick={() => setSelectedPalette(null)}
          >
            ← Back
          </button>
          <div className="colors-grid">
            {selectedPalette.colors.map((color, index) => (
              <div
                key={index}
                className="color-item"
                style={{ backgroundColor: color.hex }}
                onClick={() => handleColorClick(color)}
              >
                <div className="color-name">{color.name}</div>
                <div className="color-hex">{color.hex}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showFullColor && (
        <div 
          className="full-color"
          style={{ 
            backgroundColor: showFullColor.hex,
            display: 'flex' 
          }}
        >
          <span className="color-code">{showFullColor.hex}</span>
        </div>
      )}

      {showNotification && (
        <div className="copy-notification">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
}

export default App;
