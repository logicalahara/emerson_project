import React, {useEffect, useState} from 'react';
import {View, processColor} from 'react-native';
import {Text, FlatList, Image, VStack, HStack} from 'native-base';
import {SvgUri} from 'react-native-svg';
import {DataTable, Avatar} from 'react-native-paper';
import {LineChart, LineValue} from 'react-native-charts-wrapper';
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryArea,
  VictoryLine,
  Aread,
} from 'victory-native';
import {API_KEY, BASE_URI} from '../utils/globals';
import SplashScreen from './SplashScreen';
import axios from 'axios';
import dayjs from 'dayjs';
const data = [
  {quarter: 1, earnings: 13000},
  {quarter: 2, earnings: 16500},
  {quarter: 3, earnings: 14250},
  {quarter: 4, earnings: 19000},
];

const DataFetchScreen = () => {
  // data loading spinner state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // controlling fetched coin data
  const [coinsData, setCoinsData] = useState([]);

  // fetching crypto coins data
  const fetchCoins = () => {
    setIsLoading(true);
    // fetch(`${BASE_URI}/coins`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-access-token': API_KEY,
    //     'Access-Control-Allow-Origin': '*',
    //   },
    // })
    //   .then(response => {
    //     if (response.status === 200) {
    //       response
    //         .json()
    //         .then(({data}) => {
    //           console.log('res', data.coins);
    //           setCoinsData(data.coins);
    //           setIsLoading(false);
    //         })
    //         .catch(err => {
    //           setIsLoading(false);
    //           console.log(new Error(err));
    //         });
    //     }
    //   })
    //   .catch(err => {
    //     setIsLoading(false);
    //     throw new Error(err);
    //   });
    axios
      .get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=16&page=1&sparkline=true&price_change_percentage=7d',
      )
      .then(({data}) => {
        setIsLoading(false);
        console.log(data);
        setCoinsData(data);
      })
      .catch((err: Error) => {
        console.log('API Err', err.message);
        setIsLoading(false);
      });
  };

  // componentDidMount
  useEffect(() => {
    fetchCoins();
  }, []);

  //
  const _renderItem = ({item}) => {
    // coin exchange rate
    const rate = Number(item.current_price).toFixed(2);
    // % change in rate in 24hr
    const percentRateChange = Number(
      item.price_change_percentage_7d_in_currency,
    );

    //
    const sevenDayTimestamp = dayjs().subtract(7, 'days').unix();

    //
    const sevenDaySparkLine = (item.sparkline_in_7d.price as number[]).map(
      (timestamp, index) => ({
        x: sevenDayTimestamp + (index + 1) * 3600,
        y: timestamp,
      }),
    );

    console.log('sevenDaySparkLine', sevenDaySparkLine);

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
                color: percentRateChange < 0 ? 'red' : 'green',
                fontSize: 12,
              }}>
              {percentRateChange > 0 ? '+' : null}
              {percentRateChange.toFixed(2)}
            </Text>
          </VStack>
        </DataTable.Cell>
        <VictoryLine
          style={{
            data: {stroke: percentRateChange > 0 ? '#34a853' : '#C9121E'},
          }}
          animate={false}
          y="y"
          data={sevenDaySparkLine}
          padding={4}
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
          <DataTable.Title>
            <Text style={{fontWeight: '700', fontSize: 12}}>CURRENCY</Text>
          </DataTable.Title>
          <DataTable.Title>
            <Text style={{fontWeight: '700', fontSize: 12}}>RATE</Text>
          </DataTable.Title>
          <DataTable.Title>
            <Text style={{fontWeight: '700', fontSize: 12}}>ANALYSIS</Text>
          </DataTable.Title>
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
