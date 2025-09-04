"use client";

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
import Elevenascii from "@/components/BinaryArts/11";
import Tweleveascii from "@/components/BinaryArts/12";
import Thirteenascii from "@/components/BinaryArts/13";
import ScrollComponent from "@/components/ScrollComponent";

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
  Elevenascii,
  Tweleveascii,
  Thirteenascii
];

export default function AsciiArtPage() {
  return (
    <div>
      {components.map((Component, index) => (
        <ScrollComponent key={index}>
          <Component />
        </ScrollComponent>
      ))}
    </div>
  );
}