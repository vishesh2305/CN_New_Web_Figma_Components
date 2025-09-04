"use client";

import { useEffect, useState } from "react";
import Oneascii from "@/components/BinaryArts/1";
import Twoascii from "@/components/BinaryArts/2";
import Threeascii from "@/components/BinaryArts/3";
import Fourascii from "@/components/BinaryArts/4";
import Fiveascii from "@/components/BinaryArts/5";
import Sixascii from "@/components/BinaryArts/6";
import Seventhascii from "@/components/BinaryArts/7";
import Eightascii from "@/components/BinaryArts/8";
import Nineascii from "@/components/BinaryArts/9";
import Tenthascii from "@/components/BinaryArts/10";
import elevenascii from "@/components/BinaryArts/11";
import tweleveascii from "@/components/BinaryArts/12";
import thirdteenascii from "@/components/BinaryArts/13";

const components = [
  Oneascii,
  Twoascii,
  Threeascii,
  Fourascii,
  Fiveascii,
  Sixascii,
  Seventhascii,
  Eightascii,
  Nineascii,
  Tenthascii,
  elevenascii,
  tweleveascii,
  thirdteenascii
];

export default function AsciiArtPage() {
  const [RandomComponent, setRandomComponent] = useState(() => {
    return components[Math.floor(Math.random() * components.length)];
  });

  return (
    <div>
      <RandomComponent />
    </div>
  );
}