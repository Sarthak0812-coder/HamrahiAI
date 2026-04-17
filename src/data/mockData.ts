export type CrowdLevel = "low" | "medium" | "high";

export interface AlertItem {
  id: string;
  title: string;
  type: "delay" | "good" | "info";
}

export interface Station {
  id: string;
  name: string;
  line: "western" | "central" | "metro";
  lat: number;
  lng: number;
}

export interface Route {
  id: string;
  from: string;
  to: string;
  time: string;
  interchanges: number;
  crowd: CrowdLevel;
  optimized: boolean;
  modes: string[];
  trainName: string;
  stops: string[];
}

export interface Coach {
  id: string;
  crowd: number;
  status: CrowdLevel;
  label: string;
}

export interface BookedTicket {
  id: string;
  from: string;
  to: string;
  modes: string[];
  price: string;
  date: string;
  time: string;
  status: "active" | "used" | "expired";
  qrData: string;
  passengerName: string;
}

export interface ChatMessage {
  id: number;
  role: "user" | "bot";
  text: string;
}

export const alerts: AlertItem[] = [
  { id: "a1", title: "Western line running 6 minutes late near Andheri", type: "delay" },
  { id: "a2", title: "Metro Line 1 frequency improved for evening rush", type: "good" },
  { id: "a3", title: "Light crowd expected on Harbour connectors till noon", type: "info" },
];

export const stations: Station[] = [
  { id: "s1", name: "Churchgate", line: "western", lat: 18.935, lng: 72.827 },
  { id: "s2", name: "Mumbai Central", line: "western", lat: 18.969, lng: 72.819 },
  { id: "s3", name: "Dadar", line: "western", lat: 19.018, lng: 72.843 },
  { id: "s4", name: "Andheri", line: "western", lat: 19.119, lng: 72.846 },
  { id: "s5", name: "Borivali", line: "western", lat: 19.229, lng: 72.857 },
  { id: "s6", name: "Virar", line: "western", lat: 19.456, lng: 72.811 },
  { id: "s7", name: "CSMT", line: "central", lat: 18.94, lng: 72.835 },
  { id: "s8", name: "Byculla", line: "central", lat: 18.976, lng: 72.833 },
  { id: "s9", name: "Kurla", line: "central", lat: 19.072, lng: 72.879 },
  { id: "s10", name: "Thane", line: "central", lat: 19.186, lng: 72.975 },
  { id: "s11", name: "Kalyan", line: "central", lat: 19.243, lng: 73.13 },
  { id: "s12", name: "Versova", line: "metro", lat: 19.131, lng: 72.814 },
  { id: "s13", name: "Azad Nagar", line: "metro", lat: 19.126, lng: 72.837 },
  { id: "s14", name: "WEH", line: "metro", lat: 19.114, lng: 72.85 },
  { id: "s15", name: "Ghatkopar (M)", line: "metro", lat: 19.087, lng: 72.909 },
  { id: "s16", name: "Oshiwara", line: "metro", lat: 19.147, lng: 72.842 },
];

const crowdBySeed = (seed: number, index: number): number => {
  const raw = Math.abs(Math.sin(seed * 19 + index * 7)) * 100;
  return Math.max(18, Math.min(95, Math.round(raw)));
};

const statusFromCrowd = (crowd: number): CrowdLevel => {
  if (crowd < 40) return "low";
  if (crowd < 70) return "medium";
  return "high";
};

export const generateCoaches = (seed: number): Coach[] =>
  ["C1", "C2", "C3", "C4", "C5", "C6"].map((id, index) => {
    const crowd = crowdBySeed(seed, index);
    const status = statusFromCrowd(crowd);
    return {
      id,
      crowd,
      status,
      label: status === "low" ? "Comfortable" : status === "medium" ? "Busy" : "Packed",
    };
  });

const makeRoute = (
  id: string,
  from: string,
  to: string,
  time: string,
  interchanges: number,
  crowd: CrowdLevel,
  optimized: boolean,
  modes: string[],
  trainName: string,
  stops: string[],
): Route => ({
  id,
  from,
  to,
  time,
  interchanges,
  crowd,
  optimized,
  modes,
  trainName,
  stops,
});

export const findRoutes = (from: string, to: string): Route[] => {
  if (!from || !to || from === to) return [];

  return [
    makeRoute(
      "r1",
      from,
      to,
      "42 min",
      1,
      "medium",
      true,
      ["Local Train", "Metro"],
      "Andheri Fast + Metro Line 1",
      [from, "Andheri", "Azad Nagar", "Oshiwara", to],
    ),
    makeRoute(
      "r2",
      from,
      to,
      "55 min",
      0,
      "low",
      false,
      ["Local Train"],
      "Western Semi-Fast",
      [from, "Dadar", "Bandra", "Andheri", to],
    ),
    makeRoute(
      "r3",
      from,
      to,
      "63 min",
      2,
      "high",
      false,
      ["Local Train", "Metro"],
      "Central Connector + Metro",
      [from, "Kurla", "Ghatkopar (M)", "WEH", to],
    ),
  ];
};

const distanceInKm = (aLat: number, aLng: number, bLat: number, bLng: number): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadius = 6371;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const aa =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  return 2 * earthRadius * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
};

export const findNearestStations = (lat: number, lng: number) =>
  stations
    .map((station) => ({
      ...station,
      distance: distanceInKm(lat, lng, station.lat, station.lng),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 4);

export const crowdTimeline = [
  { time: "6 AM", density: 28 },
  { time: "8 AM", density: 76 },
  { time: "10 AM", density: 58 },
  { time: "1 PM", density: 42 },
  { time: "5 PM", density: 88 },
  { time: "8 PM", density: 64 },
];

export const stationHeatmap = [
  { station: "Andheri", density: 86 },
  { station: "Dadar", density: 79 },
  { station: "Kurla", density: 73 },
  { station: "Borivali", density: 56 },
  { station: "Ghatkopar", density: 48 },
];

export const chatMessages: ChatMessage[] = [
  { id: 1, role: "bot", text: "Hi, I can help with routes, coach crowd, and ticketing." },
];

export const quickReplies = [
  "Best route to Andheri",
  "Which coach is less crowded?",
  "Ticket price for metro + local",
];

export const botResponses: Record<string, string> = {
  "Best route to Andheri": "Fastest option right now is Local Train plus Metro, with one interchange and moderate crowd.",
  "Which coach is less crowded?": "Coach C3 usually has the lowest occupancy on the current run.",
  "Ticket price for metro + local": "A combined ticket is Rs. 50 today, which is cheaper than buying both separately.",
};
