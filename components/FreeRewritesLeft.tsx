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
    <div className="flex items-center">
      <div className={`px-2 py-1 bg-black rounded border border-white rounded text-sm font-bold text-white`}>
        Credits: {renderCredits()}
      </div>
    </div>
  );
};

export default FreeRewritesLeft;