import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { KidContextType } from "./types";
import { KidContext } from "./KidContext";
import type { Kid } from "@grow-fitness/shared-types";
import { useAuth } from "@/contexts/useAuth";
import { kidsService } from "@/services/kids.service";

export function KidProvider({ children }: { children: ReactNode }) {
  const { role, user } = useAuth();
  const [kids, setKids] = useState<Kid[]>([]);
  const [selectedKid, setSelectedKid] = useState<Kid | null>(() => {
    try {
      const saved = localStorage.getItem("selectedKid");
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem("selectedKid");
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  // 🔹 persist selection
  useEffect(() => {
    if (selectedKid) {
      localStorage.setItem("selectedKid", JSON.stringify(selectedKid));
    } else {
      localStorage.removeItem("selectedKid");
    }
  }, [selectedKid]);

  useEffect(() => {
    if (role !== "PARENT" || !user?.id) {
      setKids([]);
      setSelectedKid(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchKids = async () => {
      try {
        setIsLoading(true);
        const response = await kidsService.getKids(1, 50, user.id);

        const mappedKids = response.data
          .map((kid: Kid & { _id?: string }) => {
            const id = kid.id || kid._id;
            if (!id) return null;
            return {
              ...kid,
              id,
              birthDate: new Date(kid.birthDate),
              createdAt: kid.createdAt ? new Date(kid.createdAt) : new Date(),
              updatedAt: kid.updatedAt ? new Date(kid.updatedAt) : new Date(),
            };
          })
          .filter((kid): kid is Kid => kid !== null);

        if (cancelled) return;

        setKids(mappedKids);
        setSelectedKid((prev) => {
          if (prev && mappedKids.some((kid) => kid.id === prev.id)) {
            return prev;
          }
          return mappedKids[0] ?? null;
        });
      } catch (error) {
        if (!cancelled) {
          console.error("❌ Failed to fetch kids", error);
          setKids([]);
          setSelectedKid(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchKids();

    return () => {
      cancelled = true;
    };
  }, [role, user?.id]);

  const setSelectedKidId = useCallback(
    (id: string | null) => {
      if (!id) {
        setSelectedKid(null);
        return;
      }
      setSelectedKid(kids.find((kid) => kid.id === id) ?? null);
    },
    [kids]
  );

  const value = useMemo<KidContextType>(
    () => ({
      kids,
      selectedKid,
      setSelectedKid,
      isLoading,
      selectedKidId: selectedKid?.id ?? null,
      setSelectedKidId,
    }),
    [kids, selectedKid, isLoading, setSelectedKidId]
  );

  return (
    <KidContext.Provider value={value}>
      {children}
    </KidContext.Provider>
  );
}
