import { useState, useEffect } from "react";
import membershipCardFront from "../../assets/card/1.png";
import membershipCardBack from "../../assets/card/2.png";
import "./LoadingSpinner.css";
import { Link } from "react-router-dom";

const LoadingSpinner = ({ isLoading }) => {
  const [showFront, setShowFront] = useState < any > true;

  useEffect(() => {
    let timer;
    if (isLoading) {
      timer = setInterval(() => {
        setShowFront((prevShowFront) => !prevShowFront);
      }, 2000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isLoading]);

  return (
    <>
      {isLoading && (
        <div
          className="fixed bottom-0 right-0 sm:mb-1 md:mb-5 lg:mb-8 ml-4 z-50 mx-5"
          aria-live="polite"
        >
          <div className="flex items-center justify-center mb-6">
            <Link
              to="/under"
              className="relative sm:w-20 h-16 mb-5 md:w-32 md:h-32 lg:w-64 lg:h-40"
              style={{ perspective: "700px" }}
            >
              <img
                src={membershipCardBack}
                alt="Gym Membership Card"
                className="w-full h-full absolute top-0 left-0 z-[2] animate-rotate-slow-back"
                style={{ backfaceVisibility: "hidden" }}
              />
              <img
                src={membershipCardFront}
                alt="Gym Membership Card"
                className="w-full h-full absolute top-0 left-0 z-[1] animate-rotate-slow"
                style={{ backfaceVisibility: "hidden" }}
              />
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default LoadingSpinner;
