"use client";

import { useState } from "react";
import { EmptyCartModal } from "../Shopping/ShoppingCartHomePage";
import { ProductCategories } from "../Menu/Products";
import { BestsellersSection } from "../Menu/BestSeller";
import { TestimonialCarousel } from "../Menu/Comments";

export function Menu() {
  const [cartModalOpen, setCartModalOpen] = useState(false);

  return (
    <div>
      <br/>
      <ProductCategories />
      <br/>
      {/* <BestsellersSection />
      <br/> */}
      <TestimonialCarousel />
      <br/>
      {/* Empty Cart Sliding Modal */}
      <EmptyCartModal isOpen={cartModalOpen} closeModal={() => setCartModalOpen(false)} />
    </div>
  );
}
