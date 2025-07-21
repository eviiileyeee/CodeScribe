"use client";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
export default function InstallPopup() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      if (!localStorage.getItem("install-dismissed")) {
        event.preventDefault();
        setDeferredPrompt(event);
        setShow(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        localStorage.setItem("install-dismissed", "true");
        setShow(false);
      }
    }
  };

  const handleDismiss = () => {
    localStorage.setItem("install-dismissed", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:right-auto md:left-4 p-4 z-50 flex justify-start items-end">
      <Card className="p-6 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 max-w-sm w-full">
        <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">Install App</h2>
        <p className="text-sm mb-4 text-gray-700 dark:text-gray-300">Install this app on your device for a better experience.</p>
        <div className="flex gap-2">
          <Button
            onClick={handleInstallClick}
            className="px-6 py-2 font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded shadow-lg transition-all duration-200 transform hover:scale-105 hover:shadow-2xl hover:from-indigo-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
          >
            Install
          </Button>
          <Button
            onClick={handleDismiss}
            className="px-4 py-2 bg-gray-200 text-black rounded border border-gray-300 hover:bg-gray-300 transition-colors dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Not Now
          </Button>
        </div>
      </Card>
    </div>
  );
}

// TypeScript declaration for BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}
