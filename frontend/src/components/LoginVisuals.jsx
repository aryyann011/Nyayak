"use client";

import React, { forwardRef, useRef } from "react";
import { cn } from "../lib/utils";
// ⚠️ CHECK THIS PATH: If your component is in registry, change to "@/registry/magicui/animated-beam"
import { AnimatedBeam } from "@/components/ui/animated-beam"; 
import { 
  User, 
  FileText, 
  Shield, 
  Scale, 
  BrainCircuit, 
  Gavel, 
  MessageSquare 
} from "lucide-react";

const Circle = forwardRef(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-slate-200 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

export default function LoginVisuals({ className }) {
  const containerRef = useRef(null);
  const div1Ref = useRef(null);
  const div2Ref = useRef(null);
  const div3Ref = useRef(null);
  const div4Ref = useRef(null);
  const div5Ref = useRef(null);
  const centerRef = useRef(null);
  const destRef = useRef(null);

  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full items-center justify-center overflow-hidden bg-transparent",
        className
      )}
      ref={containerRef}
    >
      <div className="flex h-full w-full flex-row items-stretch justify-between gap-10">
        <div className="flex flex-col justify-center gap-6">
          <Circle ref={div1Ref} className="border-orange-100">
            <User className="h-6 w-6 text-slate-600" />
          </Circle>
          <Circle ref={div2Ref} className="border-orange-100">
            <FileText className="h-6 w-6 text-slate-600" />
          </Circle>
          <Circle ref={div3Ref} className="border-orange-100">
            <MessageSquare className="h-6 w-6 text-slate-600" />
          </Circle>
          <Circle ref={div4Ref} className="border-orange-100">
            <Shield className="h-6 w-6 text-slate-600" />
          </Circle>
          <Circle ref={div5Ref} className="border-orange-100">
            <Gavel className="h-6 w-6 text-slate-600" />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={centerRef} className="h-24 w-24 border-orange-500 bg-orange-50">
            <BrainCircuit className="h-12 w-12 text-orange-600" />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={destRef} className="h-20 w-20 border-green-200 bg-green-50">
            <Scale className="h-10 w-10 text-green-600" />
          </Circle>
        </div>
      </div>

      <AnimatedBeam containerRef={containerRef} fromRef={div1Ref} toRef={centerRef} duration={3} />
      <AnimatedBeam containerRef={containerRef} fromRef={div2Ref} toRef={centerRef} duration={3} />
      <AnimatedBeam containerRef={containerRef} fromRef={div3Ref} toRef={centerRef} duration={3} />
      <AnimatedBeam containerRef={containerRef} fromRef={div4Ref} toRef={centerRef} duration={3} />
      <AnimatedBeam containerRef={containerRef} fromRef={div5Ref} toRef={centerRef} duration={3} />
      <AnimatedBeam containerRef={containerRef} fromRef={centerRef} toRef={destRef} duration={3} />
    </div>
  );
}