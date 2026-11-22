import { CollisionImpactEvent, PhysicsBody, PhysicsSettings } from '../types/os';

export interface PointerSample {
  x: number;
  y: number;
  t: number;
}

export class PointerVelocityTracker {
  private samples: PointerSample[] = [];

  public reset(x: number, y: number) {
    this.samples = [{ x, y, t: performance.now() }];
  }

  public push(x: number, y: number) {
    const now = performance.now();
    this.samples.push({ x, y, t: now });
    // Keep only last 90ms of motion for responsive throw velocity
    while (this.samples.length > 2 && now - this.samples[0].t > 90) {
      this.samples.shift();
    }
  }

  public getVelocity(): { vx: number; vy: number } {
    if (this.samples.length < 2) return { vx: 0, vy: 0 };
    const first = this.samples[0];
    const last = this.samples[this.samples.length - 1];
    const dt = (last.t - first.t) / 1000;
    if (dt < 0.004) return { vx: 0, vy: 0 };
    const vx = (last.x - first.x) / dt;
    const vy = (last.y - first.y) / dt;
    // Clamp extreme pointer spikes
    const maxV = 2800;
    return {
      vx: Math.max(-maxV, Math.min(maxV, vx)),
      vy: Math.max(-maxV, Math.min(maxV, vy)),
    };
  }
}

export interface DesktopBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface StepPhysicsResult {
  impacts: CollisionImpactEvent[];
}

/**
 * Steps all physics bodies (icons, media widgets, windows) for one frame dt (seconds).
 * Handles:
 *  - Mode-specific forces (tactile surface friction, earth gravity, zero-g orbital drift + cursor repulsion)
 *  - Spring-damper tilt dynamics
 *  - Boundary restitution & wall collisions
 *  - Elastic AABB impulse resolution between icons & widgets
 */
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
      b.angle *= 0.8;
      if (Math.abs(b.angle) < 0.05) b.angle = 0;
      b.scale += ((b.isDragging ? 1.04 : 1) - b.scale) * 0.25;
    });
    return { impacts };
  }

  const dt = Math.min(dtRaw, 0.033); // Cap dt to prevent tunneling on tab switch
  const substeps = settings.mode === 'earth' ? 2 : 1;
  const subDt = dt / substeps;

  const list = Array.from(bodies.values());

  for (let step = 0; step < substeps; step++) {
    for (const b of list) {
      // Smooth scale transition
      const desiredScale = b.isDragging ? 1.05 : 1;
      b.scale += (desiredScale - b.scale) * Math.min(1, subDt * 18);

      // Spring-damper angular physics (tilt from velocity or impact torque)
      if (settings.tiltEnabled) {
        const springK = 145;
        const springDamp = 14;
        const target = b.isDragging
          ? Math.max(-13, Math.min(13, b.targetAngle))
          : Math.max(-18, Math.min(18, b.vx * 0.0085));
        const accelAngle = (target - b.angle) * springK - b.angularVel * springDamp;
        b.angularVel += accelAngle * subDt;
        b.angle += b.angularVel * subDt;
        if (!b.isDragging && Math.abs(b.angle) < 0.02 && Math.abs(b.angularVel) < 0.08 && Math.abs(b.vx) < 3) {
          b.angle = 0;
          b.angularVel = 0;
        }
      } else {
        b.angle = 0;
        b.angularVel = 0;
      }

      if (b.isDragging) {
        b.targetAngle *= 0.88;
        continue;
      }

      // Forces by mode
      if (settings.mode === 'earth') {
        b.vy += settings.gravity * subDt;
        // Air drag
        const airDamp = Math.pow(0.988, subDt * 60);
        b.vx *= airDamp;
        b.vy *= airDamp;
      } else if (settings.mode === 'zero-g') {
        // Gentle orbital drag + soft cursor gravity/repel field
        const spaceDamp = Math.pow(0.996, subDt * 60);
        b.vx *= spaceDamp;
        b.vy *= spaceDamp;

        // Keep minimum gentle float drift for icons & widgets
        if (b.kind !== 'window') {
          const speed = Math.hypot(b.vx, b.vy);
          if (speed < 18) {
            const hash = hashStr(b.id);
            const t = performance.now() * 0.0007 + hash;
            b.vx += Math.cos(t) * 14 * subDt;
            b.vy += Math.sin(t * 1.3) * 14 * subDt;
          }
        }

        if (settings.cursorRepel && cursor.active && b.kind !== 'window') {
          const cx = b.x + b.width * 0.5;
          const cy = b.y + b.height * 0.5;
          const dx = cx - cursor.x;
          const dy = cy - cursor.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 8 && dist < 170) {
            const force = ((170 - dist) / 170) * 680;
            b.vx += (dx / dist) * force * subDt;
            b.vy += (dy / dist) * force * subDt;
          }
        }
      } else {
        // 'tactile' mode: realistic surface friction
        const surfaceFriction = Math.pow(settings.friction, subDt * 60);
        b.vx *= surfaceFriction;
        b.vy *= surfaceFriction;
        if (Math.hypot(b.vx, b.vy) < 4) {
          b.vx = 0;
          b.vy = 0;
        }
      }

      // Integrate position
      b.x += b.vx * subDt;
      b.y += b.vy * subDt;

      // Boundary collisions
      const minX = bounds.left;
      const minY = bounds.top;
      const maxX = Math.max(minX, bounds.right - b.width);
      const maxY = Math.max(minY, bounds.bottom - b.height);
      const bounce = settings.mode === 'zero-g' ? Math.max(0.75, settings.restitution) : settings.restitution;

      if (b.x < minX) {
        const impactSpeed = Math.abs(b.vx);
        b.x = minX;
        b.vx = Math.abs(b.vx) * bounce;
        b.angularVel += (Math.random() - 0.5) * impactSpeed * 0.05;
        if (impactSpeed > 130) {
          impacts.push({ x: minX, y: b.y + b.height * 0.5, intensity: Math.min(1, impactSpeed / 1200), color: '#00F0FF' });
        }
      } else if (b.x > maxX) {
        const impactSpeed = Math.abs(b.vx);
        b.x = maxX;
        b.vx = -Math.abs(b.vx) * bounce;
        b.angularVel += (Math.random() - 0.5) * impactSpeed * 0.05;
        if (impactSpeed > 130) {
          impacts.push({ x: bounds.right, y: b.y + b.height * 0.5, intensity: Math.min(1, impactSpeed / 1200), color: '#00F0FF' });
        }
      }

      if (b.y < minY) {
        const impactSpeed = Math.abs(b.vy);
        b.y = minY;
        b.vy = Math.abs(b.vy) * bounce;
        if (impactSpeed > 130) {
          impacts.push({ x: b.x + b.width * 0.5, y: minY, intensity: Math.min(1, impactSpeed / 1200), color: '#FF007A' });
        }
      } else if (b.y > maxY) {
        const impactSpeed = Math.abs(b.vy);
        b.y = maxY;
        if (settings.mode === 'earth' && impactSpeed < 55) {
          b.vy = 0;
          b.vx *= Math.pow(0.82, subDt * 60); // Floor friction
        } else {
          b.vy = -Math.abs(b.vy) * bounce;
          b.vx *= 0.92;
        }
        if (impactSpeed > 150) {
          impacts.push({ x: b.x + b.width * 0.5, y: bounds.bottom, intensity: Math.min(1, impactSpeed / 1200), color: '#FF007A' });
        }
      }
    }

    // Elastic AABB collisions among non-window desktop elements (icons & widgets)
    if (settings.collisionsEnabled) {
      const colliders = list.filter((b) => b.kind !== 'window');
      for (let i = 0; i < colliders.length; i++) {
        for (let j = i + 1; j < colliders.length; j++) {
          const a = colliders[i];
          const b = colliders[j];

          const ax2 = a.x + a.width;
          const ay2 = a.y + a.height;
          const bx2 = b.x + b.width;
          const by2 = b.y + b.height;

          const overlapX = Math.min(ax2, bx2) - Math.max(a.x, b.x);
          const overlapY = Math.min(ay2, by2) - Math.max(a.y, b.y);

          if (overlapX > 0 && overlapY > 0) {
            // Minimum translation vector along shallowest axis
            let nx = 0;
            let ny = 0;
            let pen = 0;
            if (overlapX < overlapY) {
              pen = overlapX;
              nx = a.x + a.width * 0.5 < b.x + b.width * 0.5 ? -1 : 1;
            } else {
              pen = overlapY;
              ny = a.y + a.height * 0.5 < b.y + b.height * 0.5 ? -1 : 1;
            }

            const invMassA = a.isDragging ? 0 : 1 / Math.max(1, a.mass);
            const invMassB = b.isDragging ? 0 : 1 / Math.max(1, b.mass);
            const invMassSum = invMassA + invMassB;
            if (invMassSum === 0) continue;

            // Positional correction
            const corr = pen / invMassSum;
            a.x += nx * corr * invMassA;
            a.y += ny * corr * invMassA;
            b.x -= nx * corr * invMassB;
            b.y -= ny * corr * invMassB;

            // Relative velocity along collision normal
            const rvx = a.vx - b.vx;
            const rvy = a.vy - b.vy;
            const velAlongNormal = rvx * nx + rvy * ny;

            if (velAlongNormal < 0) {
              const e = settings.mode === 'zero-g' ? 0.85 : Math.max(0.35, settings.restitution);
              const impulse = (-(1 + e) * velAlongNormal) / invMassSum;
              const ix = impulse * nx;
              const iy = impulse * ny;

              if (!a.isDragging) {
                a.vx += ix * invMassA;
                a.vy += iy * invMassA;
                a.angularVel += (nx * 14 - ny * 8) * Math.min(2, Math.abs(velAlongNormal) / 300);
              }
              if (!b.isDragging) {
                b.vx -= ix * invMassB;
                b.vy -= iy * invMassB;
                b.angularVel -= (nx * 14 - ny * 8) * Math.min(2, Math.abs(velAlongNormal) / 300);
              }

              const impactSpeed = Math.abs(velAlongNormal);
              if (impactSpeed > 140) {
                impacts.push({
                  x: (Math.max(a.x, b.x) + Math.min(ax2, bx2)) * 0.5,
                  y: (Math.max(a.y, b.y) + Math.min(ay2, by2)) * 0.5,
                  intensity: Math.min(1, impactSpeed / 1000),
                  color: '#A855F7',
                });
              }
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
