// ZORO — animated interactive globe (News section)
// Vanilla three.js + three-globe port of the Aceternity "GitHub Globe" component.
// No React / Next.js required — plain ES modules, loaded via the import map in index.html.

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import ThreeGlobe from "three-globe";

const RING_PROPAGATION_SPEED = 3;
const CAMERA_Z = 300;

// ---- Theme (matches css/style.css --accent / --bg) ----
const THEME = {
  globeColor: "#0a0a1a",
  emissive: "#1a1442",
  emissiveIntensity: 0.15,
  shininess: 0.9,
  polygonColor: "rgba(129, 140, 248, 0.55)",
  atmosphereColor: "#6366f1",
  ambientLight: "#8890ff",
  directionalLeftLight: "#6366f1",
  directionalTopLight: "#ffffff",
  pointLight: "#818cf8",
};

const ARC_COLORS = ["#6366f1", "#818cf8", "#a78bfa"];

// Arcs radiating from Champhai (ZORO's home base) outward.
// Edit endLat/endLng/label below to change which places are highlighted.
const ARCS = [
  { name: "New Delhi",  lat: 28.6139, lng: 77.2090 },
  { name: "Yangon",     lat: 16.8409, lng: 96.1735 },
  { name: "Dhaka",      lat: 23.8103, lng: 90.4125 },
  { name: "Geneva",     lat: 46.2044, lng: 6.1432 },
  { name: "London",     lat: 51.5072, lng: -0.1276 },
  { name: "Washington, DC", lat: 38.9072, lng: -77.0369 },
  { name: "Melbourne",  lat: -37.8136, lng: 144.9631 },
];
const HOME = { lat: 23.4573, lng: 93.3287 }; // Champhai, Mizoram

function buildArcsData() {
  return ARCS.map((dest, i) => ({
    order: i,
    startLat: HOME.lat,
    startLng: HOME.lng,
    endLat: dest.lat,
    endLng: dest.lng,
    arcAlt: 0.22 + (i % 3) * 0.12,
    color: ARC_COLORS[i % ARC_COLORS.length],
  }));
}

async function initNewsGlobe() {
  const container = document.getElementById("news-globe");
  if (!container || !window.WebGLRenderingContext) return;

  let countries = { features: [] };
  try {
    const res = await fetch("data/globe-countries.json");
    countries = await res.json();
  } catch (err) {
    console.warn("ZORO globe: could not load country outlines", err);
  }

  const arcsData = buildArcsData();

  // ---- points (arc endpoints, deduped) ----
  const pointsData = [];
  arcsData.forEach((arc) => {
    pointsData.push({ order: arc.order, color: arc.color, lat: arc.startLat, lng: arc.startLng, size: 1.4 });
    pointsData.push({ order: arc.order, color: arc.color, lat: arc.endLat, lng: arc.endLng, size: 1.4 });
  });
  const uniquePoints = pointsData.filter(
    (v, i, a) => a.findIndex((v2) => v2.lat === v.lat && v2.lng === v.lng) === i
  );

  // ---- globe ----
  const globe = new ThreeGlobe();
  globe
    .hexPolygonsData(countries.features)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.7)
    .hexPolygonColor(() => THEME.polygonColor)
    .showAtmosphere(true)
    .atmosphereColor(THEME.atmosphereColor)
    .atmosphereAltitude(0.22);

  globe
    .arcsData(arcsData)
    .arcStartLat((d) => d.startLat)
    .arcStartLng((d) => d.startLng)
    .arcEndLat((d) => d.endLat)
    .arcEndLng((d) => d.endLng)
    .arcColor((d) => d.color)
    .arcAltitude((d) => d.arcAlt)
    .arcStroke(() => [0.32, 0.28, 0.3][Math.round(Math.random() * 2)])
    .arcDashLength(0.9)
    .arcDashInitialGap((d) => d.order)
    .arcDashGap(15)
    .arcDashAnimateTime(1800);

  globe
    .pointsData(uniquePoints)
    .pointColor((d) => d.color)
    .pointsMerge(true)
    .pointAltitude(0)
    .pointRadius(1.4);

  globe
    .ringsData([])
    .ringColor((d) => d.color)
    .ringMaxRadius(4)
    .ringPropagationSpeed(RING_PROPAGATION_SPEED)
    .ringRepeatPeriod((1800 * 0.9) / 1);

  const globeMaterial = globe.globeMaterial();
  globeMaterial.color = new THREE.Color(THEME.globeColor);
  globeMaterial.emissive = new THREE.Color(THEME.emissive);
  globeMaterial.emissiveIntensity = THEME.emissiveIntensity;
  globeMaterial.shininess = THEME.shininess;

  // ---- scene / camera / renderer ----
  const scene = new THREE.Scene();
  scene.add(globe);
  scene.fog = new THREE.Fog(0x0a0a0f, 400, 2000);

  scene.add(new THREE.AmbientLight(THEME.ambientLight, 0.7));
  const dLeft = new THREE.DirectionalLight(THEME.directionalLeftLight, 0.6);
  dLeft.position.set(-400, 100, 400);
  scene.add(dLeft);
  const dTop = new THREE.DirectionalLight(THEME.directionalTopLight, 0.6);
  dTop.position.set(-200, 500, 200);
  scene.add(dTop);
  const pLight = new THREE.PointLight(THEME.pointLight, 0.9);
  pLight.position.set(-200, 500, 200);
  scene.add(pLight);

  const getSize = () => {
    const rect = container.getBoundingClientRect();
    const size = Math.max(1, Math.round(rect.width));
    return { w: size, h: size };
  };

  let { w, h } = getSize();

  const camera = new THREE.PerspectiveCamera(50, w / h, 180, 1800);
  camera.position.z = CAMERA_Z;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.setClearColor(0x000000, 0);
  container.innerHTML = "";
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.6;
  controls.minPolarAngle = Math.PI / 3.5;
  controls.maxPolarAngle = Math.PI - Math.PI / 3;
  controls.minDistance = CAMERA_Z;
  controls.maxDistance = CAMERA_Z;

  // ring pulses on random points, refreshed periodically
  const ringInterval = setInterval(() => {
    const count = Math.max(1, Math.floor((uniquePoints.length * 4) / 5));
    const chosen = new Set();
    while (chosen.size < Math.min(count, uniquePoints.length)) {
      chosen.add(Math.floor(Math.random() * uniquePoints.length));
    }
    globe.ringsData(uniquePoints.filter((_, i) => chosen.has(i)));
  }, 1800);

  // resize handling
  const resizeObserver = new ResizeObserver(() => {
    const size = getSize();
    if (size.w === w && size.h === h) return;
    w = size.w;
    h = size.h;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  resizeObserver.observe(container);

  let rafId;
  function animate() {
    controls.update();
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  }
  animate();

  // pause rendering when off-screen to save battery/CPU
  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!rafId) animate();
        } else if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      });
    },
    { threshold: 0.05 }
  );
  visibilityObserver.observe(container);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initNewsGlobe);
} else {
  initNewsGlobe();
}
