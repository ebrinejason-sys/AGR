"use client";

import { useState } from "react";
import DonationModal from "@/components/DonationModal";

export default function DonateModalTrigger() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <button className="btn-premium" onClick={() => setIsOpen(true)}>
        <span>Open donation form</span>
      </button>
      <DonationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
