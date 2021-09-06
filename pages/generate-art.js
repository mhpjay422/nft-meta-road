import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(() => import("../p5component.js"), {
  ssr: false,
});

function GenerateArt(p) {
  return (
    <div>
      <div className="h-20 bg-gray-50"></div>
      <div className="flex align-middle justify-around border-2 solid bg-black">
        <div className="bg-white">
          <DynamicComponentWithNoSSR className="bg-yellow-200" />
        </div>
      </div>
    </div>
  );
}

export default GenerateArt;
