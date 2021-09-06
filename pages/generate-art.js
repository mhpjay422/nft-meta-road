import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(() => import("../p5component.js"), {
  ssr: false,
});

function GenerateArt(p) {
  return <DynamicComponentWithNoSSR />;
}

export default GenerateArt;
