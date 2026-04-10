import React from "react";

type FreeRewritesLeftProps = {
  freeRewritesLeft: number | null;
};

const FreeRewritesLeft: React.FC<FreeRewritesLeftProps> = ({ freeRewritesLeft }) => {
  const renderCredits = () => {
    if (freeRewritesLeft === null) {
      return "";
    } else if (freeRewritesLeft > 75) {
      return "♾️";
    } else {
      return freeRewritesLeft.toString();
    }
  };

  return (
    <div className="inline-flex items-center rounded-md border border-[#FF385C]/25 bg-[#FF385C]/10 px-3 py-1 text-md font-semibold text-black">
      Credits: {renderCredits()}
    </div>
  );
};

export default FreeRewritesLeft;