import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CameraModule, createAllModules } from './modules';

export class SceneManager {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  modules: CameraModule[];
  animationId: number | null = null;
  explodeProgress: number = 0;
  targetExplode: number = 0;
  selectedModule: number = -1;
  hoveredModule: number = -1;
  autoRotate: boolean = true;
  clock: THREE.Clock;
  container: HTMLElement;
  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;
  moduleMaterials: Map<number, THREE.Material[]> = new Map();

  constructor(container: HTMLElement) {
    this.container = container;
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0f);
    this.scene.fog = new THREE.Fog(0x0a0a0f, 15, 30);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    this.camera.position.set(5, 3, 7);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    container.appendChild(this.renderer.domElement);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 20;
    this.controls.target.set(0, 0, 0);

    // Lights
    this.setupLights();

    // Grid
    this.setupGrid();

    // Create modules
    this.modules = createAllModules();
    this.setupModules();

    // Events
    window.addEventListener('resize', this.onResize.bind(this));
    container.addEventListener('mousemove', this.onMouseMove.bind(this));
    container.addEventListener('click', this.onClick.bind(this));

    // Start animation
    this.animate();
  }

  setupLights() {
    // Ambient light
    const ambient = new THREE.AmbientLight(0x404060, 0.5);
    this.scene.add(ambient);

    // Main key light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 30;
    keyLight.shadow.camera.left = -10;
    keyLight.shadow.camera.right = 10;
    keyLight.shadow.camera.top = 10;
    keyLight.shadow.camera.bottom = -10;
    this.scene.add(keyLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0x4488ff, 0.4);
    fillLight.position.set(-5, 3, -5);
    this.scene.add(fillLight);

    // Rim light
    const rimLight = new THREE.DirectionalLight(0x00c853, 0.3);
    rimLight.position.set(0, -2, -5);
    this.scene.add(rimLight);

    // Point lights for highlights
    const pointLight1 = new THREE.PointLight(0x00c853, 0.5, 10);
    pointLight1.position.set(3, 2, 3);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x4488ff, 0.3, 10);
    pointLight2.position.set(-3, 1, -3);
    this.scene.add(pointLight2);
  }

  setupGrid() {
    // Ground plane
    const groundGeo = new THREE.PlaneGeometry(30, 30);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x080810,
      roughness: 0.9,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2.5;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Grid helper
    const grid = new THREE.GridHelper(20, 40, 0x111122, 0x111122);
    grid.position.y = -2.49;
    this.scene.add(grid);
  }

  setupModules() {
    this.modules.forEach((module, index) => {
      module.group.position.copy(module.originalPosition);
      
      // Store original materials
      const materials: THREE.Material[] = [];
      module.group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          materials.push(child.material as THREE.Material);
        }
      });
      this.moduleMaterials.set(index, materials);
      
      this.scene.add(module.group);
    });
  }

  setExplodeProgress(value: number) {
    this.targetExplode = value;
  }

  selectModule(index: number) {
    this.selectedModule = index;
    this.updateModuleHighlights();
  }

  updateModuleHighlights() {
    this.modules.forEach((module, index) => {
      const isSelected = index === this.selectedModule;
      const isHovered = index === this.hoveredModule;
      
      module.group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.MeshStandardMaterial;
          if (isSelected) {
            mat.emissive = new THREE.Color(0x00c853);
            mat.emissiveIntensity = 0.3;
          } else if (isHovered) {
            mat.emissive = new THREE.Color(0x00c853);
            mat.emissiveIntensity = 0.15;
          } else {
            if (mat.userData.originalEmissive) {
              mat.emissive = mat.userData.originalEmissive;
              mat.emissiveIntensity = mat.userData.originalEmissiveIntensity || 0;
            } else {
              mat.emissiveIntensity = mat.emissiveIntensity > 0 ? mat.emissiveIntensity : 0;
            }
          }
        }
      });
    });
  }

  onMouseMove(event: MouseEvent) {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    let foundModule = -1;
    for (let i = 0; i < this.modules.length; i++) {
      const intersects = this.raycaster.intersectObjects(
        this.modules[i].group.children,
        true
      );
      if (intersects.length > 0) {
        foundModule = i;
        break;
      }
    }
    
    if (foundModule !== this.hoveredModule) {
      this.hoveredModule = foundModule;
      this.updateModuleHighlights();
      this.container.style.cursor = foundModule >= 0 ? 'pointer' : 'default';
    }
  }

  onClick(event: MouseEvent) {
    if (this.hoveredModule >= 0) {
      this.selectedModule = this.selectedModule === this.hoveredModule ? -1 : this.hoveredModule;
      this.updateModuleHighlights();
      
      // Dispatch custom event for React UI
      const customEvent = new CustomEvent('moduleSelected', {
        detail: { index: this.selectedModule },
      });
      window.dispatchEvent(customEvent);
    }
  }

  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animationId = requestAnimationFrame(this.animate.bind(this));
    
    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    // Smooth explode animation
    this.explodeProgress += (this.targetExplode - this.explodeProgress) * 0.05;
    
    // Update module positions based on explode progress
    this.modules.forEach((module) => {
      const target = new THREE.Vector3().copy(module.originalPosition)
        .add(new THREE.Vector3().copy(module.explodeDirection).multiplyScalar(this.explodeProgress));
      module.group.position.lerp(target, 0.1);
    });

    // Auto rotation
    if (this.autoRotate && this.selectedModule < 0) {
      const parentRotation = elapsed * 0.1;
      this.modules.forEach((module) => {
        if (this.explodeProgress < 0.01) {
          // When assembled, rotate the whole thing
        }
      });
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 0.5;
    } else {
      this.controls.autoRotate = false;
    }

    // Subtle floating animation for exploded modules
    if (this.explodeProgress > 0.1) {
      this.modules.forEach((module, i) => {
        const floatOffset = Math.sin(elapsed * 0.5 + i * 0.7) * 0.02 * this.explodeProgress;
        module.group.position.y += floatOffset;
      });
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  resetView() {
    this.camera.position.set(5, 3, 7);
    this.controls.target.set(0, 0, 0);
    this.selectedModule = -1;
    this.hoveredModule = -1;
    this.targetExplode = 0;
    this.updateModuleHighlights();
  }

  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.onResize.bind(this));
    this.controls.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
