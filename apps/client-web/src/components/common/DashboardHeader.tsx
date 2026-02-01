import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useAuth } from "@/contexts/AuthContext";
import { kidsService } from "@/services/kids.service";

interface KidUI {
  id: string;
  name: string;
}

export function DashboardHeader() {
  const { user, role, isLoading } = useAuth();

  console.log("🟢 DashboardHeader render", {
    isLoading,
    role,
    user,
  });

  const [kids, setKids] = useState<KidUI[]>([]);
  const [selectedKidId, setSelectedKidId] = useState<string>("");
  const [selectedKidName, setSelectedKidName] = useState<string>("");
  const [isKidLoading, setIsKidLoading] = useState(false);

  /* ---------- ROLE CONFIG ---------- */
  const roleConfig = {
    PARENT: {
      greeting: `Hi ${user?.email ?? "Parent"} 👋`,
      subtitle: "Track your child's fitness journey",
    },
    COACH: {
      greeting: `Hi Coach 👋`,
      subtitle: "Ready to inspire young athletes today?",
    },
  };

  /* ---------- FETCH KIDS (PARENT ONLY) ---------- */
  useEffect(() => {
    console.log("🔵 useEffect: fetchKids triggered", {
      role,
      userId: user?.id,
    });

    if (role !== "PARENT") {
      console.log("⚠️ Not a parent, skipping kids fetch");
      return;
    }

    const fetchKids = async () => {
      try {
        console.log("🚀 Fetching kids...");
        const res = await kidsService.getKids(1, 50, user?.id);

        console.log("📦 Kids API response", res);

        const mappedKids =
          res.data?.map((kid) => ({
            id: kid._id,
            name: kid.name,
          })) ?? [];

        console.log("🧒 Mapped kids", mappedKids);

        setKids(mappedKids);

        if (mappedKids.length > 0) {
          console.log("✅ Auto-selecting first kid", mappedKids[0]);
          setSelectedKidId(mappedKids[0].id);
          setSelectedKidName(mappedKids[0].name);
        }
      } catch (error) {
        console.error("❌ Failed to fetch kids", error);
      }
    };

    fetchKids();
  }, [role, user?.id]);

  /* ---------- FETCH SELECTED KID ---------- */
  useEffect(() => {
    console.log("🟣 useEffect: selectedKidId changed", selectedKidId);

    if (!selectedKidId) {
      console.log("⚠️ No selectedKidId, skipping fetchKid");
      return;
    }

    const fetchKid = async () => {
      try {
        setIsKidLoading(true);
        console.log("🚀 Fetching kid details for:", selectedKidId);

        const kid = await kidsService.getKidById(selectedKidId);

        console.log("👶 Kid details response", kid);

        setSelectedKidName(kid.name);
      } catch (error) {
        console.error("❌ Failed to fetch kid", error);
      } finally {
        setIsKidLoading(false);
      }
    };

    fetchKid();
  }, [selectedKidId]);

  if (isLoading || !user) {
    console.log("⏳ Auth still loading or user missing");
    return (
      <div className="max-w-7xl mx-auto px-4 py-4">
        <p className="text-gray-500">Loading user...</p>
      </div>
    );
  }

  const config = role ? roleConfig[role] : null;

  console.log("🟡 Rendering UI with state", {
    kids,
    selectedKidId,
    selectedKidName,
    isKidLoading,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* ---------- LEFT ---------- */}
        <div className="text-center md:text-left">
          <h1 className="text-base sm:text-lg font-semibold text-gray-800">
            {config?.greeting}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {config?.subtitle}
          </p>

          {role === "PARENT" && selectedKidId && (
            <p className="text-[11px] sm:text-xs text-gray-400 mt-1">
              {isKidLoading
                ? "Loading kid details..."
                : `Selected: ${selectedKidName}`}
            </p>
          )}
        </div>

        {/* ---------- RIGHT (KID SELECTOR) ---------- */}
        {role === "PARENT" && (
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="text-sm font-bold text-gray-700">
              Kid's Name:
            </span>

            {kids.length === 1 ? (
              <span className="px-3 py-1 rounded-md bg-gray-100 text-sm font-medium">
                {kids[0].name}
              </span>
            ) : (
              <Select
                value={selectedKidId}
                onValueChange={(val) => {
                  console.log("🔄 Kid selected from dropdown:", val);
                  setSelectedKidId(val);
                }}
              >
                <SelectTrigger className="w-[160px] text-sm">
                  <SelectValue placeholder="Select Kid" />
                </SelectTrigger>
                <SelectContent>
                  {kids.map((kid) => (
                    <SelectItem key={kid.id} value={kid.id}>
                      {kid.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
