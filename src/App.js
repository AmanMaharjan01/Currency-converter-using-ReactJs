import React, { useState, useEffect } from "react";
import "./App.css";
import CurrencyRow from "./CurrencyRow";

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [exchange, setExchange] = useState();
  const [amount, setAmount] = useState(1);
  const [amountfromcurrency, setAmountfromcurrency] = useState(true);

  let toAmount, fromAmount;

  if (amountfromcurrency) {
    fromAmount = amount;
    toAmount = amount * exchange;
  } else {
    toAmount = amount;
    fromAmount = amount / exchange;
  }

  useEffect(() => {
    fetch("https://api.exchangeratesapi.io/latest")
      .then((res) => res.json())
      .then((data) => {
        const first = Object.keys(data.rates)[0];
        setCurrencyOptions([data.base, ...Object.keys(data.rates)]);
        setFromCurrency(data.base);
        setToCurrency(first);
        setExchange(data.rates[first]);
      });
  }, []);

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(
        `https://api.exchangeratesapi.io/latest?base=${fromCurrency}&symbols=${toCurrency}`
      )
        .then((res) => res.json())
        .then((data) => setExchange(data.rates[toCurrency]));
    }
  }, [toCurrency, fromCurrency]);

  const onChangeFromCurrency = (e) => {
    setFromCurrency(e.target.value);
  };

  const onChangeToCurrency = (e) => {
    setToCurrency(e.target.value);
  };

  function onChangeFromAmount(e) {
    setAmount(e.target.value);
    setAmountfromcurrency(true);
  }

  const onChangeToAmount = (e) => {
    setAmount(e.target.value);
    setAmountfromcurrency(false);
  };

  return (
    <div className="App">
      <h1>Convert</h1>
      <CurrencyRow
        currencyOption={currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeCurrency={onChangeFromCurrency}
        amount={fromAmount}
        onChangeAmount={onChangeFromAmount}
      />
      <div className="equals"> = </div>
      <CurrencyRow
        currencyOption={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={onChangeToCurrency}
        amount={toAmount}
        onChangeAmount={onChangeToAmount}
      />
    </div>
  );
}

export default App;
