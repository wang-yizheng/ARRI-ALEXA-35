import { useEffect, useRef, useState, useCallback } from 'react';
import { SceneManager } from './three/SceneManager';

const MODULE_INFO = [
  {
    name: 'Body Housing',
    nameCN: '机身外壳',
    description: '镁合金机身框架，提供结构支撑与电磁屏蔽。IP53防护等级，适应恶劣拍摄环境。重量约1.6kg（不含电池和取景器）。',
    specs: ['材质: 镁合金', '防护: IP53', '重量: ~1.6kg', '尺寸: 170×126×157mm'],
  },
  {
    name: 'Sensor Module',
    nameCN: '传感器模块',
    description: '全新设计的ALEV III 4.6K CMOS传感器，Super 35格式，16bit线性输出。支持双原生ISO 800/3200，17档动态范围。',
    specs: ['型号: ALEV III', '分辨率: 4608×2592', '画幅: Super 35', '动态范围: 17 stops'],
  },
  {
    name: 'Lens Mount',
    nameCN: '镜头卡口',
    description: 'ARRI LPL大画幅卡口，法兰距44mm。支持ARRI Signature Prime等LPL镜头，可通过适配器使用PL/EF/E卡口镜头。',
    specs: ['类型: ARRI LPL', '法兰距: 44mm', '可换卡口: PL/EF/E', '电子触点: 6pin'],
  },
  {
    name: 'Cooling System',
    nameCN: '散热系统',
    description: '高效静音散热系统，铜质热管配合铝合金散热鳍片。智能温控风扇确保传感器温度稳定，支持-20°C至45°C工作环境。',
    specs: ['热管: 铜质3根', '散热片: 铝合金', '风扇: 静音设计', '工作温度: -20°C~45°C'],
  },
  {
    name: 'Processing Board',
    nameCN: '处理电路板',
    description: '主处理板搭载FPGA图像处理器，集成REVEAL色彩科学引擎。支持ARRI Wide Gamut 3、LogC3/LogC4色彩空间。',
    specs: ['处理器: FPGA', '色彩科学: REVEAL', '色域: Wide Gamut 3', 'Log曲线: LogC3/LogC4'],
  },
  {
    name: 'Viewfinder',
    nameCN: '取景器',
    description: 'ARRI MVF-2取景器，内置高分辨率OLED微显示器。支持眼罩取景和折叠监视器两种模式，可拆卸安装。',
    specs: ['型号: MVF-2', '显示: OLED', '分辨率: 1920×1080', '模式: 眼罩/监视器'],
  },
  {
    name: 'Media / Codex',
    nameCN: '存储模块',
    description: 'Codex Compact Drive存储模块，内置2TB NVMe SSD。支持ARRI ProRes 422/444及ARRIRAW录制，最高1000MB/s读写速度。',
    specs: ['容量: 2TB NVMe', '格式: ProRes/ARRIRAW', '速度: 1000MB/s', '接口: Compact Drive'],
  },
  {
    name: 'Power Module',
    nameCN: '电源模块',
    description: 'B-Mount电池接口，支持24V/28V输入。460Wh大容量电池提供约2小时续航，内置智能电源管理系统。',
    specs: ['接口: B-Mount', '电压: 24V/28V', '电池: 460Wh', '续航: ~2小时'],
  },
  {
    name: 'Control Panel',
    nameCN: '控制面板',
    description: '集成控制面板，包含OLED状态显示屏、导航按键、录制按钮、多功能旋钮。侧面提供SDI/TC/USB/以太网接口。',
    specs: ['显示屏: 1.4" OLED', '按键: 菜单导航', '录制: 独立按钮', '接口: SDI/TC/USB/ETH'],
  },
];

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneManager | null>(null);
  const [selectedModule, setSelectedModule] = useState<number>(-1);
  const [explodeValue, setExplodeValue] = useState(0);
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new SceneManager(containerRef.current);
    sceneRef.current = scene;

    const handleModuleSelected = (e: Event) => {
      const customEvent = e as CustomEvent;
      setSelectedModule(customEvent.detail.index);
    };
    window.addEventListener('moduleSelected', handleModuleSelected);

    return () => {
      window.removeEventListener('moduleSelected', handleModuleSelected);
      scene.dispose();
    };
  }, []);

  const handleExplodeChange = useCallback((value: number) => {
    setExplodeValue(value);
    sceneRef.current?.setExplodeProgress(value);
  }, []);

  const handleModuleClick = useCallback((index: number) => {
    setSelectedModule(index);
    sceneRef.current?.selectModule(index);
  }, []);

  const handleReset = useCallback(() => {
    setSelectedModule(-1);
    setExplodeValue(0);
    sceneRef.current?.resetView();
  }, []);

  const handleToggleAutoRotate = useCallback(() => {
    if (sceneRef.current) {
      sceneRef.current.autoRotate = !sceneRef.current.autoRotate;
    }
  }, []);

  return (
    <div className="w-full h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* 3D Canvas */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold tracking-wider">
              <span className="text-[#00c853]">ARRI</span> ALEXA 35
            </h1>
            <p className="text-gray-400 text-sm mt-1">Interactive 3D Teardown Visualization</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-xs">交互式3D结构拆解</p>
            <p className="text-gray-600 text-xs mt-1">Three.js 程序化建模</p>
          </div>
        </div>
      </div>

      {/* Left Panel - Module List */}
      <div className="absolute left-4 top-20 bottom-4 w-64 pointer-events-auto z-10 overflow-y-auto">
        <div className="bg-black/60 backdrop-blur-md rounded-xl border border-white/10 p-4">
          <h2 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#00c853] rounded-full"></span>
            模块列表 / Modules
          </h2>
          <div className="space-y-1">
            {MODULE_INFO.map((module, index) => (
              <button
                key={index}
                onClick={() => handleModuleClick(index)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                  selectedModule === index
                    ? 'bg-[#00c853]/20 border border-[#00c853]/50 text-white'
                    : 'hover:bg-white/5 text-gray-300 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: module.nameCN ? '#00c853' : '#666' }}
                  ></span>
                  <div>
                    <div className="text-xs font-medium">{module.nameCN}</div>
                    <div className="text-[10px] text-gray-500">{module.name}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Module Info */}
      {selectedModule >= 0 && showInfo && (
        <div className="absolute right-4 top-20 w-80 pointer-events-auto z-10">
          <div className="bg-black/70 backdrop-blur-md rounded-xl border border-white/10 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-[#00c853] text-lg font-bold">
                  {MODULE_INFO[selectedModule].nameCN}
                </h3>
                <p className="text-gray-400 text-xs">
                  {MODULE_INFO[selectedModule].name}
                </p>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {MODULE_INFO[selectedModule].description}
            </p>
            <div className="space-y-2">
              <h4 className="text-white text-xs font-semibold uppercase tracking-wider">
                技术参数
              </h4>
              <div className="grid grid-cols-1 gap-1">
                {MODULE_INFO[selectedModule].specs.map((spec, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-xs text-gray-400"
                  >
                    <span className="w-1 h-1 bg-[#00c853] rounded-full"></span>
                    {spec}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto z-10">
        <div className="bg-black/60 backdrop-blur-md rounded-xl border border-white/10 p-4 flex items-center gap-6">
          {/* Explode Slider */}
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-xs whitespace-nowrap">拆解</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={explodeValue}
              onChange={(e) => handleExplodeChange(parseFloat(e.target.value))}
              className="w-32 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#00c853]"
            />
            <span className="text-gray-500 text-xs w-8">
              {Math.round(explodeValue * 100)}%
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-white/10"></div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleAutoRotate}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-300 transition-all"
            >
              🔄 自动旋转
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-[#00c853]/10 hover:bg-[#00c853]/20 border border-[#00c853]/30 rounded-lg text-xs text-[#00c853] transition-all"
            >
              ↺ 复位
            </button>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-300 transition-all"
            >
              ℹ️ 信息
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 pointer-events-none z-10">
        <div className="text-right text-gray-600 text-[10px] space-y-0.5">
          <p>🖱️ 左键拖拽旋转</p>
          <p>🖱️ 右键拖拽平移</p>
          <p>🖱️ 滚轮缩放</p>
          <p>🖱️ 点击模块查看详情</p>
        </div>
      </div>

      {/* Module count indicator */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
        <div className="flex items-center gap-1">
          {MODULE_INFO.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                selectedModule === i
                  ? 'bg-[#00c853] scale-150'
                  : 'bg-gray-700'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
