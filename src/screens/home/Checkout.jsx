import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from '@react-native-vector-icons/evil-icons';
import FaIcon from '@react-native-vector-icons/fontawesome6';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {useAuth} from '../../context/AuthContext';
import martin from '../../assets/images/martin.jpg';
import isebelle from '../../assets/images/isebelle.jpg';
import {apiCallService} from '../../utils/apis/services';
import moment from 'moment';
function Checkout(props) {
  const {user} = useAuth();
  const navigation = useNavigation();
  const [numOfGuests, setNumOfGuests] = useState(1);
  const {
    safeAreaHeight: height,
    safeAreaWidth: width,
    setShowBottomTab,
  } = useTheme();

  const {params: item} = useRoute()?.params;

  useEffect(() => {
    console.log(item, 'params');
  }, [item]);
  useEffect(() => {
    setShowBottomTab(false);
    return () => {
      setShowBottomTab(true);
    };
  }, [navigation]);
  return (
    <View style={{height, width, flex: 1}}>
      <View className="w-full p-2 min-h-[50px] h-[10%] max-h-[120px] flex justify-center">
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          className="p-2 bg-[#00000045] rounded-full">
          <Icon name="chevron-left" color={'white'} size={50} />
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1 w-full px-2">
        <View className="flex flex-row items-center justify-between">
          <View className="p-2 px-4 flex gap-y-1 max-w-[75%]">
            <Text className="text-black text-xl font-semibold">
              {item?.name || 'Entire cabin in Lillehammer sf'}
            </Text>
            <View className="flex flex-row items-center gap-x-1">
              <FaIcon name="star" iconStyle="solid" size={16} />
              <Text className="text-black text-lg ">
                {item?.rating || '4.92'}
              </Text>
              <Text className="text-black text-lg ">
                ({item?.reviews || '118'} reviews)
              </Text>
            </View>
          </View>
          <View className="flex flex-row">
            <View className="w-[100px] aspect-square lg:aspect-square md:aspect-[4/3] bg-black rounded-[25px]"></View>
          </View>
        </View>
        <View className="p-2 px-4 flex flex-row items-center gap-x-2 border-b border-b-gray-200">
          <View className="max-h-[50px] h-full aspect-square rounded-full bg-black">
            <Image source={isebelle} className="w-full h-full rounded-full" />
          </View>
          <View className=" flex gap-y-0 ">
            <Text className="text-black text-sm font-medium m-0 p-0 capitalize">
              {item?.type || 'Entire home'}
            </Text>
            <View className="flex flex-row items-center gap-x-1">
              <Text className="text-black text-xs ">
                Hosted by {item?.host || 'Isabelle'}
              </Text>
            </View>
          </View>
        </View>
        <View className="p-2 px-4 flex  justify-between border-b border-b-gray-200">
          <View className="">
            <Text className="text-black text-sm font-medium m-0 p-0">
              {'Amenities'}
            </Text>
          </View>
          <View className="flex gap-y-0 ">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              directionalLockEnabled={true}
              alwaysBounceVertical={false}>
              <FlatList
                data={[
                  'wi-fi',
                  "65' HDTv",
                  'Indoor fireplace',
                  'Hair dryer',
                  'washing machine',
                  'Dryer',
                  'Refrigerator',
                  'Dishwasher',
                ]}
                contentContainerClassName={'flex-start'}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                ketExtractor={item => item}
                numColumns={Math.ceil(4)}
                renderItem={({item, index}) => {
                  return (
                    <Text className="bg-indigo-100 font-semibold text-xs text-slate-600 p-1 px-3 rounded-full m-1">
                      {item}
                    </Text>
                  );
                }}
              />
            </ScrollView>
          </View>
        </View>
        <View className="p-2 px-4 flex flex-row items-center justify-between border-b border-b-gray-200">
          <View>
            <View className=" flex gap-y-0 flex-row items-center justify-between gap-x-2 ">
              <View className="flex gap-y-0 flex-row items-center gap-x-2 w-[70%]">
                <Icon name="heart" size={16} />
                <Text className="text-black text-md font-medium m-0 p-0">
                  {'Number of Nights'}
                </Text>
              </View>
              <View className="">
                <View className="flex flex-row items-center justify-center gap-x-3">
                  <TouchableOpacity
                    onPress={() => {
                      setNumOfGuests(prev => (0 < prev ? prev - 1 : prev));
                    }}>
                    <View
                      className={`bg-red-500 w-8 aspect-square rounded-md flex justify-center items-center ${
                        numOfGuests <= 0 ? 'opacity-50' : 'opacity-100'
                      }`}>
                      <Text className="text-white text-xl font-bold">-</Text>
                    </View>
                  </TouchableOpacity>
                  <View>
                    <Text>{numOfGuests}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setNumOfGuests(prev => (prev < 3 ? prev + 1 : prev));
                    }}>
                    <View
                      className={`bg-red-500 w-8 aspect-square rounded-md flex justify-center items-center ${
                        numOfGuests >= 3 ? 'opacity-50' : 'opacity-100'
                      }`}>
                      <Text className="text-white text-xl font-bold">+</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View className="flex flex-row items-center gap-x-2">
              <Text className="text-slate-700 text-xs ">
                {'Add day/nights count on counter'}
              </Text>
            </View>
          </View>
          <View>
            <View className=" flex gap-y-0 flex-row items-center gap-x-2">
              <Text className="text-black text-md font-medium m-0 p-0"></Text>
            </View>
            <View className="flex flex-row items-center gap-x-2">
              <Text className="text-slate-700 text-xs"></Text>
            </View>
          </View>
        </View>
        <View className="p-2 px-4 flex flex-row items-center justify-between border-b border-b-gray-200">
          <View className="flex flex-row items-center gap-x-2">
            <View className="w-[50px] aspect-square rounded-full bg-black">
              <Image
                source={martin}
                resizeMethod="resize"
                className="w-full h-full rounded-full object-top"
              />
            </View>
            <View>
              <View className=" flex gap-y-0 flex-row items-center gap-x-2">
                <Icon name="envelope" size={20} />
                <Text className="text-black text-md font-medium m-0 p-0">
                  {user?.name || 'Martin Luther'}
                </Text>
              </View>
              <View className="flex flex-row items-center gap-x-2">
                <Text className="text-slate-700 text-xs">
                  {user?.emailId || 'martinluther@gmail.com'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="p-2 px-4 flex flex-row items-center justify-between border-b border-b-gray-200">
          <View>
            <View className=" flex gap-y-0 flex-row items-end justify-between gap-x-2 ">
              <View className="flex gap-y-0 flex-row items-center gap-x-2 w-[80%]">
                <Icon name="credit-card" size={20} />
                <Text className="text-black text-md font-medium m-0 p-0">
                  Total bill
                </Text>
              </View>
              <View>
                <Text className="text-black text-md font-semibold m-0 p-0">
                  {(item?.pricePerNight || 1300) * numOfGuests}/-
                </Text>
              </View>
            </View>
            <View className="flex flex-row items-center gap-x-2">
              <Text className="text-slate-700 text-xs ">
                Incl taxes,charges & donation
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <FloatingTabBar
        item={item}
        totalAmount={(item?.pricePerNight || 1300) * numOfGuests}
        height={height}
        {...props}
        showBottomTab={true}
      />
    </View>
  );
}

function FloatingTabBar({
  item,
  totalAmount,
  height,
  state,
  descriptors,
  navigation,
  showBottomTab,
}) {
  const {user} = useAuth();
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = showBottomTab ? 0 : height * 0.15;
  }, [showBottomTab]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: withSpring(translateY.value, {damping: 12})}],
  }));
  const handleCheckOut = () => {
    console.log({
      to: user?.emailId,
      bookingInfo: {
        name: 'Martin Luther',
        'Booking Id': `${Math.random() * 20}`.slice(2, 12),
        'Number of Guests': item?.numOfGuests,
        Date: moment().format('YYYY-MM-DD'),
        Time: moment().format('HH:mm:ss'),
        Location: item?.city?.name || 'Hyderabad',
        Hotel: item?.name,
        'Booking Price': totalAmount,
      },
    }),
      'payload===';

    apiCallService('send-email', undefined, 'post', {
      to: user?.emailId,
      bookingInfo: {
        name: user?.emailId,
        'Booking Id': `${Math.random() * 20}`.slice(2, 12),
        'Number of Guests': item?.numOfGuests,
        Date: moment().format('YYYY-MM-DD'),
        Time: moment().format('HH:mm:ss'),
        Location: item?.city?.name || 'Hyderabad',
        Hotel: item?.name,
        'Booking Price': totalAmount,
      },
    })
      .then(res => {
        console.log(res);
      })
      .finally(() => {
        navigation?.goBack();
      });
  };

  return (
    <Animated.View
      className="w-[90%] flex flex-row mx-auto absolute rounded-full bg-[#521f77] blur-2xl justify-around left-[5%] p-2  bottom-2"
      style={[animatedStyle]}>
      <View
        style={{height: Math.min(50, height * 0.075)}}
        className="flex flex-row justify-between items-center">
        <View className="w-[60%] hidden">
          <Text className="text-white font-thin text-xs">
            18-21 Oct . 3 nights
          </Text>
          <View className="flex flex-row items-baseline">
            <Text className="text-white font-medium text-xl">₹ 1300/</Text>
            <Text className="text-white font-thin text-xs">per night</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            handleCheckOut();
          }}>
          <View className="h-full aspect-[16/5] rounded-full flex justify-center items-center">
            <Text className="text-white font-semibold text-xl">
              Pay {totalAmount}/- Now
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export default Checkout;
