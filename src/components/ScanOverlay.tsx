"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

type ScanMode = "qr" | "barcode";

interface BarcodeDetectorResult {
  rawValue: string;
}
interface BarcodeDetectorLike {
  detect(source: CanvasImageSource): Promise<BarcodeDetectorResult[]>;
}
declare global {
  interface Window {
    BarcodeDetector?: new (options: { formats: string[] }) => BarcodeDetectorLike;
  }
}

export function ScanOverlay({
  open,
  onClose,
  onResult,
}: {
  open: boolean;
  onClose: () => void;
  onResult: (value: string) => void;
}) {
  const [mode, setMode] = useState<ScanMode>("qr");
  const [status, setStatus] = useState("カメラ起動中...");
  const [manualCode, setManualCode] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const scanCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const detectorRef = useRef<BarcodeDetectorLike | null | undefined>(undefined);

  useEffect(() => {
    if (!open) return;

    if (detectorRef.current === undefined) {
      if (typeof window.BarcodeDetector !== "undefined") {
        try {
          detectorRef.current = new window.BarcodeDetector({
            formats: ["qr_code", "ean_13", "ean_8", "upc_a", "upc_e", "code_128"],
          });
        } catch {
          detectorRef.current = null;
        }
      } else {
        detectorRef.current = null;
      }
    }
    if (!scanCanvasRef.current) scanCanvasRef.current = document.createElement("canvas");

    setStatus("カメラを起動しています...");
    let cancelled = false;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          if (cancelled) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
          setStatus(detectorRef.current ? "読み取り中..." : "QRを読み取り中...（バーコードは非対応ブラウザのため下欄に直接入力してください）");
          rafRef.current = requestAnimationFrame(scanTick);
        })
        .catch(() => {
          setStatus("カメラを起動できませんでした。下の欄に直接入力してください。");
        });
    } else {
      setStatus("このブラウザはカメラ利用に対応していません。下の欄に直接入力してください。");
    }

    function scanTick() {
      const video = videoRef.current;
      if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
        const detector = detectorRef.current;
        if (detector) {
          detector
            .detect(video)
            .then((codes) => {
              if (codes && codes.length > 0) {
                handleResult(codes[0].rawValue);
              } else {
                rafRef.current = requestAnimationFrame(scanTick);
              }
            })
            .catch(() => {
              rafRef.current = requestAnimationFrame(scanTick);
            });
          return;
        } else {
          const canvas = scanCanvasRef.current!;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const result = jsQR(imgData.data, imgData.width, imgData.height);
            if (result && result.data) {
              handleResult(result.data);
              return;
            }
          }
        }
      }
      rafRef.current = requestAnimationFrame(scanTick);
    }

    function handleResult(value: string) {
      stopStream();
      onResult(value);
    }

    function stopStream() {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    }

    return () => {
      cancelled = true;
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleClose() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    onClose();
  }

  function handleManualSubmit() {
    const val = manualCode.trim();
    if (!val) return;
    handleClose();
    onResult(val);
    setManualCode("");
  }

  if (!open) return null;

  return (
    <div className="overlay">
      <div className="overlay-box">
        <h3>QR / バーコード スキャナー</h3>
        <div className="scan-tabs">
          <div className={"chip" + (mode === "qr" ? " active" : "")} onClick={() => setMode("qr")}>
            QRを読む
          </div>
          <div className={"chip" + (mode === "barcode" ? " active" : "")} onClick={() => setMode("barcode")}>
            バーコードを読む
          </div>
        </div>
        <div className="scan-video-wrap">
          <video ref={videoRef} playsInline autoPlay muted />
        </div>
        <div className="scan-status">{status}</div>
        <div className="manual-entry">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder={mode === "qr" ? "QRが読み取れない場合はここにコード文字列を入力" : "バーコードの数字を直接入力"}
          />
          <button className="small" type="button" onClick={handleManualSubmit}>
            決定
          </button>
        </div>
        <div className="overlay-close">
          <button className="small" type="button" onClick={handleClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
