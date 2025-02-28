import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// Define types for cart item and user
interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  preparationTime: number;
  // Add other fields as per the product structure
}

interface User {
  id: string;
  name: string;
  email: string;
  // Add other user-related properties as needed
}

// Define the context type
interface AppContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (
    id: string,
    stateName: "increment" | "decrement"
  ) => void;
  totalPrice: number;
  setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
  totalItems: number;
  setTotalItems: React.Dispatch<React.SetStateAction<number>>;
  isShowCart: boolean;
  setIsShowCart: React.Dispatch<React.SetStateAction<boolean>>;
  totalPreparationTimes: number;
  setTotalPreparationTimes: React.Dispatch<React.SetStateAction<number>>;
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context with a default value of null
export const AppContext = createContext<AppContextType | null>(null);

// Create a custom hook for using the context
export const useGlobalContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a ContextProvider");
  }
  return context;
};

// Define props type for ContextProvider
interface ContextProviderProps {
  children: ReactNode;
}

const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isShowCart, setIsShowCart] = useState<boolean>(false);
  const [totalPreparationTimes, setTotalPreparationTimes] = useState<number>(0);
  const [language, setLanguage] = useState<string>(
    localStorage.getItem("language") || "ar"
  ); // [en, ru]

  // Update quantity
  const updateCartQuantity = (
    id: string,
    stateName: "increment" | "decrement"
  ) => {
    setCartItems((prevItems) => {
      const itemInCart = prevItems.map((item: any) => {
        if (item._id === id) {
          if (stateName === "increment") {
            const updatedItem = { ...item, quantity: item.quantity + 1 };
            return updatedItem;
          } else {
            if (item.quantity >= 1) {
              const updatedItem = { ...item, quantity: item.quantity - 1 };
              return updatedItem;
            }
          }
        }
        return item;
      });

      const totalPriceInfo = itemInCart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      const totalItemsInfo = itemInCart.reduce(
        (acc, item) => acc + item.quantity,
        0
      );

      const totalPreparationTimesInfo = itemInCart.reduce(
        (acc, item) => acc + item.preparationTime * item.quantity,
        0
      );

      setTotalPreparationTimes(totalPreparationTimesInfo);
      setTotalItems(totalItemsInfo);
      setTotalPrice(totalPriceInfo);
      localStorage.setItem("cartItems", JSON.stringify(itemInCart));

      return itemInCart;
    });
  };

  // Add item to cart
  const addToCart = (product: CartItem) => {
    setCartItems((prevItems) => {
      const itemInCart = prevItems.find(
        (item: any) => item._id === product._id
      );
      let updatedItems;
      if (itemInCart) {
        updatedItems = prevItems.map((item: any) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedItems = [...prevItems, { ...product, quantity: 1 }];
      }

      const totalPriceInfo = updatedItems.reduce(
        (acc, item) => acc + Number(item.price) * item.quantity,
        0
      );
      const totalItemsInfo = updatedItems.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      const totalPreparationTimesInfo = updatedItems.reduce(
        (acc, item) => acc + item.preparationTime * item.quantity,
        0
      );

      setTotalPreparationTimes(totalPreparationTimesInfo);
      setTotalItems(totalItemsInfo);
      setTotalPrice(totalPriceInfo);
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));

      return updatedItems;
    });
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item: any) => item._id !== id);
      const totalPriceInfo = updatedItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      const totalItemsInfo = updatedItems.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      const totalPreparationTimesInfo = updatedItems.reduce(
        (acc, item) => acc + item.preparationTime * item.quantity,
        0
      );

      setTotalPreparationTimes(totalPreparationTimesInfo);
      setTotalItems(totalItemsInfo);
      setTotalPrice(totalPriceInfo);
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));

      return updatedItems;
    });
  };

  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    let parseData: CartItem[] = storedCartItems
      ? JSON.parse(storedCartItems)
      : [];

    if (parseData.length > 0) {
      const totalPriceInfo = parseData.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      const totalItemsInfo = parseData.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      const totalPreparationTimesInfo = parseData.reduce(
        (acc, item) => acc + item.preparationTime * item.quantity,
        0
      );

      setTotalPreparationTimes(totalPreparationTimesInfo);
      setTotalItems(totalItemsInfo);
      setTotalPrice(totalPriceInfo);
      setCartItems(parseData);
    }
  }, []);

  const info: AppContextType = {
    user,
    setUser,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    totalPrice,
    setTotalPrice,
    totalItems,
    setTotalItems,
    isShowCart,
    setIsShowCart,
    totalPreparationTimes,
    setTotalPreparationTimes,
    language,
    setLanguage,
  };

  return (
    <AppContext.Provider value={info}>
      <main>{children}</main>
    </AppContext.Provider>
  );
};

export default ContextProvider;
