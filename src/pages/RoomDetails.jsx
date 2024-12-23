import {
  BottomSheetFlashList,
  BottomSheetFlatList,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {useCallback} from 'react';
import {useTheme} from '../context/ThemeContext';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Icon from '@react-native-vector-icons/fontawesome6';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import isebelle from '../assets/images/isebelle.jpg';
function FloatingTabBar({
  item,
  height,
  state,
  descriptors,
  navigation,
  showBottomTab,
}) {
  const {setShowBottomSheet} = useTheme();
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = showBottomTab ? 0 : height * 0.15;
  }, [showBottomTab]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: withSpring(translateY.value, {damping: 12})}],
  }));

  return (
    <Animated.View
      className="w-[90%] flex flex-row mx-auto absolute rounded-full bg-[#521f77] blur-2xl justify-around left-[5%] p-2  bottom-2"
      style={[animatedStyle]}>
      <View
        style={{height: Math.min(50, height * 0.075)}}
        className="flex flex-row justify-between items-center">
        <View className="w-[60%]">
          <Text className="text-white font-thin text-xs">
            18-21 Oct . 3 nights
          </Text>
          <View className="flex flex-row items-baseline">
            <Text className="text-white font-medium text-xl">
              ₹ {item?.pricePerNight || 1300}/
            </Text>
            <Text className="text-white font-thin text-xs">per night</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            setShowBottomSheet(prev => ({
              ...(prev || {}),
              isActive: false,
              children: null,
              index: -1,
            }));
            setTimeout(() => {
              navigation?.navigate('checkout', {params: item});
            }, 300);
          }}>
          <View className="h-full aspect-[12/5] rounded-full bg-white flex justify-center items-center">
            <Text className="text-black font-semibold text-base">Book now</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const CustomItem = ({item, index, animationValue}) => {
  //   const maskStyle = useAnimatedStyle(() => {
  //     const backgroundColor = interpolateColor(
  //       animationValue?.value,
  //       [-1, 0, 1],
  //       ['#000000dd', 'transparent', '#000000dd'],
  //     );

  //     return {
  //       backgroundColor,
  //     };
  //   }, [animationValue]);

  return (
    <View style={{flex: 1}}>
      {/* <Text className="text-white">{item}</Text> */}
      <Image
        source={{uri: item}}
        className="w-full h-full"
        // resizeMode="contain"
      />
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          },
          //   maskStyle,
        ]}
      />
    </View>
  );
};

function RoomDetails({item, ...props}) {
  const {safeAreaHeight: height, safeAreaWidth: width} = useTheme();
  const animationStyle = useCallback(value => {
    'worklet';

    const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
    const translateX = interpolate(value, [-2, 0, 1], [-width, 0, width]);

    return {
      transform: [{translateX}],
      zIndex,
    };
  }, []);

  return (
    <BottomSheetScrollView style={{maxHeight: '100%', width}}>
      <View className="w-full aspect-video lg:aspect-square md:aspect-[5/3] bg-black rounded-b-[25px]">
        <Carousel
          mode="parallax"
          loop={true}
          autoPlay
          style={{width: width, height: '100%'}}
          width={width}
          data={item?.images || []}
          renderItem={({item, index, animationValue}) => {
            return (
              <CustomItem
                item={item}
                key={item}
                index={index}
                animationValue={animationValue}
              />
            );
          }}
          customAnimation={animationStyle}
          scrollAnimationDuration={1200}
        />
      </View>
      <View className="p-2 px-4 flex gap-y-1 border-b border-b-gray-200">
        <Text className="text-black text-xl font-semibold">
          {item?.name || 'Entire cabin in Lillehammer'}
        </Text>
        <View className="flex flex-row items-center gap-x-1">
          <Icon name="star" iconStyle="solid" size={16} />
          <Text className="text-black text-lg ">{item?.rating || '4.92'}</Text>
          <Text className="text-black text-lg ">
            ({item?.reviews || '118'} reviews)
          </Text>
        </View>
      </View>
      <View className="p-2 px-4 flex flex-row items-center justify-between border-b border-b-gray-200">
        <View className=" flex gap-y-0 ">
          <Text className="text-black text-sm font-medium m-0 p-0">
            {item?.type || 'Entire home'}
          </Text>
          <View className="flex flex-row items-center gap-x-1">
            <Text className="text-black text-xs ">
              Hosted by {item?.host || 'Isabelle'}
            </Text>
          </View>
        </View>
        <View className="max-h-[50px] h-full aspect-square rounded-full bg-black">
          <Image source={isebelle} className="w-full h-full rounded-full" />
        </View>
      </View>
      <View className="p-2 px-4 flex  justify-between border-b border-b-gray-200">
        <View className="">
          <Text className="text-black text-sm font-medium m-0 p-0">
            {'Amenities'}
          </Text>
        </View>
        <View className="flex gap-y-0 ">
          <BottomSheetScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            directionalLockEnabled={true}
            alwaysBounceVertical={false}>
            <BottomSheetFlatList
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
          </BottomSheetScrollView>
        </View>
      </View>
      <View className="p-2 px-4 flex flex-row items-center justify-between">
        <View>
          <View className=" flex gap-y-0 flex-row items-center gap-x-2">
            <Icon name="map" />
            <Text className="text-black text-md font-medium m-0 p-0">
              {'Self chek-in'}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-x-2">
            <Text className="text-slate-700 text-xs ">
              Check yourself in with the lockbox
            </Text>
          </View>
        </View>
      </View>

      <View className="p-2 px-4 flex flex-row items-center justify-between">
        <View>
          <View className=" flex gap-y-0 flex-row items-center gap-x-2">
            <Icon name="map" />
            <Text className="text-black text-md font-medium m-0 p-0">
              Great check-in experience
            </Text>
          </View>
          <View className="flex flex-row items-center gap-x-2">
            <Text className="text-slate-700 text-xs ">
              98% of recent guests gave the check-in proces a 5-star rating
            </Text>
          </View>
        </View>
      </View>
      <FloatingTabBar item={item} height={height} {...props} />
    </BottomSheetScrollView>
  );
}

export default RoomDetails;
