import React from "react";
import { Marquee } from "@/components/marquee";
import Image from "next/image";

// Sample sponsor data
const sponsors = [
  {
    id: 1,
    name: "Sponsor One",
    logoUrl: "https://via.placeholder.com/150/0000FF/FFFFFF?text=Sponsor+One",
  },
  {
    id: 2,
    name: "Sponsor Two",
    logoUrl: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Sponsor+Two",
  },
  {
    id: 3,
    name: "Sponsor Three",
    logoUrl: "https://via.placeholder.com/150/008000/FFFFFF?text=Sponsor+Three",
  },
  {
    id: 4,
    name: "Sponsor Four",
    logoUrl: "https://via.placeholder.com/150/FFFF00/000000?text=Sponsor+Four",
  },
  {
    id: 5,
    name: "Sponsor Five",
    logoUrl: "https://via.placeholder.com/150/800080/FFFFFF?text=Sponsor+Five",
  },
  {
    id: 6,
    name: "Sponsor Six",
    logoUrl: "https://via.placeholder.com/150/FFA500/FFFFFF?text=Sponsor+Six",
  },
];

const SponsorCard = ({
  logoUrl,
  name,
}: {
  logoUrl: string;
  name: string;
}) => {
  return (
    <div className="relative h-full w-48 cursor-pointer overflow-hidden rounded-xl shadow-md p-4">
      <div className="flex flex-col items-center gap-2">
        <Image className="h-16 w-16" alt={name} src={logoUrl} />
        <p className="text-sm font-medium">{name}</p>
      </div>
    </div>
  );
};

const SponsorsPage = () => {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <h1 className="text-center text-4xl font-bold mb-8">Our Sponsors</h1>
      <Marquee pauseOnHover className="[--duration:60s]">
        {sponsors.map((sponsor) => (
          <SponsorCard key={sponsor.id} {...sponsor} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white to-transparent"></div>
    </div>
  );
};

export default SponsorsPage;