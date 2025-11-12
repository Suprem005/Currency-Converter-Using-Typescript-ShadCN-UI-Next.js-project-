export const fetchCurrency = async () => {
  try {
    const res = await fetch('https://api.frankfurter.app/currencies');
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Failed to fetch the currencies!.', error);
  }
};
