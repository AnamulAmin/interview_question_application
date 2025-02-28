import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { evaluate } from "mathjs";
import { HiOutlineDivide } from "react-icons/hi2";
import { VscClose } from "react-icons/vsc";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

const Calculator = ({ isShow, setIsShow }: any) => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  // Handle button click or keyboard press
  const handleClick = (value: string) => {
    if (value === "=") {
      try {
        const calculatedResult = evaluate(input);
        setResult(calculatedResult.toString());
      } catch (error) {
        setResult("Error");
      }
    } else if (value === "C") {
      setInput("");
      setResult("");
    } else if (value === "DEL") {
      setInput((prev) => prev.slice(0, -1)); // Remove the last character
    } else {
      setInput((prev) => prev + value);
    }
  };

  // Listen for keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      if (key === "Enter") {
        handleClick("=");
      } else if (key === "Escape") {
        handleClick("C");
      } else if (key === "Backspace") {
        handleClick("DEL");
      } else if (
        "0123456789+-*/.".includes(key) // Valid calculator keys
      ) {
        handleClick(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input]);

  // Render buttons for the calculator
  const renderButtons = () => {
    const buttons = [
      "1",
      "2",
      "C",
      "DEL",
      "/",
      "*",
      "-",
      "+",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
      ".",
      "=",
    ];
    return buttons.map((button) => {
      switch (button) {
        case "/":
          return (
            <button
              key={button}
              onClick={() => handleClick(button)}
              className={`px-4 py-2 m-1 bg-gray-200 hover:bg-gray-300 rounded`}
            >
              <HiOutlineDivide size={20} />
            </button>
          );
        case "*":
          return (
            <button
              key={button}
              onClick={() => handleClick(button)}
              className={`px-4 py-2 m-1 bg-gray-200 hover:bg-gray-300 rounded`}
            >
              <VscClose size={20} />
            </button>
          );
        default:
          return (
            <button
              key={button}
              onClick={() => handleClick(button)}
              className={`px-4 py-2 m-1 bg-gray-200 hover:bg-gray-300 rounded`}
            >
              {button}
            </button>
          );
      }
    });
  };

  return (
    <Modal
      isOpen={isShow}
      placement={"top"}
      onOpenChange={setIsShow}
      className="z-[9999]"
      isDismissable={false}
      motionProps={fadeTopToBottom()}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Calculator
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center justify-center">
                <div className="bg-white shadow-lg rounded p-6 w-80 border">
                  <h1 className="text-2xl font-bold text-center mb-4">
                    Calculator
                  </h1>
                  <div className="border border-gray-300 rounded mb-4 p-2 text-right">
                    <div className="text-gray-600 text-sm">{input || "0"}</div>
                    <div className="text-black text-xl font-bold">
                      {result || ""}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {renderButtons()}
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Calculator;
