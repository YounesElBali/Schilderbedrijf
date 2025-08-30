"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Country {
  name: string;
  code: string;
  withVAT: boolean;
  requiresVATValidation?: boolean; // Voor landen zoals België
}

interface PriceContextType {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  countries: Country[];
  calculatePrice: (basePrice: number, vatNumber?: string) => number;
  formatPrice: (basePrice: number, vatNumber?: string) => string;
  getCountryData: () => Country | undefined;
  vatRate: number;
  isVATExempt: (vatNumber?: string) => boolean;
  validateBelgianVAT: (vatNumber: string) => boolean;
}

const PriceContext = createContext<PriceContextType | undefined>(undefined);

export const PriceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState('Nederland');
  const [isHydrated, setIsHydrated] = useState(false);
  
  const countries: Country[] = [
    { name: 'Nederland', code: 'NL', withVAT: true },
    { name: 'België', code: 'BE', withVAT: false, requiresVATValidation: true }
  ];

  const vatRate = 0.21; // 21% BTW

  // Handle hydration and load saved country from localStorage
  useEffect(() => {
    setIsHydrated(true);
    const savedCountry = localStorage.getItem('selectedCountry');
    if (savedCountry && countries.find(c => c.name === savedCountry)) {
      setSelectedCountry(savedCountry);
    }
  }, []);

  // Save country to localStorage when it changes (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('selectedCountry', selectedCountry);
    }
  }, [selectedCountry, isHydrated]);

  const getCountryData = (): Country | undefined => {
    return countries.find(c => c.name === selectedCountry);
  };

  // Valideer Belgisch BTW-nummer
  const validateBelgianVAT = (vatNumber: string): boolean => {
    if (!vatNumber) return false;
    
    // Belgisch BTW-nummer format: BE + 10 cijfers (bijv. BE0123456789)
    const belgianVATRegex = /^BE[0-9]{10}$/;
    const cleanedVAT = vatNumber.replace(/\s/g, '').toUpperCase();
    
    return belgianVATRegex.test(cleanedVAT);
  };

  // Check of BTW vrijstelling van toepassing is
  const isVATExempt = (vatNumber?: string): boolean => {
    const country = getCountryData();
    
    if (!country) return false;
    
    // Nederland: altijd BTW
    if (country.code === 'NL') return false;
    
    // België: alleen vrijstelling met geldig Belgisch BTW-nummer
    if (country.code === 'BE') {
      return vatNumber ? validateBelgianVAT(vatNumber) : false;
    }
    
    return false;
  };

  const calculatePrice = (basePrice: number, vatNumber?: string): number => {
    const country = getCountryData();
    
    if (!country) return basePrice;
    
    // Nederland: altijd met BTW
    if (country.withVAT) {
      return basePrice * (1 + vatRate);
    }
    
    // België: met BTW tenzij geldig BTW-nummer
    if (country.requiresVATValidation) {
      const exempt = isVATExempt(vatNumber);
      return exempt ? basePrice : basePrice * (1 + vatRate);
    }
    
    return basePrice;
  };

  const formatPrice = (basePrice: number, vatNumber?: string): string => {
    const country = getCountryData();
    const finalPrice = calculatePrice(basePrice, vatNumber);
    
    if (!country) return `€${finalPrice.toFixed(2)}`;
    
    // Nederland: altijd incl. BTW
    if (country.withVAT) {
      return `€${finalPrice.toFixed(2)} incl. BTW`;
    }
    
    // België: afhankelijk van BTW-nummer
    if (country.requiresVATValidation) {
      const exempt = isVATExempt(vatNumber);
      const suffix = exempt ? ' excl. BTW' : ' incl. BTW';
      return `€${finalPrice.toFixed(2)}${suffix}`;
    }
    
    return `€${finalPrice.toFixed(2)} excl. BTW`;
  };

  return (
    <PriceContext.Provider value={{
      selectedCountry,
      setSelectedCountry,
      countries,
      calculatePrice,
      formatPrice,
      getCountryData,
      vatRate,
      isVATExempt,
      validateBelgianVAT
    }}>
      {children}
    </PriceContext.Provider>
  );
};

export const usePricing = () => {
  const context = useContext(PriceContext);
  if (!context) {
    throw new Error('usePricing must be used within a PriceProvider');
  }
  return context;
};