import { useCart } from "../../contexts/CartContext"; // Zorg dat dit pad klopt

export function CartIcon() {
  const { cart } = useCart(); // Haal de winkelwagen op uit de context
  const cartCount = cart.length; // Aantal items in de winkelwagen

  return (
    <div className="relative">
   
     {cartCount}
   
  </div>
  );
}
