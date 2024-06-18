import { useState, useEffect} from "react";

import type { GuitarItem, Guitar } from "../types";

export const useCart = () => {
  const initialCart = (): GuitarItem[] => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  const initialCount = () => {
    const localStorageCount = localStorage.getItem("count");
    return localStorageCount ? JSON.parse(localStorageCount) : 0;
  };


  const [cart, setCart] = useState<GuitarItem[]>(initialCart);
  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("count", JSON.stringify(count));
  }, [cart, count]);

  // const addToCart = (item: Guitar) => {
  //   const itemExists = cart.findIndex((guitar) => guitar.id === item.id);
  //   if (itemExists >= 0) {
  //     if (cart[itemExists].quantity >= 5) return;

  //     const updatedCart = [...cart];
  //     updatedCart[itemExists].quantity++;
  //     setCart(updatedCart);
  //   } else {
  //     const newItem: GuitarItem = { ...item, quantity: 1 };
  //     setCart([...cart, newItem]);
  //     setCount((prevCount: number) => prevCount + 1);
  //   }
  // };

  // const removeFromCart = (itemId: Guitar['id']) => {
  //   const updatedCart = cart.filter((item) => item.id !== itemId);
  //   setCart(updatedCart);
  //   setCount((prevCount: number) => prevCount - 1);
  // };

  const removeAllFromCart = () => {
    setCart([]);
    setCount(0);
  };

  const increment = (id: Guitar['id']) => {
    const incrementItem = cart.map((item) => {
      if (item.id === id && item.quantity < 5) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      } else {
        return item;
      }
    });
    setCart(incrementItem);
  };

  const decrement = (id: Guitar['id']) => {
    const itemIndex = cart.findIndex((item) => item.id === id);
    if (itemIndex !== -1 && cart[itemIndex].quantity > 1) {
      const updatedCart = cart.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
      setCart(updatedCart);
    } else if (itemIndex !== -1 && cart[itemIndex].quantity === 1) {
      const filteredCart = cart.filter((item) => item.id !== id);
      setCart(filteredCart);
      setCount((prevCount: number) => prevCount - 1);
    }
  };

  const clearCart = () => {
    setCart([]);
    setCount(0);
  };



  return {
    cart,
    decrement,
    increment,
    clearCart,
    count,
    removeAllFromCart,
  };
};
