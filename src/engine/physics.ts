import { CollisionImpactEvent, PhysicsBody, PhysicsSettings } from '../types/os';

export interface DesktopBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface StepPhysicsResult {
  impacts: CollisionImpactEvent[];
}

export interface VelocitySample {
  x: number;
  y: number;
  t: number;
}

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

/**
 * Computes rectangular moment of inertia I = (1/12) * m * (w^2 + h^2).
 */
export function computeRectInertia(mass: number, width: number, height: number): number {
  return Math.max(1000, (mass * (width * width + height * height)) / 12);
}

/**
 * Tracks smoothed pointer release velocity using exponential recency weighting
 * so throwing icons, widgets, and windows feels responsive and physically accurate.
 */
export class PointerVelocityTracker {
  private samples: VelocitySample[] = [];

  public reset(x: number, y: number) {
    this.samples = [{ x, y, t: performance.now() }];
  }

  public push(x: number, y: number) {
    const now = performance.now();
    this.samples.push({ x, y, t: now });
    const cutoff = now - 110;
    while (this.samples.length > 2 && this.samples[0].t < cutoff) {
      this.samples.shift();
    }
  }

  public getVelocity(): { vx: number; vy: number } {
    const now = performance.now();
    const recent = this.samples.filter((s) => now - s.t <= 125);
    if (recent.length < 2) return { vx: 0, vy: 0 };

    let totalW = 0;
    let sumVx = 0;
    let sumVy = 0;

    for (let i = 1; i < recent.length; i++) {
      const a = recent[i - 1];
      const b = recent[i];
      const dt = (b.t - a.t) / 1000;
      if (dt < 0.002) continue;
      const weight = i / recent.length;
      sumVx += ((b.x - a.x) / dt) * weight;
      sumVy += ((b.y - a.y) / dt) * weight;
      totalW += weight;
    }

    if (totalW === 0) return { vx: 0, vy: 0 };
    const vx = sumVx / totalW;
    const vy = sumVy / totalW;

    const maxSpeed = 2800;
    const mag = Math.hypot(vx, vy);
    if (mag > maxSpeed) {
      return { vx: (vx / mag) * maxSpeed, vy: (vy / mag) * maxSpeed };
    }
    return { vx, vy };
  }
}

interface Vec2 {
  x: number;
  y: number;
}

/**
 * Returns the 4 world-space corners of an Oriented Bounding Box (OBB).
 */
function getOBBCorners(b: PhysicsBody): [Vec2, Vec2, Vec2, Vec2] {
  const cx = b.x + b.width * 0.5;
  const cy = b.y + b.height * 0.5;
  const rad = b.angle * DEG_TO_RAD;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const hw = b.width * 0.5;
  const hh = b.height * 0.5;

  const rxCos = hw * cos;
  const rxSin = hw * sin;
  const ryCos = hh * cos;
  const rySin = hh * sin;

  return [
    { x: cx - rxCos + rySin, y: cy - rxSin - ryCos }, // Top-Left
    { x: cx + rxCos + rySin, y: cy + rxSin - ryCos }, // Top-Right
    { x: cx + rxCos - rySin, y: cy + rxSin + ryCos }, // Bottom-Right
    { x: cx - rxCos - rySin, y: cy - rxSin + ryCos }, // Bottom-Left
  ];
}

function projectCorners(corners: Vec2[], axisX: number, axisY: number): { min: number; max: number } {
  let min = corners[0].x * axisX + corners[0].y * axisY;
  let max = min;
  for (let i = 1; i < corners.length; i++) {
    const p = corners[i].x * axisX + corners[i].y * axisY;
    if (p < min) min = p;
    if (p > max) max = p;
  }
  return { min, max };
}

interface SATManifold {
  nx: number; // points from A -> B
  ny: number;
  penetration: number;
  contactX: number;
  contactY: number;
}

/**
 * Exact 2D OBB vs OBB Separating Axis Theorem (SAT) collision test
 * with contact point estimation for realistic rotational impulse & torque.
 */
function detectOBBCollision(a: PhysicsBody, b: PhysicsBody): SATManifold | null {
  const caX = a.x + a.width * 0.5;
  const caY = a.y + a.height * 0.5;
  const cbX = b.x + b.width * 0.5;
  const cbY = b.y + b.height * 0.5;

  // Quick broad-phase bounding circle check
  const radA = Math.hypot(a.width * 0.5, a.height * 0.5);
  const radB = Math.hypot(b.width * 0.5, b.height * 0.5);
  const dxCenter = cbX - caX;
  const dyCenter = cbY - caY;
  const maxDist = radA + radB;
  if (dxCenter * dxCenter + dyCenter * dyCenter > maxDist * maxDist) {
    return null;
  }

  const cornersA = getOBBCorners(a);
  const cornersB = getOBBCorners(b);

  const radAngleA = a.angle * DEG_TO_RAD;
  const radAngleB = b.angle * DEG_TO_RAD;

  const axes: Vec2[] = [
    { x: Math.cos(radAngleA), y: Math.sin(radAngleA) },
    { x: -Math.sin(radAngleA), y: Math.cos(radAngleA) },
    { x: Math.cos(radAngleB), y: Math.sin(radAngleB) },
    { x: -Math.sin(radAngleB), y: Math.cos(radAngleB) },
  ];

  let minOverlap = Infinity;
  let bestAxis: Vec2 = { x: 1, y: 0 };

  for (let i = 0; i < 4; i++) {
    const ax = axes[i];
    const pA = projectCorners(cornersA, ax.x, ax.y);
    const pB = projectCorners(cornersB, ax.x, ax.y);
    const overlap = Math.min(pA.max, pB.max) - Math.max(pA.min, pB.min);
    if (overlap <= 0) return null;
    if (overlap < minOverlap) {
      minOverlap = overlap;
      bestAxis = ax;
    }
  }

  // Ensure normal points from A -> B
  let nx = bestAxis.x;
  let ny = bestAxis.y;
  if (dxCenter * nx + dyCenter * ny < 0) {
    nx = -nx;
    ny = -ny;
  }

  // Estimate contact point: average of deepest penetrating vertices of B into A & A into B
  let sumX = 0;
  let sumY = 0;
  let count = 0;

  let maxProjA = -Infinity;
  for (const c of cornersA) {
    const proj = (c.x - caX) * nx + (c.y - caY) * ny;
    if (proj > maxProjA) maxProjA = proj;
  }
  for (const c of cornersA) {
    const proj = (c.x - caX) * nx + (c.y - caY) * ny;
    if (proj >= maxProjA - 3) {
      sumX += c.x;
      sumY += c.y;
      count++;
    }
  }

  let minProjB = Infinity;
  for (const c of cornersB) {
    const proj = (c.x - caX) * nx + (c.y - caY) * ny;
    if (proj < minProjB) minProjB = proj;
  }
  for (const c of cornersB) {
    const proj = (c.x - caX) * nx + (c.y - caY) * ny;
    if (proj <= minProjB + 3) {
      sumX += c.x;
      sumY += c.y;
      count++;
    }
  }

  const contactX = count > 0 ? sumX / count : (caX + cbX) * 0.5;
  const contactY = count > 0 ? sumY / count : (caY + cbY) * 0.5;

  return {
    nx,
    ny,
    penetration: minOverlap,
    contactX,
    contactY,
  };
}

/**
 * Resolves a rigid-body collision with full linear + rotational impulse
 * and Coulomb tangential friction at the contact manifold.
 */
function resolveRigidBodyCollision(
  a: PhysicsBody,
  b: PhysicsBody,
  manifold: SATManifold,
  restitution: number,
  surfaceMu: number,
  subDt: number,
  impacts: CollisionImpactEvent[]
) {
  const { nx, ny, penetration, contactX, contactY } = manifold;

  const invMassA = a.isDragging || a.kind === 'window' ? 0 : 1 / Math.max(1, a.mass);
  const invMassB = b.isDragging || b.kind === 'window' ? 0 : 1 / Math.max(1, b.mass);
  const invMassSum = invMassA + invMassB;
  if (invMassSum === 0) return;

  const invInertiaA = a.isDragging || a.kind === 'window' ? 0 : 1 / Math.max(1000, a.inertia);
  const invInertiaB = b.isDragging || b.kind === 'window' ? 0 : 1 / Math.max(1000, b.inertia);

  // Positional stabilization (Baumgarte slop so stacked bodies rest cleanly without jitter)
  const slop = 0.35;
  const percent = 0.72;
  const corrMag = (Math.max(0, penetration - slop) / invMassSum) * percent;
  a.x -= nx * corrMag * invMassA;
  a.y -= ny * corrMag * invMassA;
  b.x += nx * corrMag * invMassB;
  b.y += ny * corrMag * invMassB;

  const caX = a.x + a.width * 0.5;
  const caY = a.y + a.height * 0.5;
  const cbX = b.x + b.width * 0.5;
  const cbY = b.y + b.height * 0.5;

  // Lever arms from center of mass to contact point
  const rAx = contactX - caX;
  const rAy = contactY - caY;
  const rBx = contactX - cbX;
  const rBy = contactY - cbY;

  const omegaA = a.angularVel * DEG_TO_RAD;
  const omegaB = b.angularVel * DEG_TO_RAD;

  // Velocity at contact point: v + omega x r (in 2D: (-omega*ry, omega*rx))
  const vAx = a.vx - omegaA * rAy;
  const vAy = a.vy + omegaA * rAx;
  const vBx = b.vx - omegaB * rBy;
  const vBy = b.vy + omegaB * rBx;

  const rvx = vBx - vAx;
  const rvy = vBy - vAy;

  const velAlongNormal = rvx * nx + rvy * ny;
  if (velAlongNormal > 0) return; // Already separating

  // Kill micro-bounces so stacked widgets rest naturally under gravity
  const effectiveRestitution = Math.abs(velAlongNormal) < 42 ? 0 : restitution;

  const rACrossN = rAx * ny - rAy * nx;
  const rBCrossN = rBx * ny - rBy * nx;
  const denom =
    invMassSum +
    rACrossN * rACrossN * invInertiaA +
    rBCrossN * rBCrossN * invInertiaB;

  if (denom <= 0) return;

  const jn = (-(1 + effectiveRestitution) * velAlongNormal) / denom;
  const impulseX = jn * nx;
  const impulseY = jn * ny;

  if (invMassA > 0) {
    a.vx -= impulseX * invMassA;
    a.vy -= impulseY * invMassA;
    const torqueImpulseA = rAx * impulseY - rAy * impulseX;
    a.angularVel -= torqueImpulseA * invInertiaA * RAD_TO_DEG;
    a.isSleeping = false;
  }
  if (invMassB > 0) {
    b.vx += impulseX * invMassB;
    b.vy += impulseY * invMassB;
    const torqueImpulseB = rBx * impulseY - rBy * impulseX;
    b.angularVel += torqueImpulseB * invInertiaB * RAD_TO_DEG;
    b.isSleeping = false;
  }

  // Tangential (Coulomb) friction impulse
  const txRaw = rvx - velAlongNormal * nx;
  const tyRaw = rvy - velAlongNormal * ny;
  const tLen = Math.hypot(txRaw, tyRaw);
  if (tLen > 0.001) {
    const tx = txRaw / tLen;
    const ty = tyRaw / tLen;
    const rACrossT = rAx * ty - rAy * tx;
    const rBCrossT = rBx * ty - rBy * tx;
    const denomT =
      invMassSum +
      rACrossT * rACrossT * invInertiaA +
      rBCrossT * rBCrossT * invInertiaB;

    if (denomT > 0) {
      let jt = -(rvx * tx + rvy * ty) / denomT;
      const maxFriction = jn * surfaceMu;
      jt = Math.max(-maxFriction, Math.min(maxFriction, jt));

      const fImpX = jt * tx;
      const fImpY = jt * ty;

      if (invMassA > 0) {
        a.vx -= fImpX * invMassA;
        a.vy -= fImpY * invMassA;
        a.angularVel -= (rAx * fImpY - rAy * fImpX) * invInertiaA * RAD_TO_DEG;
      }
      if (invMassB > 0) {
        b.vx += fImpX * invMassB;
        b.vy += fImpY * invMassB;
        b.angularVel += (rBx * fImpY - rBy * fImpX) * invInertiaB * RAD_TO_DEG;
      }
    }
  }

  // Emit visual/audio impact event on energetic hits
  const impactSpeed = Math.abs(velAlongNormal);
  const isWidgetIconHit =
    (a.kind === 'widget' && b.kind === 'icon') ||
    (a.kind === 'icon' && b.kind === 'widget');
  const threshold = isWidgetIconHit ? 72 : 115;
  if (impactSpeed > threshold && subDt > 0) {
    impacts.push({
      x: contactX,
      y: contactY,
      nx,
      ny,
      intensity: Math.min(1, impactSpeed / 1100),
      color: isWidgetIconHit ? '#FF007A' : b.kind === 'window' || a.kind === 'window' ? '#00F0FF' : '#A855F7',
      bodyAId: a.id,
      bodyBId: b.id,
      bodyAKind: a.kind,
      bodyBKind: b.kind,
    });
  }
}

/**
 * Resolves exact OBB boundary collisions (floor, ceiling, walls) using the
 * deepest penetrating corner so rotated objects bounce and spin accurately!
 */
function resolveBoundaryOBB(
  b: PhysicsBody,
  bounds: DesktopBounds,
  bounce: number,
  wallMu: number,
  mode: PhysicsSettings['mode'],
  subDt: number,
  impacts: CollisionImpactEvent[]
) {
  const corners = getOBBCorners(b);
  const invMass = 1 / Math.max(1, b.mass);
  const invInertia = 1 / Math.max(1000, b.inertia);

  const applyWallImpulse = (
    nx: number,
    ny: number,
    contactX: number,
    contactY: number,
    pen: number,
    color: string
  ) => {
    // Positional push back inside boundary
    b.x += nx * pen;
    b.y += ny * pen;

    const cx = b.x + b.width * 0.5;
    const cy = b.y + b.height * 0.5;
    const rx = contactX - cx;
    const ry = contactY - cy;
    const omega = b.angularVel * DEG_TO_RAD;

    const vxContact = b.vx - omega * ry;
    const vyContact = b.vy + omega * rx;
    const velAlongNormal = vxContact * nx + vyContact * ny;

    if (velAlongNormal >= 0) return;

    const rCrossN = rx * ny - ry * nx;
    const denom = invMass + rCrossN * rCrossN * invInertia;
    const effBounce =
      mode === 'earth' && Math.abs(velAlongNormal) < 48 ? 0 : bounce;
    const jn = (-(1 + effBounce) * velAlongNormal) / denom;

    const impX = jn * nx;
    const impY = jn * ny;
    b.vx += impX * invMass;
    b.vy += impY * invMass;
    b.angularVel += (rx * impY - ry * impX) * invInertia * RAD_TO_DEG;

    // Tangential wall friction
    const tx = -ny;
    const ty = nx;
    const velTangent = vxContact * tx + vyContact * ty;
    const rCrossT = rx * ty - ry * tx;
    const denomT = invMass + rCrossT * rCrossT * invInertia;
    let jt = -velTangent / denomT;
    const maxF = jn * wallMu;
    jt = Math.max(-maxF, Math.min(maxF, jt));

    b.vx += jt * tx * invMass;
    b.vy += jt * ty * invMass;
    b.angularVel += (rx * (jt * ty) - ry * (jt * tx)) * invInertia * RAD_TO_DEG;

    const impactSpeed = Math.abs(velAlongNormal);
    if (impactSpeed > 130 && subDt > 0) {
      impacts.push({
        x: contactX,
        y: contactY,
        nx,
        ny,
        intensity: Math.min(1, impactSpeed / 1150),
        color,
      });
    }
  };

  // Left wall
  let minX = Infinity;
  let leftCorner = corners[0];
  for (const c of corners) {
    if (c.x < minX) {
      minX = c.x;
      leftCorner = c;
    }
  }
  if (minX < bounds.left) {
    applyWallImpulse(1, 0, leftCorner.x, leftCorner.y, bounds.left - minX, '#00F0FF');
  }

  // Right wall
  let maxX = -Infinity;
  let rightCorner = corners[0];
  for (const c of corners) {
    if (c.x > maxX) {
      maxX = c.x;
      rightCorner = c;
    }
  }
  if (maxX > bounds.right) {
    applyWallImpulse(-1, 0, rightCorner.x, rightCorner.y, maxX - bounds.right, '#00F0FF');
  }

  // Top ceiling
  let minY = Infinity;
  let topCorner = corners[0];
  for (const c of corners) {
    if (c.y < minY) {
      minY = c.y;
      topCorner = c;
    }
  }
  if (minY < bounds.top) {
    applyWallImpulse(0, 1, topCorner.x, topCorner.y, bounds.top - minY, '#FF007A');
  }

  // Bottom floor
  let maxY = -Infinity;
  let botCorner = corners[0];
  for (const c of corners) {
    if (c.y > maxY) {
      maxY = c.y;
      botCorner = c;
    }
  }
  if (maxY > bounds.bottom) {
    applyWallImpulse(0, -1, botCorner.x, botCorner.y, maxY - bounds.bottom, '#FF007A');
  }
}

export function stepPhysicsBodies(
  bodies: Map<string, PhysicsBody>,
  bounds: DesktopBounds,
  settings: PhysicsSettings,
  cursor: { x: number; y: number; active: boolean },
  dtRaw: number
): StepPhysicsResult {
  const impacts: CollisionImpactEvent[] = [];

  if (settings.mode === 'static') {
    bodies.forEach((b) => {
      b.vx = 0;
      b.vy = 0;
      b.angularVel = 0;
      b.angle *= 0.78;
      if (Math.abs(b.angle) < 0.05) b.angle = 0;
      b.scale += ((b.isDragging ? 1.04 : 1) - b.scale) * 0.25;
      b.isSleeping = true;
    });
    return { impacts };
  }

  const dt = Math.min(dtRaw, 0.033);
  // Higher substeps in earth mode ensure realistic stacking & non-tunneling bounces
  const substeps = settings.mode === 'earth' ? 4 : 2;
  const subDt = dt / substeps;
  const list = Array.from(bodies.values());

  const surfaceMu = settings.mode === 'earth' ? 0.36 : settings.mode === 'zero-g' ? 0.12 : 0.28;
  const bounce =
    settings.mode === 'zero-g'
      ? Math.max(0.76, settings.restitution)
      : settings.restitution;

  for (let step = 0; step < substeps; step++) {
    for (const b of list) {
      // Scale feedback on grab
      const desiredScale = b.isDragging ? 1.045 : 1;
      b.scale += (desiredScale - b.scale) * Math.min(1, subDt * 18);

      if (b.isDragging) {
        b.isSleeping = false;
        // Realistic grab-point pendulum torque!
        if (settings.tiltEnabled) {
          const springK = 165;
          const springDamp = 15;
          // Target angle combines drag lateral velocity + grab-point lever torque
          const leverTorqueTilt =
            ((b.grabOffsetX * b.targetAngle * 0.04) + b.targetAngle) * 0.85;
          const clampedTarget = Math.max(-24, Math.min(24, leverTorqueTilt));
          const accelAngle = (clampedTarget - b.angle) * springK - b.angularVel * springDamp;
          b.angularVel += accelAngle * subDt;
          b.angle += b.angularVel * subDt;
        } else {
          b.angle = 0;
          b.angularVel = 0;
        }
        b.targetAngle *= 0.86;
        continue;
      }

      // Apply mode-specific forces
      if (settings.mode === 'earth') {
        b.vy += settings.gravity * subDt;
        // Quadratic-ish air drag proportional to speed
        const airDamp = Math.pow(0.992, subDt * 60);
        b.vx *= airDamp;
        b.vy *= airDamp;
        b.angularVel *= Math.pow(0.965, subDt * 60);

        // Gentle self-righting torque only when nearly stationary on ground
        if (settings.tiltEnabled && b.kind === 'icon' && Math.abs(b.vy) < 25) {
          b.angularVel += (-b.angle * 18 - b.angularVel * 6) * subDt;
        }
      } else if (settings.mode === 'zero-g') {
        const spaceDamp = Math.pow(0.9975, subDt * 60);
        b.vx *= spaceDamp;
        b.vy *= spaceDamp;
        b.angularVel *= Math.pow(0.996, subDt * 60);

        // Gentle cosmic drift in Zero-G for desktop items
        if (b.kind !== 'window') {
          const speed = Math.hypot(b.vx, b.vy);
          if (speed < 16) {
            const hash = hashStr(b.id);
            const t = performance.now() * 0.0006 + hash;
            b.vx += Math.cos(t) * 14 * subDt;
            b.vy += Math.sin(t * 1.27) * 14 * subDt;
          }
        }

        // Radial cursor repulsion force field + tangential swirl
        if (settings.cursorRepel && cursor.active && b.kind !== 'window') {
          const cx = b.x + b.width * 0.5;
          const cy = b.y + b.height * 0.5;
          const dx = cx - cursor.x;
          const dy = cy - cursor.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 8 && dist < 185) {
            const norm = 1 - dist / 185;
            const force = norm * norm * 920;
            const nx = dx / dist;
            const ny = dy / dist;
            b.vx += nx * force * subDt;
            b.vy += ny * force * subDt;
            // Subtle torque from off-center repulsion
            b.angularVel += (nx * 12 - ny * 12) * norm * subDt * 4;
          }
        }
      } else {
        // 'tactile' mode: realistic kinetic + static surface friction & spring self-leveling
        const surfaceFriction = Math.pow(settings.friction, subDt * 60);
        b.vx *= surfaceFriction;
        b.vy *= surfaceFriction;
        b.angularVel *= Math.pow(0.93, subDt * 60);

        if (settings.tiltEnabled) {
          // Spring-damper gently aligns tilted objects back or lets heavy widgets settle smoothly
          const springK = b.kind === 'window' ? 140 : 65;
          const springDamp = b.kind === 'window' ? 14 : 9.5;
          const target = Math.max(-18, Math.min(18, b.vx * 0.0075));
          const accelAngle = (target - b.angle) * springK - b.angularVel * springDamp;
          b.angularVel += accelAngle * subDt;
        } else {
          b.angle = 0;
          b.angularVel = 0;
        }

        if (
          Math.hypot(b.vx, b.vy) < 3.5 &&
          Math.abs(b.angularVel) < 0.8 &&
          Math.abs(b.angle) < 0.15
        ) {
          b.vx = 0;
          b.vy = 0;
          b.angularVel = 0;
          b.angle = 0;
        }
      }

      // Integrate linear & angular position
      b.x += b.vx * subDt;
      b.y += b.vy * subDt;
      b.angle += b.angularVel * subDt;

      // Wrap/clamp extreme angles cleanly
      if (b.angle > 180) b.angle -= 360;
      if (b.angle < -180) b.angle += 360;

      // Boundary collisions (exact rotated corners for icons/widgets, AABB clamp for windows)
      if (b.kind === 'window') {
        const minX = bounds.left;
        const minY = bounds.top;
        const maxX = Math.max(minX, bounds.right - b.width);
        const maxY = Math.max(minY, bounds.bottom - b.height);
        if (b.x < minX) {
          b.x = minX;
          b.vx = Math.abs(b.vx) * bounce * 0.65;
        } else if (b.x > maxX) {
          b.x = maxX;
          b.vx = -Math.abs(b.vx) * bounce * 0.65;
        }
        if (b.y < minY) {
          b.y = minY;
          b.vy = Math.abs(b.vy) * bounce * 0.65;
        } else if (b.y > maxY) {
          b.y = maxY;
          b.vy = -Math.abs(b.vy) * bounce * 0.65;
        }
      } else {
        resolveBoundaryOBB(b, bounds, bounce, surfaceMu, settings.mode, subDt, impacts);
      }
    }

    // SAT OBB Collisions among desktop elements (and optionally against windows)
    if (settings.collisionsEnabled) {
      const dynamicBodies = list.filter((b) => b.kind !== 'window');
      for (let i = 0; i < dynamicBodies.length; i++) {
        for (let j = i + 1; j < dynamicBodies.length; j++) {
          const a = dynamicBodies[i];
          const b = dynamicBodies[j];
          const manifold = detectOBBCollision(a, b);
          if (manifold) {
            resolveRigidBodyCollision(a, b, manifold, bounce, surfaceMu, subDt, impacts);
          }
        }
      }

      // Optional collision between desktop widgets and open non-maximized windows
      // Windows never interfere or collide with desktop icons
      if (settings.windowCollisions) {
        const windowBodies = list.filter((b) => b.kind === 'window');
        for (const win of windowBodies) {
          for (const item of dynamicBodies) {
            if (item.kind === 'icon') continue;
            const manifold = detectOBBCollision(item, win);
            if (manifold) {
              resolveRigidBodyCollision(
                item,
                win,
                manifold,
                Math.min(0.65, bounce),
                surfaceMu,
                subDt,
                impacts
              );
            }
          }
        }
      }
    }
  }

  return { impacts };
}

function hashStr(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h % 100);
}
