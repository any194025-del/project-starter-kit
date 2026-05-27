// Mock guests table. One row per (invitationId, guestId).
import type { Guest } from "@/types/guest";

export const MOCK_GUESTS: Guest[] = [
  {
    id: "gj28ak",
    invitationId: "aarav-weds-bhavya",
    salutation: "Shri",
    name: "Rohan Mehta",
    honorific: "ji",
    family: "Mehta Parivaar, Udaipur",
    group: "friends",
    saParivar: true,
    maxGuests: 4,
    greeting: "आदरणीय अतिथि",
  },
  {
    id: "k9p2le",
    invitationId: "aarav-weds-bhavya",
    salutation: "Smt.",
    name: "Anjali Iyer",
    family: "Iyer Family, Bengaluru",
    group: "brides_family",
    saParivar: true,
    maxGuests: 3,
  },
  {
    id: "vipx01",
    invitationId: "aarav-weds-bhavya",
    salutation: "Dr.",
    name: "Vikram Singh",
    honorific: "ji",
    family: "Singh Thikana, Jodhpur",
    group: "vip",
    saParivar: true,
    maxGuests: 6,
    greeting: "Our Most Honoured Guest",
  },
  {
    id: "demo01",
    invitationId: "aarav-weds-bhavya",
    name: "Friend of the Couple",
    family: "",
    group: "friends",
    maxGuests: 2,
  },
];
