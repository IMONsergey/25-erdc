import { createElement, forwardRef } from "react";
import * as nodes from "lucide";
// The existing dependency is the framework-neutral Lucide icon-node package.
// Adapt the official nodes to React without adding a second icon library.
function icon(name) {
  const Component = forwardRef(function LucideIcon(
    { size = 24, strokeWidth = 1.75, className = "", ...props },
    ref,
  ) {
    return createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
        focusable: false,
        className,
        ref,
        ...props,
      },
      ...nodes[name].map(([tag, attrs], i) =>
        createElement(tag, { ...attrs, key: i }),
      ),
    );
  });
  Component.displayName = name;
  return Component;
}
export const ArrowUpRight = icon("ArrowUpRight"),
  ArrowRight = icon("ArrowRight"),
  ArrowLeft = icon("ArrowLeft"),
  ArrowDown = icon("ArrowDown"),
  Search = icon("Search"),
  Menu = icon("Menu"),
  X = icon("X"),
  Plus = icon("Plus"),
  Minus = icon("Minus"),
  MapPin = icon("MapPin"),
  Map = icon("Map"),
  Grid2X2 = icon("Grid2X2"),
  Building2 = icon("Building2"),
  Trees = icon("Trees"),
  School = icon("School"),
  ChevronDown = icon("ChevronDown"),
  ExternalLink = icon("ExternalLink"),
  SlidersHorizontal = icon("SlidersHorizontal"),
  Copy = icon("Copy"),
  Check = icon("Check"),
  ZoomIn = icon("ZoomIn"),
  ChevronLeft = icon("ChevronLeft"),
  ChevronRight = icon("ChevronRight"),
  RotateCcw = icon("RotateCcw"),
  List = icon("List");
