import React, {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import header from '../../assets/images/header.jpg';
import Icon from '@react-native-vector-icons/fontawesome6';
import EIcon from '@react-native-vector-icons/evil-icons';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {apiCallService, generateImageUrls} from '../../utils/apis/services';
import RoomDetails from '../../pages/RoomDetails';

const ListHeaderComponent = ({title}) => (
  <View className="p-3 flex justify-center">
    <Text className="text-xl mb-0 font-bold text-black">{title}</Text>
  </View>
);

function HomeScreen(props) {
  const {
    safeAreaHeight: height,
    safeAreaWidth: width,
    showBottomSheet,
    setShowBottomSheet,
    setShowBottomTab,
  } = useTheme();
  const scrollY = useSharedValue(0);
  const [cities, setCities] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [city, setCity] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [imges, setImages] = useState([]);
  useEffect(() => {
    setShowBottomTab(true);
    fetchCities();
    fetchHotels();
    fetchImages();
  }, []);

  const fetchHotels = () => {
    apiCallService('hotels', undefined, 'get', undefined).then(res => {
      console.log('hotels :', res.data);
      setHotels(res?.data?.data || []);
    });
  };
  const fetchImages = () => {
    generateImageUrls(setImages);
  };

  const fetchCities = () => {
    apiCallService('cities', undefined, 'get', undefined).then(res => {
      console.log('cities :', res.data);
      setCities(res?.data?.data || []);
      setCity((res?.data?.data || [])?.at(0));
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchCities();
    fetchHotels();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [0, 50],
        [Math.min(height / 2.5, (width * 2) / 3, 400), 80],
        Extrapolation.CLAMP,
      ),
      width,
      borderBottomRightRadius: interpolate(scrollY.value, [10, 40], [50, 0]),
      borderBottomLeftRadius: interpolate(scrollY.value, [10, 40], [50, 0]),
    };
  });

  const sticktyHeaderStyle = useAnimatedStyle(() => {
    return {
      height: Math.min(120, height * 0.15),
      padding: 8,
      opacity: interpolate(
        scrollY.value,
        [25, Math.min(120, height * 0.15)],
        [0.8, 1],
      ),
      transform: [
        {
          translateY: withSpring(
            scrollY.value < Math.min(120, height * 0.15)
              ? -Math.min(120, height * 0.15)
              : -5,
            {
              damping: 16,
            },
          ),
        },
      ],
      position: 'absolute',
      top: 0,
      width: '100%',
      zIndex: 2,
    };
  });

  const childOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, 25], [1, 0]),
      display: scrollY.value > 25 ? 'none' : 'block',
    };
  });

  const renderCard = ({item, index}) => {
    const images = imges.slice(
      (index * 5) % imges.length,
      ((index * 5) % imges.length) + 5,
    );

    return (
      <TouchableOpacity
        onPress={() => {
          setShowBottomSheet({
            ...showBottomSheet,
            isActive: true,
            index: 0,
            height: height * 0.9,
            children: <RoomDetails item={{...item, images}} {...props} />,
          });
        }}>
        <View className="h-full aspect-square bg-white rounded-[20px] overflow-hidden">
          <View className="w-full aspect-[3/2] bg-black">
            {images.at(0) ? (
              <Image source={{uri: images.at(0)}} className="w-full h-full" />
            ) : null}
          </View>
          <View className="w-full aspect-[3/1] ">
            <View className="p-2 px-4 flex  h-full">
              <View>
                <Text className="text-black text-sm font-semibold">
                  {item?.name || 'Entire cabin in Lillehammer'}
                </Text>
                <View className="flex flex-row items-center gap-x-1">
                  <Icon name="star" iconStyle="solid" size={12} />
                  <Text className="text-black text-xs ">
                    {item?.rating || '4.92'}
                  </Text>
                  <Text className="text-black text-xs ">
                    ({item?.reviews || '118 reviews'})
                  </Text>
                </View>
              </View>
              <View className="flex flex-row items-center justify-between">
                <Text className="text-black text-sm font-light">
                  {item?.numberOfGuests || 4} guests
                </Text>
                <Text className="text-black text-sm font-bold">
                  ₹ {item?.pricePerNight || 1300}/
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const locationDropdown = (
    <BottomSheetFlatList
      className="bg-gray-200 flex-1"
      //   style={{maxHeight: height * 0.75}}
      ListHeaderComponent={<ListHeaderComponent title={'Choose Location'} />}
      contentContainerClassName="p-3 gap-y-3 pb-5"
      scrollEnabled
      nestedScrollEnabled
      data={cities}
      keyExtractor={item => item?.id}
      renderItem={({item, index}) => {
        return (
          <TouchableOpacity
            onPress={() => {
              setCity(item);
            }}>
            <View className="w-full p-5 rounded-full bg-white ">
              <Text>{item?.name}</Text>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );

  return (
    <View style={{height}}>
      <Animated.View
        style={[{height: 0}, sticktyHeaderStyle]}
        className="w-full h-full bg-indigo-600 p-0 flex items-stretch gap-y-2 justify-between border-0">
        <ImageBackground
          className="top-0 absolute"
          style={{width, height: Math.min(120, height * 0.15)}}
          source={header}
          //   resizeMode="cover"
        />
        <View className="flex flex-row px-8">
          <TouchableOpacity
            onPress={() => {
              setShowBottomSheet({
                ...showBottomSheet,
                height: height * 0.6,
                isActive: !showBottomSheet?.isActive,
                children: locationDropdown,
              });
            }}>
            <View className="flex flex-row items-center gap-x-2 py-2">
              {/* <Icon name="pentosquare" color={'#fff'} size={14} /> */}
              <Text className="text-[#ededed]">{city?.name}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="flex flex-row p-1 sm:p-1 md:p-3 mb-3 bg-[#ededed45] rounded-full blur-3xl">
          <View className=" aspect-square flex justify-center items-center">
            <EIcon name="search" color={'#fff'} size={24} />
          </View>
          <View>
            <Text className="text-[#ededed]">Search places</Text>
            <Text className="text-[#ededed] font-light text-sm">
              Date range . Number of guests
            </Text>
          </View>
        </View>
      </Animated.View>
      <Animated.ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        className="flex-1"
        contentContainerClassName="pb-[15%]"
        scrollEnabled
        nestedScrollEnabled>
        <Animated.View
          style={[headerStyle]}
          className="w-full bg-black p-8 flex justify-between min-h-[80px] overflow-hidden">
          <Image
            className="  absolute"
            style={{
              width,
              height: Math.min(height / 2.5, (width * 2) / 3, 400),
            }}
            source={header}
            resizeMethod="resize"
            resizeMode="stretch"
          />
          <View className="flex flex-row items-center">
            <TouchableOpacity
              onPress={() => {
                setShowBottomSheet({
                  ...showBottomSheet,
                  height: height * 0.6,
                  isActive: !showBottomSheet?.isActive,
                  children: locationDropdown,
                });
              }}>
              <View className="flex flex-row items-center gap-x-2">
                <Text className="text-[#ededed]">{city?.name}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <Animated.Text
            className="text-white text-3xl font-light"
            style={[childOpacityStyle]}>
            Hey, Martin! Tell us where you want to go
          </Animated.Text>
          <View className="flex flex-row p-3 bg-[#ededed23] rounded-full blur-3xl">
            <View className=" aspect-square flex justify-center items-center">
              <EIcon name="search" color={'#fff'} size={24} />
            </View>
            <View>
              <Text className="text-[#ededed]">Search places</Text>
              <Text className="text-[#ededed] font-light text-sm">
                Date range . Number of guests
              </Text>
            </View>
          </View>
        </Animated.View>
        <View className="flex">
          <View className="flex">
            <ListHeaderComponent title={'Most Relevent '} />
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{
                height: Math.min(Math.min(height / 3, 350), (width * 2) / 3),
              }}
              className="my-2"
              contentContainerClassName="px-3 gap-x-5"
              data={hotels}
              keyExtractor={item => item?.id}
              renderItem={renderCard}
            />
          </View>
          <View className="flex">
            <ListHeaderComponent title={'Most Luxury '} />
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{
                height: Math.min(Math.min(height / 3, 350), (width * 2) / 3),
              }}
              className="my-2"
              contentContainerClassName="px-3 gap-x-5"
              data={[1, 2, 3, 4]}
              keyExtractor={item => item}
              renderItem={renderCard}
            />
          </View>
          <View className="flex">
            <ListHeaderComponent title={'Most Budget '} />
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{
                height: Math.min(Math.min(height / 3, 350), (width * 2) / 3),
              }}
              className="my-2"
              contentContainerClassName="px-3 gap-x-5"
              data={[1, 2, 3, 4]}
              keyExtractor={item => item}
              renderItem={renderCard}
            />
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

export default HomeScreen;
