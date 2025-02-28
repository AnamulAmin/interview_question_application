import { useState, useCallback } from "react";

interface Item {
  code: string;
  name: string;
  symbol?: string;
}

interface SearchBoxProps {
  data: Item[]; // Array of items to be filtered
  setSelectedItem: (item: Item | null) => void; // Function to set the selected item
}

const SearchBox: React.FC<SearchBoxProps> = ({ data, setSelectedItem }) => {
  const [query, setQuery] = useState<string>(""); // State for the query input
  const [isFocused, setIsFocused] = useState<boolean>(false); // State for input focus

  // Filter data based on the query
  const filteredData = useCallback(() => {
    return data.filter((item: any) =>
      item?.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [data, query]);

  // Handle item selection
  const handleSelect = (key: string) => {
    const selectedItem = data.find((item: any) => item?.code === key);
    if (selectedItem) {
      setSelectedItem(selectedItem); // Set the selected item using the prop function
      setQuery(selectedItem?.name || ""); // Update input with the selected item's name
      setIsFocused(false); // Close the dropdown when an item is selected
    }
  };

  return (
    <div className="w-full relative px-8">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="w-full p-3 border rounded-xl border-gray-300 focus:border-blue-500 focus:outline-none appearance-none text-gray-700 text-sm"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 100)} // Delay to allow ListboxItem click
      />

      {filteredData().length > 0 && (
        <ul
          aria-label="Search Suggestions"
          className={`w-full flex flex-col gap-1 px-5 absolute bottom-full left-0 z-10 mb-2 border bg-white shadow-md rounded-md max-h-[300px] overflow-auto transition-all duration-100 origin-bottom ${
            !isFocused ? "scale-y-0" : "scale-y-100"
          }`}
        >
          <li
            key={""}
            className="text-gray-700 text-md py-1 px-4 rounded-md hover:bg-gray-200 cursor-pointer"
          >
            Select One
          </li>
          {filteredData().map((item: any) => (
            <li
              key={item?.code || ""}
              className="text-gray-700 text-md py-1 px-4 rounded-md hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelect(item?.code)}
            >
              {item?.name || ""} - {item?.code || ""} ({item?.symbol || ""})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
