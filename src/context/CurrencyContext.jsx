import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CURRENCIES = [
  { code: 'AED', symbol: 'AED', flag: '🇦🇪', name: 'UAE Dirham' },
  { code: 'USD', symbol: '$', flag: '🇺🇸', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', flag: '🇪🇺', name: 'Euro' },
  { code: 'GBP', symbol: '£', flag: '🇬🇧', name: 'British Pound' },
  { code: 'SAR', symbol: 'SAR', flag: '🇸🇦', name: 'Saudi Riyal' },
  { code: 'INR', symbol: '₹', flag: '🇮🇳', name: 'Indian Rupee' },
  { code: 'PKR', symbol: 'Rs', flag: '🇵🇰', name: 'Pakistani Rupee' },
  { code: 'CAD', symbol: 'C$', flag: '🇨🇦', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', flag: '🇦🇺', name: 'Australian Dollar' },
  { code: 'SGD', symbol: 'S$', flag: '🇸🇬', name: 'Singapore Dollar' },
  { code: 'JPY', symbol: '¥', flag: '🇯🇵', name: 'Japanese Yen' },
  { code: 'CHF', symbol: 'CHF', flag: '🇨🇭', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', flag: '🇨🇳', name: 'Chinese Yuan' },
  { code: 'MYR', symbol: 'RM', flag: '🇲🇾', name: 'Malaysian Ringgit' },
  { code: 'KWD', symbol: 'KD', flag: '🇰🇼', name: 'Kuwaiti Dinar' },
];

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem('aureon_currency') || 'AED';
  });
  const [rates, setRates] = useState({ AED: 1 });

  useEffect(() => {
    const cached = localStorage.getItem('aureon_rates');
    const cachedTime = localStorage.getItem('aureon_rates_time');
    const oneHour = 60 * 60 * 1000;

    if (cached && cachedTime && Date.now() - parseInt(cachedTime) < oneHour) {
      setRates(JSON.parse(cached));
      return;
    }

    fetch('https://api.exchangerate-api.com/v4/latest/AED')
      .then(r => r.json())
      .then(data => {
        if (data.rates) {
          setRates(data.rates);
          localStorage.setItem('aureon_rates', JSON.stringify(data.rates));
          localStorage.setItem('aureon_rates_time', Date.now().toString());
        }
      })
      .catch(() => {
        // Fallback rates if API fails
        setRates({ AED: 1, USD: 0.2722, EUR: 0.2516, GBP: 0.2153, SAR: 1.0208, INR: 22.79, PKR: 75.62, CAD: 0.3736, AUD: 0.4175, SGD: 0.3647, JPY: 40.61, CHF: 0.2389, CNY: 1.974, MYR: 1.213, KWD: 0.0838 });
      });
  }, []);

  const setCurrency = useCallback((code) => {
    setCurrencyState(code);
    localStorage.setItem('aureon_currency', code);
  }, []);

  const convert = useCallback((aedAmount) => {
    if (currency === 'AED') return `AED ${aedAmount.toLocaleString()}`;
    const rate = rates[currency] || 1;
    const converted = Math.round(aedAmount * rate);
    const info = CURRENCIES.find(c => c.code === currency);
    return `${info?.symbol || currency} ${converted.toLocaleString()} ${currency}`;
  }, [currency, rates]);

  const currentCurrency = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert, currentCurrency, CURRENCIES }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}

export { CURRENCIES };
