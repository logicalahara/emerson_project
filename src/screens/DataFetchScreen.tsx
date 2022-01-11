import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Text, FlatList, Image, VStack, HStack} from 'native-base';
import {DataTable} from 'react-native-paper';
import {VictoryLine} from 'victory-native';
import SplashScreen from './SplashScreen';
import axios from 'axios';
import dayjs from 'dayjs';
import {COIN_API_URL, COLORS} from '../utils/globals';
import {CoinData} from '../utils/types';

// table columns
const tableColumns = ['CURRENCY', 'RATE', 'ANALYSIS (7 DAYS)'];

const DataFetchScreen = () => {
  // data loading spinner state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // controlling fetched coin data
  const [coinsData, setCoinsData] = useState<CoinData[]>([]);

  // fetching crypto coins data
  const fetchCoins = () => {
    setIsLoading(true);
    axios
      .get(COIN_API_URL, {method: 'GET'})
      .then(({data}) => {
        setIsLoading(false);
        setCoinsData(data);
      })
      .catch((err: Error) => {
        console.log('API Error', err.message);
        setIsLoading(false);
      });
  };

  // componentDidMount
  useEffect(() => {
    // invoking to fetch coin data
    fetchCoins();
  }, []);

  // function to render list item
  const _renderItem = ({item}: {item: CoinData}) => {
    // coin exchange rate
    const rate = Number(item.current_price).toFixed(2);
    // % change in rate in 24hr
    const percentRateChange = Number(
      item.price_change_percentage_7d_in_currency,
    );
    // calculating unix timestamp for each data point
    const sevenDayTimestamp = dayjs().subtract(7, 'days').unix();
    // sparkline data to plot
    const sevenDaySparkLine = item.sparkline_in_7d.price.map(
      (timestamp: number, index: number) => ({
        x: sevenDayTimestamp + (index + 1) * 3600,
        y: timestamp,
      }),
    );

    return (
      <DataTable.Row key={item.id}>
        <DataTable.Cell>
          <HStack alignItems="center">
            <Image source={{uri: item.image}} alt={item.name} size={5} />
            <VStack pl={3}>
              <Text style={{fontWeight: '700'}}>{item.name}</Text>
              <Text style={{color: 'grey', textTransform: 'uppercase'}}>
                {item.symbol}
              </Text>
            </VStack>
          </HStack>
        </DataTable.Cell>
        <DataTable.Cell>
          <VStack px={0} mx={0}>
            <Text>
              {`$ `}
              {rate}
            </Text>
            <Text
              style={{
                color: percentRateChange < 0 ? COLORS.red : COLORS.green,
                fontSize: 12,
              }}>
              {percentRateChange > 0 ? '+' : null}
              {percentRateChange.toFixed(2)} %
            </Text>
          </VStack>
        </DataTable.Cell>
        <VictoryLine
          style={{
            data: {stroke: percentRateChange > 0 ? COLORS.green : COLORS.red},
          }}
          animate={false}
          y="y"
          data={sevenDaySparkLine}
          padding={5}
          width={130}
          height={50}
        />
      </DataTable.Row>
    );
  };

  return isLoading ? (
    <SplashScreen loadingLabel="Crypting" />
  ) : (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <DataTable>
        <DataTable.Header>
          {tableColumns.map(title => (
            <DataTable.Title>
              <Text style={{fontWeight: '700', fontSize: 12}}>{title}</Text>
            </DataTable.Title>
          ))}
        </DataTable.Header>
        <FlatList
          maxToRenderPerBatch={20}
          windowSize={50}
          keyExtractor={item => item.id}
          data={coinsData}
          renderItem={_renderItem}
        />
      </DataTable>
    </View>
  );
};

export default DataFetchScreen;
