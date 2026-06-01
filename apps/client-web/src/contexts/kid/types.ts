import type { Kid } from "@grow-fitness/shared-types";
import type { Dispatch, SetStateAction } from "react";

export interface KidContextType {
  kids: Kid[];
  selectedKidId: string | null;
  selectedKid: Kid | null;

  // setters
  setSelectedKid: Dispatch<SetStateAction<Kid | null>>;

  // state
  isLoading: boolean;

  setSelectedKidId: (id: string | null) => void;
}
