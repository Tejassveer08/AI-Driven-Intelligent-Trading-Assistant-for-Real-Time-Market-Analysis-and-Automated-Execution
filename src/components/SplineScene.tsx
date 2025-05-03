import { useEffect, useRef } from "react";

interface SplineSceneProps {
  sceneUrl: string;
  className?: string;
}

const SplineScene = ({ sceneUrl, className = "" }: SplineSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptId = "spline-viewer-script";

    const loadScript = () => {
      return new Promise<void>((resolve, reject) => {
        // Prevent loading script multiple times
        if (document.getElementById(scriptId)) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.id = scriptId;
        script.type = "module";
        script.src = "https://unpkg.com/@splinetool/viewer@1.9.89/build/spline-viewer.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Spline viewer script."));
        document.body.appendChild(script);
      });
    };

    const insertViewer = async () => {
      try {
        await loadScript();

        if (containerRef.current) {
          containerRef.current.innerHTML = "";
          const splineViewer = document.createElement("spline-viewer");
          splineViewer.setAttribute("url", sceneUrl);
          splineViewer.style.width = "100%";
          splineViewer.style.height = "100%";
          containerRef.current.appendChild(splineViewer);
        }
      } catch (error) {
        console.error("Failed to initialize Spline viewer:", error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="w-full h-full flex items-center justify-center bg-dark-100/50 rounded-xl overflow-hidden border border-neon/20">
              <div class="text-red-400 text-center p-4">
                <p>Failed to load 3D scene</p>
              </div>
            </div>
          `;
        }
      }
    };

    insertViewer();

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [sceneUrl]);

  return (
    <div
      ref={containerRef}
      className={`spline-scene w-full h-full ${className}`}
    />
  );
};

export default SplineScene;
