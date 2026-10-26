import * as THREE from 'three';

// Create a canvas-based procedural texture
function createCanvasTexture(
  width: number,
  height: number,
  drawFn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  drawFn(ctx, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ARRI ALEXA 35 body texture - dark gray with subtle grain
export function createBodyTexture(): THREE.CanvasTexture {
  return createCanvasTexture(512, 512, (ctx, w, h) => {
    // Base dark gray
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, w, h);
    
    // Add subtle noise/grain
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const brightness = Math.random() * 20 + 30;
      ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
      ctx.fillRect(x, y, 1, 1);
    }
    
    // Add subtle panel lines
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for (let y = 0; y < h; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  });
}

// Metal brushed texture
export function createMetalTexture(): THREE.CanvasTexture {
  return createCanvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(0, 0, w, h);
    
    // Brushed metal lines
    for (let i = 0; i < 200; i++) {
      const y = Math.random() * h;
      const alpha = Math.random() * 0.3;
      ctx.strokeStyle = `rgba(180, 180, 180, ${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y + (Math.random() - 0.5) * 2);
      ctx.stroke();
    }
  });
}

// PCB (circuit board) texture
export function createPCBTexture(): THREE.CanvasTexture {
  return createCanvasTexture(512, 512, (ctx, w, h) => {
    // Dark green PCB base
    ctx.fillStyle = '#0a3d0a';
    ctx.fillRect(0, 0, w, h);
    
    // Copper traces
    ctx.strokeStyle = '#b87333';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      let x = Math.random() * w;
      let y = Math.random() * h;
      ctx.moveTo(x, y);
      for (let j = 0; j < 5; j++) {
        if (Math.random() > 0.5) {
          x += (Math.random() - 0.5) * 80;
        } else {
          y += (Math.random() - 0.5) * 80;
        }
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    
    // Solder pads
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      ctx.fillStyle = '#c0a040';
      ctx.beginPath();
      ctx.arc(x, y, 3 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // IC chips
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * (w - 40) + 20;
      const y = Math.random() * (h - 30) + 15;
      const chipW = 20 + Math.random() * 30;
      const chipH = 15 + Math.random() * 20;
      ctx.fillStyle = '#111';
      ctx.fillRect(x - chipW / 2, y - chipH / 2, chipW, chipH);
      ctx.fillStyle = '#333';
      ctx.font = '6px monospace';
      ctx.fillText('IC', x - 5, y + 2);
    }
    
    // Small components (resistors, capacitors)
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      ctx.fillStyle = Math.random() > 0.5 ? '#8B4513' : '#333';
      ctx.fillRect(x - 3, y - 1.5, 6, 3);
    }
  });
}

// Sensor texture - silicon wafer look
export function createSensorTexture(): THREE.CanvasTexture {
  return createCanvasTexture(256, 256, (ctx, w, h) => {
    // Dark silicon base
    ctx.fillStyle = '#1a0a2a';
    ctx.fillRect(0, 0, w, h);
    
    // Pixel grid pattern
    const pixelSize = 4;
    for (let x = 0; x < w; x += pixelSize) {
      for (let y = 0; y < h; y += pixelSize) {
        const r = Math.random();
        if (r < 0.33) {
          ctx.fillStyle = '#2a1040'; // Red filter
        } else if (r < 0.66) {
          ctx.fillStyle = '#102a40'; // Blue filter
        } else {
          ctx.fillStyle = '#104020'; // Green filter
        }
        ctx.fillRect(x, y, pixelSize - 0.5, pixelSize - 0.5);
      }
    }
    
    // Center active area highlight
    const cx = w / 2, cy = h / 2;
    const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 100);
    grad.addColorStop(0, 'rgba(100, 50, 150, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  });
}

// Lens mount texture - machined metal
export function createLensMountTexture(): THREE.CanvasTexture {
  return createCanvasTexture(256, 256, (ctx, w, h) => {
    // Dark metal base
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, w, h);
    
    // Concentric machining marks
    const cx = w / 2, cy = h / 2;
    for (let r = 10; r < w / 2; r += 3) {
      ctx.strokeStyle = `rgba(100, 100, 100, ${0.2 + Math.random() * 0.2})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Bayonet mount notches
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      const x = cx + Math.cos(angle) * (w * 0.35);
      const y = cy + Math.sin(angle) * (h * 0.35);
      ctx.fillStyle = '#555';
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

// Heat sink texture
export function createHeatSinkTexture(): THREE.CanvasTexture {
  return createCanvasTexture(256, 256, (ctx, w, h) => {
    // Aluminum base
    ctx.fillStyle = '#888';
    ctx.fillRect(0, 0, w, h);
    
    // Fin pattern
    const finWidth = 8;
    for (let x = 0; x < w; x += finWidth * 2) {
      ctx.fillStyle = '#666';
      ctx.fillRect(x, 0, finWidth, h);
      ctx.fillStyle = '#aaa';
      ctx.fillRect(x + finWidth, 0, finWidth, h);
    }
  });
}

// ARRI green accent texture
export function createARRIGreenTexture(): THREE.CanvasTexture {
  return createCanvasTexture(128, 128, (ctx, w, h) => {
    ctx.fillStyle = '#00c853';
    ctx.fillRect(0, 0, w, h);
    
    // Subtle gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, 'rgba(255,255,255,0.1)');
    grad.addColorStop(1, 'rgba(0,0,0,0.1)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  });
}

// Display/screen texture
export function createScreenTexture(): THREE.CanvasTexture {
  return createCanvasTexture(256, 128, (ctx, w, h) => {
    // Dark screen
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);
    
    // Timecode display
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('01:23:45:12', 20, 40);
    
    // FPS indicator
    ctx.font = '14px monospace';
    ctx.fillText('23.976 fps', 20, 65);
    
    // Resolution
    ctx.fillText('4.6K (4608 x 2592)', 20, 85);
    
    // Battery indicator
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(180, 10, 50, 15);
    ctx.fillStyle = '#003322';
    ctx.fillRect(182, 12, 46, 11);
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(182, 12, 35, 11);
    
    // ARRI logo text
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('ARRI', 20, 110);
    ctx.fillText('ALEXA 35', 70, 110);
  });
}

// Codex media texture
export function createCodexTexture(): THREE.CanvasTexture {
  return createCanvasTexture(256, 256, (ctx, w, h) => {
    // Dark plastic
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, w, h);
    
    // Label area
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(20, 20, w - 40, h - 40);
    
    // ARRI Codex label
    ctx.fillStyle = '#00c853';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('CODEX', 60, 60);
    
    ctx.fillStyle = '#888';
    ctx.font = '12px monospace';
    ctx.fillText('2TB NVMe', 60, 85);
    ctx.fillText('Compact Drive', 60, 105);
    
    // Capacity bar
    ctx.fillStyle = '#333';
    ctx.fillRect(40, 140, w - 80, 20);
    ctx.fillStyle = '#00c853';
    ctx.fillRect(40, 140, (w - 80) * 0.6, 20);
    
    // Serial number
    ctx.fillStyle = '#555';
    ctx.font = '8px monospace';
    ctx.fillText('SN: CDX-2048-A35-001', 40, 190);
  });
}

// Battery texture
export function createBatteryTexture(): THREE.CanvasTexture {
  return createCanvasTexture(256, 256, (ctx, w, h) => {
    // Dark gray battery body
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, w, h);
    
    // Battery label
    ctx.fillStyle = '#333';
    ctx.fillRect(20, 30, w - 40, h - 60);
    
    // ARRI branding
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('ARRI', 80, 80);
    
    // Battery specs
    ctx.fillStyle = '#aaa';
    ctx.font = '12px monospace';
    ctx.fillText('Battery Block', 50, 110);
    ctx.fillText('26V / 460Wh', 60, 135);
    ctx.fillText('B-MOUNT', 75, 160);
    
    // Voltage indicator
    ctx.fillStyle = '#00c853';
    ctx.beginPath();
    ctx.arc(w / 2, 200, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('26V', w / 2 - 15, 205);
  });
}

// Viewfinder texture
export function createViewfinderTexture(): THREE.CanvasTexture {
  return createCanvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, w, h);
    
    // Eyepiece
    const cx = w / 2, cy = h / 2;
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath();
    ctx.arc(cx, cy, 60, 0, Math.PI * 2);
    ctx.fill();
    
    // Lens elements
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 45, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, Math.PI * 2);
    ctx.stroke();
    
    // Rubber grip texture
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      ctx.strokeStyle = '#2a2a2a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * 55, cy + Math.sin(angle) * 55);
      ctx.lineTo(cx + Math.cos(angle) * 65, cy + Math.sin(angle) * 65);
      ctx.stroke();
    }
  });
}

// Connector texture
export function createConnectorTexture(): THREE.CanvasTexture {
  return createCanvasTexture(128, 128, (ctx, w, h) => {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, w, h);
    
    // Port openings
    const ports = [
      { x: 30, y: 30, label: 'SDI' },
      { x: 90, y: 30, label: 'TC' },
      { x: 30, y: 80, label: 'USB' },
      { x: 90, y: 80, label: 'ETH' },
    ];
    
    ports.forEach(port => {
      ctx.fillStyle = '#111';
      ctx.fillRect(port.x - 12, port.y - 8, 24, 16);
      ctx.fillStyle = '#555';
      ctx.font = '7px monospace';
      ctx.fillText(port.label, port.x - 8, port.y + 3);
    });
  });
}

// Emissive green texture for ARRI branding
export function createEmissiveGreenTexture(): THREE.CanvasTexture {
  return createCanvasTexture(64, 64, (ctx, w, h) => {
    ctx.fillStyle = '#00c853';
    ctx.fillRect(0, 0, w, h);
  });
}
