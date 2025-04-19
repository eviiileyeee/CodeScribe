"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";



const Hero = () => {
  const { theme } = useTheme();

  return (  
    <ContainerScroll
      titleComponent={
        <>
          <section>
            <div className="absolute inset-0 -z-10 h-[150vh] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)]" />
            <Particles
              className="absolute inset-0 -z-20"
              quantity={100}
              color={theme === "light" ? "#000000" : "#ffffff"}
              ease={20}
              refresh
            />
            <div>
              <section className="flex items-center justify-center">
                <div className="inline-flex items-center rounded-full border border-neutral-300 bg-gray-200 p-1 pr-3 dark:border-neutral-700 dark:bg-neutral-900">
                  <span className="mr-2 rounded-full border border-neutral-300 bg-white px-3 py-1 text-sm font-semibold dark:border-neutral-700 dark:bg-neutral-500/10">
                    New
                  </span>
                  <span className="text-sm">Introducing Code Scribe AI 🐬</span>
                  <ArrowRight size={16} className="ml-2" />
                </div>
              </section>
              <div className="flex h-full flex-col items-center justify-center">
                <div className="mt-8 flex max-w-3xl flex-col items-center md:w-full">
                  <h1 className="text-center text-4xl font-bold text-neutral-800 dark:text-white md:text-6xl">
                    Transform your code to different languages {" "}
                    <span className="bg-gradient-to-r from-blue-500 from-20% to-[#0051ff] bg-clip-text text-transparent">
                      {" "}
                      in few minutes{" "}
                    </span>
                  </h1>
                  <p className="my-6 text-center text-base text-gray-700 dark:text-gray-300 md:text-lg">
                    Trust me when I say this, Metamorix UI is the best way to
                    build your next website. It&apos;s fast, reliable, and easy to
                    use. You can build your dream website in minutes.
                  </p>

                  <Link href="/converter">
                    <button className="relative mt-4 cursor-pointer rounded-[16px] border-none bg-[radial-gradient(circle_80px_at_80%_-10%,#ffffff,#181b1b)] p-[2px] text-lg transition-all duration-150">
                      <div className="absolute bottom-0 left-0 h-full w-[70px] rounded-[16px] bg-[radial-gradient(circle_60px_at_0%_100%,#3fe9ff,#0000ff80,transparent)] shadow-[-10px_10px_30px_#0051ff2d] transition-all duration-150" />
                      <div className="absolute right-0 top-0 z-[-1] h-3/5 w-[65%] rounded-[120px] shadow-[0_0_20px_#ffffff38] transition-all duration-150" />
                      <div className="relative z-[3] flex items-center gap-3 rounded-[14px] bg-[radial-gradient(circle_80px_at_80%_-50%,#777777,#0f1111)] px-4 py-2 text-white transition-all duration-150">
                        Get Started <ArrowRight className="size-5" />
                        <div className="absolute inset-0 rounded-[14px] bg-[radial-gradient(circle_60px_at_0%_100%,#00e1ff1a,#0000ff11,transparent)] transition-all duration-150" />
                      </div>
                    </button>
                  </Link>
                </div>
                <div className="relative flex w-full items-center px-4 py-10 md:py-20">
                  <div
                    style={{
                      background:
                        "conic-gradient(from 230.29deg at 51.63% 52.16%, #2400ff 0deg, #0087ff 67.5deg, #6c279d 198.75deg, #1826a3 251.25deg, 667c4 301.88deg, #691eff 1turn)",
                    }}
                    className="absolute inset-0 left-1/2 top-1/2 -z-10 size-2/4 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[10rem]"
                  />
                </div>
              </div>
            </div>
          </section>
        </>
      }
    >
      <Image
        alt="header"
        width={1920}
        height={1080}
        className="rounded-[20px]"
        src="/image.png"
      />
    </ContainerScroll>
  );
};

export default Hero;

interface MousePosition {
  x: number;
  y: number;
}

function MousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return mousePosition;
}

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}
function hexToRgb(hex: string): number[] {
  hex = hex.replace("#", "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const hexInt = parseInt(hex, 16);
  const red = (hexInt >> 16) & 255;
  const green = (hexInt >> 8) & 255;
  const blue = hexInt & 255;
  return [red, green, blue];
}

const Particles: React.FC<ParticlesProps> = ({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const mousePosition = MousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  const initCanvas = useCallback(() => {
    resizeCanvas();
    drawParticles();
  }, []);

  const onMouseMove = useCallback(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePosition.x - rect.left - w / 2;
      const y = mousePosition.y - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  }, [mousePosition.x, mousePosition.y]);

  type Circle = {
    x: number;
    y: number;
    translateX: number;
    translateY: number;
    size: number;
    alpha: number;
    targetAlpha: number;
    dx: number;
    dy: number;
    magnetism: number;
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current.length = 0;
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
    }
  };

  const circleParams = (): Circle => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const translateX = 0;
    const translateY = 0;
    const pSize = Math.floor(Math.random() * 2) + size;
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
    const dx = (Math.random() - 0.5) * 0.1;
    const dy = (Math.random() - 0.5) * 0.1;
    const magnetism = 0.1 + Math.random() * 4;
    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    };
  };

  const rgb = hexToRgb(color);

  const drawCircle = (circle: Circle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);
      context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
      context.current.fill();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    }
  };

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h,
      );
    }
  };

  const drawParticles = () => {
    clearContext();
    const particleCount = quantity;
    for (let i = 0; i < particleCount; i++) {
      const circle = circleParams();
      drawCircle(circle);
    }
  };

  const animate = useCallback(() => {
    clearContext();
    drawParticles();
    requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();
    window.addEventListener("resize", initCanvas);

    return () => {
      window.removeEventListener("resize", initCanvas);
    };
  }, [color, initCanvas, animate]);

  useEffect(() => {
    onMouseMove();
  }, [mousePosition.x, mousePosition.y, onMouseMove]);

  useEffect(() => {
    initCanvas();
  }, [refresh, initCanvas]);

  return (
    <div className={className} ref={canvasContainerRef} aria-hidden="true">
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
};

const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="relative flex items-center justify-center"
      ref={containerRef}
    >
      <div
        className="relative w-full py-10 md:py-40"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

const Header = ({ translate, titleComponent }: { translate: MotionValue<number>; titleComponent: React.ReactNode }) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div mx-auto max-w-5xl text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
      }}
      className="mx-auto -mt-12 h-auto w-full max-w-5xl rounded-[30px]"
    >
      <div className="relative mx-auto w-full rounded-[32px] border border-neutral-300 bg-neutral-200 p-2 opacity-100 backdrop-blur-lg will-change-auto dark:border-neutral-700 dark:bg-neutral-800/50 md:p-4">
        {children}
      </div>
    </motion.div>
  );
};
