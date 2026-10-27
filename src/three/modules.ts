import * as THREE from 'three';
import {
  createBodyTexture,
  createMetalTexture,
  createPCBTexture,
  createSensorTexture,
  createLensMountTexture,
  createHeatSinkTexture,
  createARRIGreenTexture,
  createScreenTexture,
  createCodexTexture,
  createBatteryTexture,
  createViewfinderTexture,
  createConnectorTexture,
  createEmissiveGreenTexture,
} from './textures';

export interface CameraModule {
  name: string;
  nameCN: string;
  description: string;
  group: THREE.Group;
  originalPosition: THREE.Vector3;
  explodeDirection: THREE.Vector3;
  color: string;
}

// Module 1: Body Housing (机身外壳)
function createBodyHousing(): CameraModule {
  const group = new THREE.Group();
  const texture = createBodyTexture();
  
  // Main body - rounded box shape
  const bodyGeo = new THREE.BoxGeometry(3.2, 2.0, 2.4);
  const bodyMat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.7,
    metalness: 0.3,
    color: 0x2a2a2a,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);
  
  // Top plate
  const topGeo = new THREE.BoxGeometry(3.0, 0.1, 2.2);
  const topMat = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.5,
    metalness: 0.5,
  });
  const top = new THREE.Mesh(topGeo, topMat);
  top.position.y = 1.05;
  group.add(top);
  
  // Bottom plate
  const bottomGeo = new THREE.BoxGeometry(3.0, 0.1, 2.2);
  const bottom = new THREE.Mesh(bottomGeo, topMat);
  bottom.position.y = -1.05;
  group.add(bottom);
  
  // Side panels with ventilation
  const sideGeo = new THREE.BoxGeometry(0.08, 1.6, 2.0);
  const sideMat = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.8,
    metalness: 0.2,
  });
  const leftSide = new THREE.Mesh(sideGeo, sideMat);
  leftSide.position.x = -1.6;
  group.add(leftSide);
  
  const rightSide = new THREE.Mesh(sideGeo, sideMat);
  rightSide.position.x = 1.6;
  group.add(rightSide);
  
  // ARRI logo (green accent strip)
  const logoGeo = new THREE.BoxGeometry(0.8, 0.08, 0.08);
  const logoMat = new THREE.MeshStandardMaterial({
    color: 0x00c853,
    emissive: 0x00c853,
    emissiveIntensity: 0.5,
  });
  const logo = new THREE.Mesh(logoGeo, logoMat);
  logo.position.set(0, 0.9, 1.22);
  group.add(logo);
  
  // Handle mount on top
  const handleGeo = new THREE.BoxGeometry(0.4, 0.15, 0.8);
  const handleMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 });
  const handle = new THREE.Mesh(handleGeo, handleMat);
  handle.position.set(0, 1.15, 0);
  group.add(handle);
  
  // Handle grip
  const gripGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 12);
  const gripMat = new THREE.MeshStandardMaterial({ color: 0x333, roughness: 0.9 });
  const grip = new THREE.Mesh(gripGeo, gripMat);
  grip.rotation.z = Math.PI / 2;
  grip.position.set(0, 1.3, 0);
  group.add(grip);

  return {
    name: 'Body Housing',
    nameCN: '机身外壳',
    description: '镁合金机身框架，提供结构支撑与电磁屏蔽。IP53防护等级，适应恶劣拍摄环境。',
    group,
    originalPosition: new THREE.Vector3(0, 0, 0),
    explodeDirection: new THREE.Vector3(0, 0, 0),
    color: '#2a2a2a',
  };
}

// Module 2: Sensor Module (传感器模块)
function createSensorModule(): CameraModule {
  const group = new THREE.Group();
  const sensorTexture = createSensorTexture();
  
  // Sensor housing
  const housingGeo = new THREE.CylinderGeometry(0.6, 0.7, 0.5, 32);
  const housingMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.3,
    metalness: 0.8,
  });
  const housing = new THREE.Mesh(housingGeo, housingMat);
  housing.rotation.x = Math.PI / 2;
  group.add(housing);
  
  // Sensor chip
  const sensorGeo = new THREE.BoxGeometry(0.9, 0.9, 0.05);
  const sensorMat = new THREE.MeshStandardMaterial({
    map: sensorTexture,
    color: 0x2a1040,
    roughness: 0.2,
    metalness: 0.5,
  });
  const sensor = new THREE.Mesh(sensorGeo, sensorMat);
  sensor.position.z = 0.2;
  group.add(sensor);
  
  // Optical low-pass filter
  const filterGeo = new THREE.BoxGeometry(1.0, 1.0, 0.03);
  const filterMat = new THREE.MeshPhysicalMaterial({
    color: 0x4488aa,
    transparent: true,
    opacity: 0.4,
    roughness: 0.0,
    metalness: 0.1,
    transmission: 0.6,
  });
  const filter = new THREE.Mesh(filterGeo, filterMat);
  filter.position.z = 0.28;
  group.add(filter);
  
  // Sensor frame
  const frameGeo = new THREE.BoxGeometry(1.1, 1.1, 0.08);
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x444444,
    roughness: 0.4,
    metalness: 0.7,
  });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  frame.position.z = 0.15;
  group.add(frame);
  
  // Wire bonds (tiny details)
  for (let i = 0; i < 8; i++) {
    const wireGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.15, 4);
    const wireMat = new THREE.MeshStandardMaterial({ color: 0xffd700 });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    const angle = (i / 8) * Math.PI * 2;
    wire.position.set(Math.cos(angle) * 0.5, Math.sin(angle) * 0.5, 0.1);
    group.add(wire);
  }

  return {
    name: 'Sensor Module',
    nameCN: '传感器模块',
    description: 'ALEV III 4.6K CMOS传感器，Super 35格式(27.99mm x 19.22mm)，16bit线性输出，双原生ISO 800/3200。',
    group,
    originalPosition: new THREE.Vector3(0, 0, 1.5),
    explodeDirection: new THREE.Vector3(0, 0, 3),
    color: '#2a1040',
  };
}

// Module 3: Lens Mount (镜头卡口)
function createLensMount(): CameraModule {
  const group = new THREE.Group();
  const mountTexture = createLensMountTexture();
  
  // Mount ring - outer
  const outerRingGeo = new THREE.TorusGeometry(0.8, 0.12, 16, 32);
  const metalTexture = createMetalTexture();
  const mountMat = new THREE.MeshStandardMaterial({
    map: metalTexture,
    color: 0x555555,
    roughness: 0.3,
    metalness: 0.9,
  });
  const outerRing = new THREE.Mesh(outerRingGeo, mountMat);
  group.add(outerRing);
  
  // Mount ring - inner
  const innerRingGeo = new THREE.TorusGeometry(0.65, 0.05, 16, 32);
  const innerRing = new THREE.Mesh(innerRingGeo, mountMat);
  innerRing.position.z = 0.1;
  group.add(innerRing);
  
  // LPL mount flange
  const flangeGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.15, 32);
  const flangeMat = new THREE.MeshStandardMaterial({
    map: mountTexture,
    color: 0x444444,
    roughness: 0.4,
    metalness: 0.8,
  });
  const flange = new THREE.Mesh(flangeGeo, flangeMat);
  flange.rotation.x = Math.PI / 2;
  flange.position.z = -0.1;
  group.add(flange);
  
  // Bayonet locking pins
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const pinGeo = new THREE.BoxGeometry(0.08, 0.15, 0.2);
    const pin = new THREE.Mesh(pinGeo, mountMat);
    pin.position.set(Math.cos(angle) * 0.75, Math.sin(angle) * 0.75, -0.05);
    pin.rotation.z = angle;
    group.add(pin);
  }
  
  // Electronic contacts
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + 0.3;
    const contactGeo = new THREE.BoxGeometry(0.03, 0.08, 0.05);
    const contactMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      roughness: 0.1,
    });
    const contact = new THREE.Mesh(contactGeo, contactMat);
    contact.position.set(Math.cos(angle) * 0.6, Math.sin(angle) * 0.6, -0.15);
    group.add(contact);
  }
  
  // Release button
  const buttonGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.05, 12);
  const buttonMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7 });
  const button = new THREE.Mesh(buttonGeo, buttonMat);
  button.rotation.x = Math.PI / 2;
  button.position.set(0.7, -0.4, 0);
  group.add(button);

  return {
    name: 'Lens Mount',
    nameCN: '镜头卡口',
    description: 'ARRI LPL大画幅卡口，法兰距44mm，支持ARRI/PL镜头。可更换为其他卡口(LPL-to-LE, LPL-to-E等)。',
    group,
    originalPosition: new THREE.Vector3(0, 0, 2.2),
    explodeDirection: new THREE.Vector3(0, 0, 5),
    color: '#555555',
  };
}

// Module 4: Cooling System (散热系统)
function createCoolingSystem(): CameraModule {
  const group = new THREE.Group();
  const heatSinkTexture = createHeatSinkTexture();
  
  // Main heat sink block
  const sinkGeo = new THREE.BoxGeometry(1.5, 1.2, 0.3);
  const sinkMat = new THREE.MeshStandardMaterial({
    map: heatSinkTexture,
    color: 0x888888,
    roughness: 0.4,
    metalness: 0.8,
  });
  const sink = new THREE.Mesh(sinkGeo, sinkMat);
  group.add(sink);
  
  // Heat sink fins
  for (let i = 0; i < 12; i++) {
    const finGeo = new THREE.BoxGeometry(1.4, 0.02, 0.25);
    const finMat = new THREE.MeshStandardMaterial({
      color: 0x999999,
      roughness: 0.3,
      metalness: 0.9,
    });
    const fin = new THREE.Mesh(finGeo, finMat);
    fin.position.set(0, -0.55 + i * 0.1, 0);
    group.add(fin);
  }
  
  // Heat pipes
  for (let i = 0; i < 3; i++) {
    const pipeGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 8);
    const pipeMat = new THREE.MeshStandardMaterial({
      color: 0xb87333,
      roughness: 0.3,
      metalness: 0.8,
    });
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    pipe.rotation.z = Math.PI / 2;
    pipe.position.set(0, -0.3 + i * 0.3, 0.2);
    group.add(pipe);
  }
  
  // Fan
  const fanHousingGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.15, 24);
  const fanHousingMat = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.6,
  });
  const fanHousing = new THREE.Mesh(fanHousingGeo, fanHousingMat);
  fanHousing.rotation.x = Math.PI / 2;
  fanHousing.position.set(0.5, 0, -0.25);
  group.add(fanHousing);
  
  // Fan blades
  for (let i = 0; i < 7; i++) {
    const bladeGeo = new THREE.BoxGeometry(0.25, 0.02, 0.08);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    const angle = (i / 7) * Math.PI * 2;
    blade.position.set(
      0.5 + Math.cos(angle) * 0.15,
      Math.sin(angle) * 0.15,
      -0.25
    );
    blade.rotation.z = angle;
    group.add(blade);
  }

  return {
    name: 'Cooling System',
    nameCN: '散热系统',
    description: '高效散热系统，包含铜质热管、铝合金散热鳍片及静音风扇。确保长时间录制时传感器温度稳定。',
    group,
    originalPosition: new THREE.Vector3(-0.5, 0.3, -0.5),
    explodeDirection: new THREE.Vector3(-3, 2, -2),
    color: '#888888',
  };
}

// Module 5: Processing Board (处理电路板)
function createProcessingBoard(): CameraModule {
  const group = new THREE.Group();
  const pcbTexture = createPCBTexture();
  
  // Main PCB
  const pcbGeo = new THREE.BoxGeometry(2.4, 1.4, 0.08);
  const pcbMat = new THREE.MeshStandardMaterial({
    map: pcbTexture,
    roughness: 0.6,
    metalness: 0.2,
  });
  const pcb = new THREE.Mesh(pcbGeo, pcbMat);
  group.add(pcb);
  
  // Main processor (FPGA)
  const cpuGeo = new THREE.BoxGeometry(0.4, 0.4, 0.06);
  const cpuMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.3,
    metalness: 0.5,
  });
  const cpu = new THREE.Mesh(cpuGeo, cpuMat);
  cpu.position.set(-0.3, 0.2, 0.07);
  group.add(cpu);
  
  // CPU heat spreader
  const spreaderGeo = new THREE.BoxGeometry(0.35, 0.35, 0.02);
  const spreaderMat = new THREE.MeshStandardMaterial({
    color: 0x666666,
    metalness: 0.9,
    roughness: 0.2,
  });
  const spreader = new THREE.Mesh(spreaderGeo, spreaderMat);
  spreader.position.set(-0.3, 0.2, 0.11);
  group.add(spreader);
  
  // Memory chips
  for (let i = 0; i < 4; i++) {
    const memGeo = new THREE.BoxGeometry(0.2, 0.12, 0.04);
    const memMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const mem = new THREE.Mesh(memGeo, memMat);
    mem.position.set(0.4 + i * 0.25, 0.3, 0.06);
    group.add(mem);
  }
  
  // Capacitors
  for (let i = 0; i < 10; i++) {
    const capGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.08, 8);
    const capMat = new THREE.MeshStandardMaterial({
      color: i % 2 === 0 ? 0x333333 : 0x8B4513,
    });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(
      -0.8 + Math.random() * 1.6,
      -0.4 + Math.random() * 0.8,
      0.08
    );
    group.add(cap);
  }
  
  // Connectors
  const connGeo = new THREE.BoxGeometry(0.3, 0.1, 0.15);
  const connMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
  const conn1 = new THREE.Mesh(connGeo, connMat);
  conn1.position.set(1.0, -0.5, 0.1);
  group.add(conn1);
  
  const conn2 = new THREE.Mesh(connGeo, connMat);
  conn2.position.set(0.5, -0.5, 0.1);
  group.add(conn2);

  return {
    name: 'Processing Board',
    nameCN: '处理电路板',
    description: '主处理板，搭载FPGA图像处理器、DDR4内存及REVEAL色彩科学引擎。支持ARRI Wide Gamut 3 / LogC3 / LogC4。',
    group,
    originalPosition: new THREE.Vector3(0, -0.2, -0.3),
    explodeDirection: new THREE.Vector3(0, -3, -1),
    color: '#0a3d0a',
  };
}

// Module 6: Viewfinder (取景器)
function createViewfinder(): CameraModule {
  const group = new THREE.Group();
  
  // Viewfinder body
  const bodyGeo = new THREE.BoxGeometry(0.8, 0.6, 1.0);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.7,
    metalness: 0.3,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);
  
  // Eyepiece
  const eyeGeo = new THREE.CylinderGeometry(0.25, 0.3, 0.3, 24);
  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.8,
  });
  const eyepiece = new THREE.Mesh(eyeGeo, eyeMat);
  eyepiece.rotation.x = Math.PI / 2;
  eyepiece.position.z = -0.6;
  group.add(eyepiece);
  
  // Rubber eyecup
  const cupGeo = new THREE.TorusGeometry(0.25, 0.06, 8, 24);
  const cupMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.95,
  });
  const cup = new THREE.Mesh(cupGeo, cupMat);
  cup.position.z = -0.75;
  group.add(cup);
  
  // OLED micro display
  const displayGeo = new THREE.BoxGeometry(0.35, 0.2, 0.02);
  const displayMat = new THREE.MeshStandardMaterial({
    color: 0x001100,
    emissive: 0x003300,
    emissiveIntensity: 0.3,
  });
  const display = new THREE.Mesh(displayGeo, displayMat);
  display.position.z = 0.1;
  group.add(display);
  
  // Lens assembly
  const lensGeo = new THREE.CylinderGeometry(0.15, 0.2, 0.4, 16);
  const lensMat = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.6,
    roughness: 0.3,
  });
  const lens = new THREE.Mesh(lensGeo, lensMat);
  lens.rotation.x = Math.PI / 2;
  lens.position.z = 0.3;
  group.add(lens);
  
  // Diopter adjustment ring
  const diopterGeo = new THREE.TorusGeometry(0.22, 0.03, 8, 16);
  const diopterMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.7 });
  const diopter = new THREE.Mesh(diopterGeo, diopterMat);
  diopter.position.z = -0.3;
  group.add(diopter);
  
  // Mounting bracket
  const bracketGeo = new THREE.BoxGeometry(0.3, 0.4, 0.15);
  const bracketMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5 });
  const bracket = new THREE.Mesh(bracketGeo, bracketMat);
  bracket.position.set(0, -0.3, 0.5);
  group.add(bracket);

  return {
    name: 'Viewfinder',
    nameCN: '取景器',
    description: 'ARRI MVF-2取景器，内置1920x1080 OLED微显示器，支持眼罩和折叠监视器两种使用模式。',
    group,
    originalPosition: new THREE.Vector3(0.8, 0.8, 0),
    explodeDirection: new THREE.Vector3(3, 3, 0),
    color: '#1a1a1a',
  };
}

// Module 7: Media/Codex Module (存储模块)
function createMediaModule(): CameraModule {
  const group = new THREE.Group();
  const codexTexture = createCodexTexture();
  
  // Codex drive body
  const driveGeo = new THREE.BoxGeometry(0.8, 0.5, 1.2);
  const driveMat = new THREE.MeshStandardMaterial({
    map: codexTexture,
    color: 0x1a1a1a,
    roughness: 0.6,
    metalness: 0.3,
  });
  const drive = new THREE.Mesh(driveGeo, driveMat);
  group.add(drive);
  
  // Top label
  const labelGeo = new THREE.BoxGeometry(0.7, 0.01, 1.0);
  const labelMat = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.5,
  });
  const label = new THREE.Mesh(labelGeo, labelMat);
  label.position.y = 0.26;
  group.add(label);
  
  // Green ARRI accent stripe
  const stripeGeo = new THREE.BoxGeometry(0.75, 0.02, 0.05);
  const stripeMat = new THREE.MeshStandardMaterial({
    color: 0x00c853,
    emissive: 0x00c853,
    emissiveIntensity: 0.3,
  });
  const stripe = new THREE.Mesh(stripeGeo, stripeMat);
  stripe.position.set(0, 0.27, -0.4);
  group.add(stripe);
  
  // Connector pins
  const pinsGeo = new THREE.BoxGeometry(0.5, 0.05, 0.1);
  const pinsMat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.9,
    roughness: 0.1,
  });
  const pins = new THREE.Mesh(pinsGeo, pinsMat);
  pins.position.set(0, -0.2, 0.6);
  group.add(pins);
  
  // Status LED
  const ledGeo = new THREE.SphereGeometry(0.03, 8, 8);
  const ledMat = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    emissive: 0x00ff00,
    emissiveIntensity: 1.0,
  });
  const led = new THREE.Mesh(ledGeo, ledMat);
  led.position.set(0.3, 0.2, 0.4);
  group.add(led);

  return {
    name: 'Media / Codex',
    nameCN: '存储模块',
    description: 'Codex Compact Drive存储模块，2TB NVMe SSD，支持ARRI ProRes 422/444及ARRIRAW录制，最高读写速度1000MB/s。',
    group,
    originalPosition: new THREE.Vector3(1.2, -0.3, 0),
    explodeDirection: new THREE.Vector3(4, -1, 0),
    color: '#1a1a1a',
  };
}

// Module 8: Power Module (电源模块)
function createPowerModule(): CameraModule {
  const group = new THREE.Group();
  const batteryTexture = createBatteryTexture();
  
  // Battery body
  const battGeo = new THREE.BoxGeometry(1.2, 1.0, 0.8);
  const battMat = new THREE.MeshStandardMaterial({
    map: batteryTexture,
    color: 0x222222,
    roughness: 0.7,
    metalness: 0.2,
  });
  const battery = new THREE.Mesh(battGeo, battMat);
  group.add(battery);
  
  // Battery contacts
  const contactGeo = new THREE.BoxGeometry(0.08, 0.3, 0.05);
  const contactMat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.9,
    roughness: 0.1,
  });
  for (let i = 0; i < 3; i++) {
    const contact = new THREE.Mesh(contactGeo, contactMat);
    contact.position.set(-0.3 + i * 0.3, 0, 0.42);
    group.add(contact);
  }
  
  // Battery latch
  const latchGeo = new THREE.BoxGeometry(0.4, 0.08, 0.1);
  const latchMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.6 });
  const latch = new THREE.Mesh(latchGeo, latchMat);
  latch.position.set(0, -0.45, 0.35);
  group.add(latch);
  
  // Voltage display
  const displayGeo = new THREE.BoxGeometry(0.3, 0.15, 0.01);
  const displayMat = new THREE.MeshStandardMaterial({
    color: 0x001100,
    emissive: 0x003300,
    emissiveIntensity: 0.5,
  });
  const display = new THREE.Mesh(displayGeo, displayMat);
  display.position.set(0.3, 0.35, 0.41);
  group.add(display);
  
  // Power regulation board
  const regGeo = new THREE.BoxGeometry(0.8, 0.5, 0.06);
  const regMat = new THREE.MeshStandardMaterial({
    color: 0x0a3d0a,
    roughness: 0.6,
  });
  const reg = new THREE.Mesh(regGeo, regMat);
  reg.position.set(0, 0, -0.43);
  group.add(reg);

  return {
    name: 'Power Module',
    nameCN: '电源模块',
    description: 'B-Mount电池接口，支持24V/28V输入。460Wh电池可提供约2小时拍摄续航。内置电源管理系统。',
    group,
    originalPosition: new THREE.Vector3(-1.2, -0.5, 0),
    explodeDirection: new THREE.Vector3(-4, -2, 0),
    color: '#222222',
  };
}

// Module 9: Control Panel (控制面板)
function createControlPanel(): CameraModule {
  const group = new THREE.Group();
  const screenTexture = createScreenTexture();
  
  // Panel base
  const panelGeo = new THREE.BoxGeometry(1.8, 1.0, 0.15);
  const panelMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.6,
    metalness: 0.3,
  });
  const panel = new THREE.Mesh(panelGeo, panelMat);
  group.add(panel);
  
  // LCD Display
  const displayGeo = new THREE.BoxGeometry(1.0, 0.6, 0.02);
  const displayMat = new THREE.MeshStandardMaterial({
    map: screenTexture,
    emissive: 0x003322,
    emissiveIntensity: 0.3,
  });
  const display = new THREE.Mesh(displayGeo, displayMat);
  display.position.set(-0.2, 0.1, 0.09);
  group.add(display);
  
  // Menu buttons
  const buttonPositions = [
    { x: 0.5, y: 0.3 },
    { x: 0.7, y: 0.3 },
    { x: 0.5, y: 0.1 },
    { x: 0.7, y: 0.1 },
    { x: 0.5, y: -0.1 },
    { x: 0.7, y: -0.1 },
  ];
  
  buttonPositions.forEach(pos => {
    const btnGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.03, 12);
    const btnMat = new THREE.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.4,
      metalness: 0.6,
    });
    const btn = new THREE.Mesh(btnGeo, btnMat);
    btn.rotation.x = Math.PI / 2;
    btn.position.set(pos.x, pos.y, 0.09);
    group.add(btn);
  });
  
  // Record button (red)
  const recBtnGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16);
  const recBtnMat = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    emissive: 0xff0000,
    emissiveIntensity: 0.3,
  });
  const recBtn = new THREE.Mesh(recBtnGeo, recBtnMat);
  recBtn.rotation.x = Math.PI / 2;
  recBtn.position.set(-0.7, -0.3, 0.09);
  group.add(recBtn);
  
  // Jog dial
  const jogGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.04, 24);
  const jogMat = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.3,
    metalness: 0.7,
  });
  const jog = new THREE.Mesh(jogGeo, jogMat);
  jog.rotation.x = Math.PI / 2;
  jog.position.set(0.6, -0.3, 0.09);
  group.add(jog);
  
  // Jog dial center dot
  const dotGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.05, 8);
  const dotMat = new THREE.MeshStandardMaterial({ color: 0x00c853 });
  const dot = new THREE.Mesh(dotGeo, dotMat);
  dot.rotation.x = Math.PI / 2;
  dot.position.set(0.6, -0.3, 0.1);
  group.add(dot);
  
  // Connector panel (side)
  const connPanelGeo = new THREE.BoxGeometry(0.1, 0.8, 0.6);
  const connPanelMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const connPanel = new THREE.Mesh(connPanelGeo, connPanelMat);
  connPanel.position.set(-0.95, 0, 0);
  group.add(connPanel);
  
  // Connector ports
  const portLabels = ['SDI', 'TC', 'USB', 'ETH'];
  portLabels.forEach((_, i) => {
    const portGeo = new THREE.BoxGeometry(0.12, 0.12, 0.15);
    const portMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const port = new THREE.Mesh(portGeo, portMat);
    port.position.set(-0.95, 0.25 - i * 0.18, 0);
    group.add(port);
  });

  return {
    name: 'Control Panel',
    nameCN: '控制面板',
    description: '集成控制面板，包含1.4英寸OLED状态显示屏、菜单按键、录制按钮、旋钮及SDI/TC/USB/以太网接口。',
    group,
    originalPosition: new THREE.Vector3(0, 0, 1.25),
    explodeDirection: new THREE.Vector3(0, 0, 4),
    color: '#1a1a1a',
  };
}

// Create all modules
export function createAllModules(): CameraModule[] {
  return [
    createBodyHousing(),
    createSensorModule(),
    createLensMount(),
    createCoolingSystem(),
    createProcessingBoard(),
    createViewfinder(),
    createMediaModule(),
    createPowerModule(),
    createControlPanel(),
  ];
}
