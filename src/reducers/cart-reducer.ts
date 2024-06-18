import { db } from "../data/db";
import { Guitar, GuitarItem } from "../types";

export type CartActions =
  | { type: "add-to-cart"; payload: { item: Guitar } }
  | { type: "remove-from-cart"; payload: { itemId: Guitar["id"] } }
  | { type: "increment"; payload: { id: Guitar["id"] } }
  | { type: "decrement"; payload: { id: Guitar["id"] } }
  | { type: "remove-all-from-cart" };

export type CartState = {
  data: Guitar[];
  cart: GuitarItem[];
  totalItems: number; // New property to store total number of items in cart
};

export const initialState: CartState = {
  data: db,
  cart: [],
  totalItems: 0, // Initialize totalItems to 0
};

export const cartReducer = (
  state: CartState = initialState,
  action: CartActions
) => {
  if (action.type === "add-to-cart") {
    const itemExists = state.cart.find(
      (guitar) => guitar.id === action.payload.item.id
    );

    let updatedCart: GuitarItem[] = [];
    let totalItems = 0;

    if (itemExists) {
      updatedCart = state.cart.map((item) => {
        if (item.id === action.payload.item.id) {
          if (item.quantity < 5) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        } else {
          return item;
        }
      });
    } else {
      const newItem: GuitarItem = { ...action.payload.item, quantity: 1 };

      updatedCart = [...state.cart, newItem];
      totalItems = state.totalItems + 1;
    }

    return {
      ...state,
      cart: updatedCart,
      totalItems: state.totalItems + 1, // Increment totalItems when adding an item
    };
  }

  if (action.type === "remove-from-cart") {
    const updatedCart = state.cart.filter(
      (item) => item.id !== action.payload.itemId
    );
    return {
      ...state,
      cart: updatedCart,
      totalItems: state.totalItems - 1, // Decrement totalItems when removing an item
    };
  }

  if (action.type === "increment") {
    const incrementItem = state.cart.map((item) => {
      if (item.id === action.payload.id && item.quantity < 5) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      } else {
        return item;
      }
    });

    return {
      ...state,
      cart: incrementItem,
      totalItems: state.totalItems + 1, // Increment totalItems when incrementing an item
    };
  }

  if (action.type === "decrement") {
    const itemExists = state.cart.find((item) => item.id === action.payload.id);

    if (itemExists) {
      const updatedCart = state.cart
        .map((item) => {
          if (item.id === action.payload.id) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      return {
        ...state,
        cart: updatedCart,
        totalItems: state.totalItems - 1, // Decrement totalItems when removing an item
      };
    }
  }

  if (action.type === "remove-all-from-cart") {
    return {
      ...state,
      cart: [],
      totalItems: 0, // Reset totalItems to 0 when clearing cart
    };
  }
};
