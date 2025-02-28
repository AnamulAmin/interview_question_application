import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Accordion,
  AccordionItem,
  Code,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { IoCheckbox, IoCopy } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";

interface ObjectCreationMethod {
  id: string;
  title: string;
  description: string;
  code: string;
  comparison: any;
}

const ObjectCreation: React.FC = ({ question, no }: any) => {
  // Object Creation Methods
  const [isCopy, setIsCopy] = React.useState(false);

  return (
    <div
      className="container mx-auto px-4 py-8  bg-blue-300  rounded-t-xl mb-16"
      id={`answer-${no}`}
    >
      <Card className="mb-8 shadow-xl">
        <CardHeader className="pb-0 pt-4 px-4 ">
          <h1 className="text-2xl font-bold">
            {no}. {question?.question}
          </h1>
        </CardHeader>
        <CardBody>
          <p className="text-gray-600">{question?.answer}</p>
        </CardBody>
      </Card>

      {question?.comparison && (
        <Table aria-label="Example static collection table" className="mb-6 ">
          <TableHeader className="border rounded-2xl">
            {Object.keys(question?.comparison[0]).map((key) => (
              <TableColumn key={key} className="capitalize ">
                {key}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {question?.comparison.map((method: any) => (
              <TableRow key={method.id} className="border">
                {Object.keys(method).map((key) => (
                  <TableCell key={key} className="border">
                    {method[key]}{" "}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Accordion variant="splitted">
        {question?.examples.map((method: any) => (
          <AccordionItem
            key={method.id}
            // aria-label={method.title}
            title={method.title}
            className="hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
          >
            <Card>
              <CardBody>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <Code
                  className="w-full whitespace-break-spaces p-6 bg-black text-slate-300 relative"
                  size="lg"
                  onClick={() => {
                    navigator.clipboard.writeText(method.code);
                    setIsCopy(true);
                    setTimeout(() => {
                      setIsCopy(false);
                    }, 900);
                  }}
                >
                  {method.code}
                  <button className="absolute top-1 right-1 p-1 text-gray-600 hover:text-blue-500 transition-all duration-200 bg-black rounded border border-slate-500">
                    {!isCopy ? <IoCopy /> : <FaCheck />}
                  </button>
                </Code>
              </CardBody>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ObjectCreation;
