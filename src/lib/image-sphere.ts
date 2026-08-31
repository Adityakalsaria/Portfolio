import * as THREE from "three";

const RADIUS = 180;
const PLANE_SIZE = 50;
const AUTO_ROT_Y = 0.0005;
const AUTO_ROT_X = 0.0002;
const DRAG_EASE = 0.2;
const HOVER_SCALE = 1.2;
const SCALE_EASE = 0.1;
const OPACITY_EASE = 0.12;
const INERTIA_DECAY = 0.94;
/** Every rate below is expressed per frame at this pace. */
const BASE_FPS = 60;
const FLICK_SCALE = 0.9;

const CLICK_SLOP = 6;
const FOCUS_EASE = 0.14;
const FOCUS_DISTANCE = 300;
const FOCUS_FILL = 0.62;
const BACKDROP_DIM = 0.16;

/**
 * Corner radius and border, in screen pixels at the sphere's resting scale.
 * Baked into each texture rather than drawn with a shader, so the planes stay
 * plain MeshBasicMaterial.
 */
const CORNER_PX = 4;
const BORDER_PX = 0.2;
const BORDER_ALPHA = 0.15;
/** Roughly how tall an unfocused plane renders: 50 units at ~2.7px per unit. */
const PLANE_SCREEN_PX = 134;
/** Cap the baked texture so 21 of them do not flood GPU memory. */
const MAX_TEXTURE_PX = 1024;

/** A plane in the cloud. `href` makes it openable once focused. */
export type SphereItem = { url: string; href?: string; clip?: string };

export interface ImageSphereOptions {
  distance?: number;
  fov?: number;
  /** Fires when a plane is focused or released, so a host can react. */
  onFocusChange?: (focus: { href?: string } | null) => void;
}

type PlaneMesh = THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;

export class ImageSphere {
  private host: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private group = new THREE.Group();
  private planes: PlaneMesh[] = [];
  private onFocusChange?: (focus: { href?: string } | null) => void;
  private lastFocused: PlaneMesh | null = null;

  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2(-2, -2);
  private hovered: PlaneMesh | null = null;
  private focused: PlaneMesh | null = null;

  private rotationX = 0;
  private rotationY = 0;
  private currentRotationX = 0;
  private currentRotationY = 0;
  private baseRotationX = 0;
  private baseRotationY = 0;

  private dragging = false;
  private startX = 0;
  private startY = 0;

  private velX = 0;
  private velY = 0;
  private lastDX = 0;
  private lastDY = 0;

  private invQuat = new THREE.Quaternion();
  private worldPos = new THREE.Vector3();
  private centerPos = new THREE.Vector3();
  private tmpPos = new THREE.Vector3();

  private raf = 0;
  private lastFrame = 0;
  private running = false;
  private disposed = false;

  /** One reused element: only the focused plane ever plays. */
  private videoEl: HTMLVideoElement | null = null;
  private videoTex: THREE.VideoTexture | null = null;
  private videoPlane: PlaneMesh | null = null;

  private ro?: ResizeObserver;
  private cleanup: (() => void)[] = [];

  constructor(
    host: HTMLElement,
    images: (string | SphereItem)[],
    opts: ImageSphereOptions = {}
  ) {
    this.host = host;
    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setPixelRatio(dpr);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(w, h);
    const canvas = this.renderer.domElement;
    Object.assign(canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
      cursor: "grab",
    });
    host.appendChild(canvas);

    this.camera = new THREE.PerspectiveCamera(opts.fov ?? 25, w / h, 0.1, 2000);
    this.camera.position.z = opts.distance ?? 520;
    this.scene.add(this.group);

    this.onFocusChange = opts.onFocusChange;


    this.loadPlanes(images.map((i) => (typeof i === "string" ? { url: i } : i)));
    this.bindEvents();
  }

  /**
   * Redraws an image onto a canvas clipped to a rounded rectangle, with a
   * hairline border stroked inside it. Radius and border are given in screen
   * pixels and scaled by how many texture pixels cover one screen pixel.
   */
  private decorate(image: HTMLImageElement): THREE.CanvasTexture {
    const w = image.width || 1;
    const h = image.height || 1;
    const fit = Math.min(1, MAX_TEXTURE_PX / Math.max(w, h));
    const cw = Math.max(2, Math.round(w * fit));
    const ch = Math.max(2, Math.round(h * fit));

    const canvas = document.createElement("canvas");
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d")!;

    const perScreenPx = ch / PLANE_SCREEN_PX;
    const radius = CORNER_PX * perScreenPx;
    const border = BORDER_PX * perScreenPx;

    const path = (inset: number, r: number) => {
      const x = inset;
      const y = inset;
      const rw = cw - inset * 2;
      const rh = ch - inset * 2;
      ctx.beginPath();
      ctx.roundRect(x, y, rw, rh, Math.max(0, r));
    };

    ctx.save();
    path(0, radius);
    ctx.clip();
    ctx.drawImage(image, 0, 0, cw, ch);
    ctx.restore();

    // Stroked half a line-width in, so the whole border sits inside the shape.
    ctx.strokeStyle = `rgba(0, 0, 0, ${BORDER_ALPHA})`;
    ctx.lineWidth = border;
    path(border / 2, radius - border / 2);
    ctx.stroke();

    return new THREE.CanvasTexture(canvas);
  }

  private loadPlanes(items: SphereItem[]) {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";
    items.forEach(({ url, href, clip }) => {
      loader.load(url, (loaded) => {
        if (this.disposed) return;

        const image = loaded.image as HTMLImageElement;
        const aspect = (image.width || 1) / (image.height || 1);
        // The source texture only carried the pixels; the baked one replaces it.
        const tex = this.decorate(image);
        loaded.dispose();

        tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        tex.minFilter = THREE.LinearMipMapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.generateMipmaps = true;

        const geo = new THREE.PlaneGeometry(PLANE_SIZE * aspect, PLANE_SIZE);
        const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });

        mat.depthWrite = false;
        const plane = new THREE.Mesh(geo, mat) as PlaneMesh;

        // Textures resolve out of order, so the link rides on the plane
        // rather than being looked up by index later.
        plane.userData = { isHovered: false, opacity: 0, focus: 0, aspect, href, clip };
        mat.opacity = 0;

        const phi = (Math.random() * 2 - 1) * Math.PI;
        const theta = Math.random() * Math.PI * 2;
        const r = RADIUS + (Math.random() - 0.5) * 80;
        plane.position.set(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        );

        // Kept apart from `home`: home is the spread position the loop reads,
        // and spread is recomputed whenever the frame's aspect changes.
        plane.userData.baseHome = plane.position.clone();
        plane.userData.home = plane.position.clone();
        this.applySpread();

        this.group.add(plane);
        this.planes.push(plane);

        if (!this.running) this.renderStill();
      });
    });
  }

  private bindEvents() {
    const host = this.host;
    const localMouse = (clientX: number, clientY: number) => {
      const rect = host.getBoundingClientRect();
      this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -(((clientY - rect.top) / rect.height) * 2 - 1);
    };

    let downX = 0;
    let downY = 0;
    const onDown = (e: PointerEvent) => {
      this.dragging = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
      downX = e.clientX;
      downY = e.clientY;
      this.velX = this.velY = 0;
      this.lastDX = this.lastDY = 0;
      this.renderer.domElement.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      localMouse(e.clientX, e.clientY);
      if (this.dragging) {
        const dx = e.clientX - this.startX;
        const dy = e.clientY - this.startY;
        this.rotationY += dx * 1.0;
        this.rotationX -= dy * 1.0;
        this.lastDX = dx;
        this.lastDY = dy;
        this.startX = e.clientX;
        this.startY = e.clientY;
      }
    };
    const release = () => {
      if (!this.dragging) return;
      this.dragging = false;

      this.velY = this.lastDX * FLICK_SCALE;
      this.velX = -this.lastDY * FLICK_SCALE;
      this.renderer.domElement.style.cursor = "grab";
    };
    const onUp = (e: PointerEvent) => {
      const moved = Math.hypot(e.clientX - downX, e.clientY - downY);
      release();

      if (moved <= CLICK_SLOP && this.running) {
        this.velX = this.velY = 0;
        localMouse(e.clientX, e.clientY);
        const hit = this.pick();
        if (this.focused) this.focused = hit === this.focused ? null : hit;
        else this.focused = hit;
      }
    };
    const onLeave = () => {
      release();
      this.mouse.set(-2, -2);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && this.focused) this.focused = null;
    };
    window.addEventListener("keydown", onKey);
    this.cleanup.push(() => window.removeEventListener("keydown", onKey));

    host.addEventListener("pointerdown", onDown);
    host.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    host.addEventListener("pointerleave", onLeave);
    this.cleanup.push(() => {
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      host.removeEventListener("pointerleave", onLeave);
    });

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(host);
  }

  /**
   * Widen the cloud to the frame. The sphere is round, so on a wide screen it
   * left the sides empty while the middle crowded. Positions are scaled on X,
   * not the group — scaling the group would stretch the planes with it.
   */
  private applySpread() {
    const spread = Math.min(2.2, Math.max(1, this.camera.aspect / 1.15));
    for (const plane of this.planes) {
      const base = plane.userData.baseHome as THREE.Vector3 | undefined;
      const home = plane.userData.home as THREE.Vector3 | undefined;
      if (!base || !home) continue;
      home.set(base.x * spread, base.y, base.z);
      if (plane !== this.focused) plane.position.copy(home);
    }
  }

  private resize() {
    if (this.disposed) return;
    const w = this.host.clientWidth;
    const h = this.host.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.applySpread();
  }

  /**
   * Swap the focused plane's still for a playing clip. Muted and looping: the
   * click that focuses it is a gesture, so sound would be allowed — but a
   * cloud that starts talking when you touch it is not what anyone wants.
   */
  private attachVideo(plane: PlaneMesh) {
    const clip = plane.userData.clip as string | undefined;
    if (!clip || this.videoPlane === plane) return;
    this.detachVideo();

    if (!this.videoEl) {
      const el = document.createElement("video");
      el.muted = true;
      el.loop = true;
      el.playsInline = true;
      el.crossOrigin = "anonymous";
      el.preload = "auto";
      // Kept in the document, not detached. A detached element plays in
      // Chrome but is unreliable elsewhere — Safari in particular will refuse
      // — and it is invisible to anything inspecting the page.
      Object.assign(el.style, {
        position: "absolute",
        width: "1px",
        height: "1px",
        opacity: "0",
        pointerEvents: "none",
      });
      this.host.appendChild(el);
      this.videoEl = el;
    }
    this.videoEl.src = clip;

    const tex = new THREE.VideoTexture(this.videoEl);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;

    // Keep the still so unfocusing can put it back; it is the only copy.
    plane.userData.stillMap = plane.material.map;
    plane.material.map = tex;
    plane.material.needsUpdate = true;

    this.videoTex = tex;
    this.videoPlane = plane;
    void this.videoEl.play().catch(() => {});
  }

  private detachVideo() {
    const plane = this.videoPlane;
    if (plane) {
      plane.material.map = (plane.userData.stillMap as THREE.Texture) ?? null;
      plane.material.needsUpdate = true;
      plane.userData.stillMap = undefined;
    }
    this.videoEl?.pause();
    if (this.videoEl) this.videoEl.removeAttribute("src");
    this.videoTex?.dispose();
    this.videoTex = null;
    this.videoPlane = null;
  }

  private pick(): PlaneMesh | null {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hits = this.raycaster.intersectObjects(this.planes, false);
    return (hits.length > 0 ? hits[0].object : null) as PlaneMesh | null;
  }

  private hoverDetection() {
    const next = this.pick();
    if (next !== this.hovered) {
      if (this.hovered) this.hovered.userData.isHovered = false;
      this.hovered = next;
      if (this.hovered) this.hovered.userData.isHovered = true;
    }
  }

  start() {
    if (this.running || this.disposed) return;
    this.running = true;
    this.raf = requestAnimationFrame(this.loop);
  }

  stop() {
    this.running = false;
    this.lastFrame = 0;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private loop = (now: number) => {
    if (!this.running) return;

    /**
     * Every rate here was written as an amount per frame, which ties the
     * sphere's speed to the display: on a 120Hz screen it span twice as fast
     * and inertia died twice as quickly. `k` is how many 60fps frames this
     * one covered, so the motion is the same on any refresh rate. Capped so a
     * background tab does not resume with one enormous jump.
     */
    const dt = this.lastFrame ? (now - this.lastFrame) / 1000 : 1 / BASE_FPS;
    this.lastFrame = now;
    const k = Math.min(4, Math.max(0.001, dt * BASE_FPS));
    /** Exponential approach, so a lerp lands in the same place per second. */
    const ease = (e: number) => 1 - Math.pow(1 - e, k);

    if (!this.dragging && (this.velX !== 0 || this.velY !== 0)) {
      this.rotationY += this.velY * k;
      this.rotationX -= this.velX * k;
      this.velX *= Math.pow(INERTIA_DECAY, k);
      this.velY *= Math.pow(INERTIA_DECAY, k);
      if (Math.abs(this.velX) < 0.01) this.velX = 0;
      if (Math.abs(this.velY) < 0.01) this.velY = 0;
    }

    this.baseRotationY += AUTO_ROT_Y * k;
    this.baseRotationX += AUTO_ROT_X * k;
    this.currentRotationX += (this.rotationX - this.currentRotationX) * ease(DRAG_EASE);
    this.currentRotationY += (this.rotationY - this.currentRotationY) * ease(DRAG_EASE);
    this.group.rotation.x = this.baseRotationX + this.currentRotationX * 0.002;
    this.group.rotation.y = this.baseRotationY + this.currentRotationY * 0.002;

    if (!this.dragging && !this.focused) this.hoverDetection();
    else if (this.focused && this.hovered) {
      this.hovered.userData.isHovered = false;
      this.hovered = null;
    }
    if (this.focused !== this.lastFocused) {
      this.lastFocused = this.focused;
      if (this.focused) this.attachVideo(this.focused);
      else this.detachVideo();
      this.onFocusChange?.(
        this.focused ? { href: this.focused.userData.href as string | undefined } : null
      );
    }
    const anyFocused = this.focused !== null;

    this.centerPos.set(0, 0, this.camera.position.z - FOCUS_DISTANCE);
    // Fit the focused plane to both axes. Scaling by height alone overflowed
    // a phone held upright, where 62% of a tall viewport is far wider than
    // the screen.
    const viewH = 2 * FOCUS_DISTANCE * Math.tan((this.camera.fov * Math.PI) / 360);
    const viewW = viewH * this.camera.aspect;

    this.invQuat.copy(this.group.quaternion).invert();
    for (const plane of this.planes) {
      plane.quaternion.copy(this.invQuat);

      const focusTarget = plane === this.focused ? 1 : 0;
      const f =
        plane.userData.focus + (focusTarget - plane.userData.focus) * ease(FOCUS_EASE);
      plane.userData.focus = f;

      if (f > 0.0005) {
        this.tmpPos.copy(this.centerPos);
        this.group.worldToLocal(this.tmpPos);
        plane.position.copy(plane.userData.home).lerp(this.tmpPos, f);
      } else if (
        plane.position.x !== plane.userData.home.x ||
        plane.position.z !== plane.userData.home.z
      ) {
        plane.position.copy(plane.userData.home);
      }

      plane.getWorldPosition(this.worldPos);
      const depth = this.worldPos.z;

      // Each plane is PLANE_SIZE tall and PLANE_SIZE * aspect wide, so the
      // limiting axis differs per image.
      const aspect = (plane.userData.aspect as number) || 1;
      const focusScale = Math.min(
        (viewH * FOCUS_FILL) / PLANE_SIZE,
        (viewW * FOCUS_FILL) / (PLANE_SIZE * aspect)
      );

      const zScale = 0.8 + depth / 2000;
      let target = plane.userData.isHovered ? zScale * HOVER_SCALE : zScale;
      target = target + (focusScale - target) * f;
      const s = plane.scale.x + (target - plane.scale.x) * ease(SCALE_EASE);
      plane.scale.set(s, s, s);

      let wantOpacity = 1;
      if (anyFocused) wantOpacity = BACKDROP_DIM + (1 - BACKDROP_DIM) * f;
      const o =
        plane.userData.opacity + (wantOpacity - plane.userData.opacity) * ease(OPACITY_EASE);
      plane.userData.opacity = o;
      plane.material.opacity = o;

      plane.renderOrder = f > 0.5 ? 1 : 0;
    }

    this.renderer.render(this.scene, this.camera);
    this.raf = requestAnimationFrame(this.loop);
  };

  renderStill() {
    this.invQuat.copy(this.group.quaternion).invert();
    for (const plane of this.planes) {
      plane.quaternion.copy(this.invQuat);
      plane.getWorldPosition(this.worldPos);
      const zScale = 0.8 + this.worldPos.z / 2000;
      plane.scale.set(zScale, zScale, zScale);
      plane.userData.opacity = 1;
      plane.material.opacity = 1;
    }
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    this.disposed = true;
    this.stop();
    this.cleanup.forEach((fn) => fn());
    this.ro?.disconnect();
    for (const plane of this.planes) {
      plane.geometry.dispose();
      const mat = plane.material as THREE.MeshBasicMaterial;
      mat.map?.dispose();
      mat.dispose();
    }
    this.renderer.dispose();
    this.renderer.forceContextLoss?.();
    const canvas = this.renderer.domElement;
    canvas.parentNode?.removeChild(canvas);
  }
}
