import { useEffect, useRef, useState } from "react";
import { MorphIcon } from "morphicons/react";
import {
  Menu,
  X,
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  ArrowDownRight,
  ArrowUp,
  Maximize2,
  Minimize2,
  RotateCcw,
  Check,
  MapPin,
  Anchor,
  Globe2,
  Route,
  Plane,
  TrainFront,
  Users,
  ChartNoAxesCombined,
  ChevronDown,
  Plus,
  Minus,
  Building2,
  GraduationCap,
  BusFront,
  Zap,
  Trees,
  Compass,
  Container,
  Ship,
  Waves,
  School,
  Stethoscope,
  Dumbbell,
  Flame,
  Droplets,
  Factory,
  Landmark,
  Sparkles,
  Camera,
  ExternalLink,
  Info,
} from "lucide";
const icons = {
  menu: Menu,
  close: X,
  arrow: ArrowUpRight,
  right: ArrowRight,
  left: ArrowLeft,
  down: ArrowDown,
  diagonal: ArrowDownRight,
  up: ArrowUp,
  expand: Maximize2,
  collapse: Minimize2,
  reset: RotateCcw,
  check: Check,
  pin: MapPin,
  anchor: Anchor,
  globe: Globe2,
  route: Route,
  plane: Plane,
  train: TrainFront,
  people: Users,
  quality: ChartNoAxesCombined,
  chevron: ChevronDown,
  plus: Plus,
  minus: Minus,
  housing: Building2,
  social: GraduationCap,
  transport: BusFront,
  engineering: Zap,
  ecology: Trees,
  tourism: Compass,
  economy: Container,
  ship: Ship,
  waves: Waves,
  school: School,
  health: Stethoscope,
  sport: Dumbbell,
  heat: Flame,
  water: Droplets,
  factory: Factory,
  heritage: Landmark,
  spark: Sparkles,
  camera: Camera,
  external: ExternalLink,
  info: Info,
};
/** All UI icons use Morphicons with the same Lucide data, weight and motion policy. */
export default function Icon({
  name,
  activeName,
  active = false,
  hoverName,
  size = 24,
  className = "",
}) {
  const host = useRef(null);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    if (!hoverName) return;
    const trigger = host.current?.closest("button,a,[data-icon-trigger]");
    if (!trigger) return;
    const enter = () => setHovered(true);
    const leave = () => setHovered(false);
    trigger.addEventListener("mouseenter", enter);
    trigger.addEventListener("mouseleave", leave);
    trigger.addEventListener("focus", enter);
    trigger.addEventListener("blur", leave);
    return () => {
      trigger.removeEventListener("mouseenter", enter);
      trigger.removeEventListener("mouseleave", leave);
      trigger.removeEventListener("focus", enter);
      trigger.removeEventListener("blur", leave);
    };
  }, [hoverName]);
  const target =
    active && activeName ? activeName : hovered && hoverName ? hoverName : name;
  return (
    <span
      ref={host}
      className={`morph-icon ${className}`}
      aria-hidden="true"
      style={{ width: size, height: size }}
    >
      <MorphIcon
        icon={icons[target] || icons[name]}
        size={size}
        strokeWidth={1.65}
        spring="smooth"
        reducedMotion="user"
      />
    </span>
  );
}
