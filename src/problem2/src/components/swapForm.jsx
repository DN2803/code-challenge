import React, { useState, useEffect } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
} from "@mui/material";

const SwapForm = () => {
  const [rates, setRates] = useState({});
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch exchange rates từ API
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch("https://interview.switcheo.com/prices.json");
        const data = await response.json();

        // Chuẩn hóa dữ liệu: Chuyển array thành object {currency: price}
        const formattedRates = data.reduce((acc, item) => {
          acc[item.currency] = item.price;
          return acc;
        }, {});

        setRates(formattedRates);
        setLoading(false);
      } catch (err) {
        setError("Failed to load exchange rates. Please try again later.");
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  // Cập nhật tỷ giá khi chọn đơn vị tiền tệ
  useEffect(() => {
    if (rates[fromCurrency] && rates[toCurrency]) {
      setRate(rates[toCurrency] / rates[fromCurrency]);
    } else {
      setRate(null);
    }
  }, [fromCurrency, toCurrency, rates]);

  // Xử lý khi nhập số tiền cần đổi
  const handleAmountChange = (e) => {
    const inputAmount = parseFloat(e.target.value) || 0;
    setAmount(e.target.value);
    setConvertedAmount(rate ? (inputAmount * rate).toFixed(6) : "");
  };

  // Xử lý xác nhận đổi tiền
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rate) {
      alert("Unable to perform swap. Please select a valid currency pair.");
      return;
    }
    alert(`Swap Successful: Sent ${amount} ${fromCurrency} → Received ${convertedAmount} ${toCurrency}`);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Card sx={{ maxWidth: 400, margin: "auto", mt: 4, p: 3, textAlign: "center" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Currency Swap
        </Typography>

        {/* Chọn tiền tệ nguồn */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>From Currency</InputLabel>
          <Select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {Object.keys(rates).map((currency) => (
              <MenuItem key={currency} value={currency}>
                {currency}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          type="number"
          label="Amount to Send"
          value={amount}
          onChange={handleAmountChange}
          inputProps={{ min: 0 }}
          sx={{ mb: 2 }}
        />

        {/* Chọn tiền tệ đích */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>To Currency</InputLabel>
          <Select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {Object.keys(rates).map((currency) => (
              <MenuItem key={currency} value={currency}>
                {currency}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Amount to Receive"
          value={convertedAmount}
          InputProps={{ readOnly: true }}
          sx={{ mb: 2 }}
        />

        <Typography variant="body1" gutterBottom>
          Exchange Rate: {rate ? `1 ${fromCurrency} = ${rate.toFixed(6)} ${toCurrency}` : "N/A"}
        </Typography>

        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
          CONFIRM SWAP
        </Button>
      </CardContent>
    </Card>
  );
};

export default SwapForm;
