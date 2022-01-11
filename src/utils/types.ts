// login stack type
export type LoginStackParamList = Record<
  'loginScreen' | 'homeScreen',
  undefined
>;

// bottom tab params
export type TabParamList = Record<'login' | 'api' | 'ble', undefined>;

// crypto currency data type
export type CoinData = {
  // current coin rate
  current_price: number;
  // % change in price
  price_change_percentage_7d_in_currency: number;
  // 7day change in price
  sparkline_in_7d: {
    price: number[];
  };
} & Record<'image' | 'name' | 'symbol' | 'id', string>;

export default null;
