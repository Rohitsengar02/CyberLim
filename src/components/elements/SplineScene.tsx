
// src/components/elements/SplineScene.tsx
"use client";

import React from 'react';

// For Features Section
export function FeaturesBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div className="shape-blob shape-1" />
      <div className="shape-blob shape-2" />
      <div className="shape-blob shape-3" />
    </div>
  );
}

// For Projects Section
export function ProjectsBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div className="project-shape-blob project-shape-1" />
      <div className="project-shape-blob project-shape-2" />
      <div className="project-shape-blob project-shape-3" />
    </div>
  );
}
