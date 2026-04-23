"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { PackageId } from "@/config/packages";
import { PricingCards } from "@/components/pricing/pricing-cards";

export function PricingSelection({
  requestId,
  initialPackage = "PREMIUM",
  paymentStatus
}: {
  requestId: string;
  initialPackage?: PackageId;
  paymentStatus?: string | null;
}) {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<PackageId | undefined>(initialPackage);
  const [loadingPackage, setLoadingPackage] = useState<PackageId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const activeRequestRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  async function readJson(response: Response) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  useEffect(() => {
    setSelectedPackage(initialPackage);
    setLoadingPackage(null);
    setError(null);
  }, [initialPackage]);

  useEffect(() => {
    const resetCheckoutState = () => {
      abortControllerRef.current?.abort();
      activeRequestRef.current += 1;
      setLoadingPackage(null);
    };

    const handlePageShow = () => {
      resetCheckoutState();
      router.refresh();
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      abortControllerRef.current?.abort();
    };
  }, [router]);

  async function handleSelect(packageId: PackageId) {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const requestToken = activeRequestRef.current + 1;
    activeRequestRef.current = requestToken;
    let didRedirect = false;
    const timeoutId = window.setTimeout(() => {
      if (activeRequestRef.current !== requestToken) {
        return;
      }

      controller.abort();
      setLoadingPackage(null);
      setError("Checkout is taking too long. Please try again.");
    }, 15000);

    setSelectedPackage(packageId);
    setLoadingPackage(packageId);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, packageId }),
        signal: controller.signal,
        cache: "no-store"
      });

      const data = await readJson(response);
      if (activeRequestRef.current !== requestToken) {
        return;
      }

      if (response.ok && data?.url && data?.packageId === packageId) {
        didRedirect = true;
        setLoadingPackage(null);
        window.location.href = data.url;
        return;
      }

      setError(data?.error ?? "Checkout could not be created.");
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        return;
      }

      if (activeRequestRef.current === requestToken) {
        setError("Checkout could not be created. Please try again.");
      }
    } finally {
      window.clearTimeout(timeoutId);
      if (activeRequestRef.current === requestToken && !didRedirect) {
        setLoadingPackage(null);
      }
    }
  }

  return (
    <div className="space-y-5">
      {paymentStatus === "FAILED" ? (
        <div className="rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          Your previous checkout was not completed. You can safely choose a package again.
        </div>
      ) : null}
      {error ? (
        <div className="rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>
      ) : null}
      <PricingCards
        requestId={requestId}
        selectedPackage={selectedPackage}
        loadingPackage={loadingPackage}
        onSelect={handleSelect}
      />
    </div>
  );
}
