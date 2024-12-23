import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useAuth} from '../../context/AuthContext';
import Icon from '@react-native-vector-icons/fontawesome6';
import EIcon from '@react-native-vector-icons/evil-icons';
import martin from '../../assets/images/martin.jpg';
function Profile(props) {
  const {user, logout} = useAuth();
  return (
    <ScrollView
      className="flex-1 bg-gray-300"
      contentContainerClassName="p-2 pb-[12%]">
      <View className="w-full flex flex-row bg-yellow-700 rounded-[20px] p-3 relative">
        <TouchableOpacity
          className="absolute top-2 right-2 bg-red-900 w-8 aspect-square rounded-full flex justify-center items-center "
          onPress={logout}>
          <View>
            <EIcon name="share-apple" color={'white'} size={20} />
          </View>
        </TouchableOpacity>
        <View className="w-[33%] max-w-[250px] aspect-square bg-black rounded-full">
          <Image source={martin} className="w-full h-full rounded-full" />
        </View>
        <View className="p-2 py-5 gap-y-3">
          <View>
            <Text className="text-xl font-bold text-black">
              {user?.name || 'Martin Luther'}
            </Text>
            <Text className="text-sm font-medium text-black">
              {user?.emailId || 'martinluther@gmail.com'}
            </Text>
          </View>
          <View>
            <Text className="text-white -700 bg-black p-1 text-center rounded">
              Plus Membership
            </Text>
          </View>
        </View>
      </View>
      <View className="my-3 bg-white w-full p-3 rounded-[20px] flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-x-2 p-2">
          <Icon name="user" size={16} color={'#000'} />
          <Text className="text-lg font-medium text-black">Your profile </Text>
        </View>
        <View className="p-2 bg-yellow-50 rounded">
          <Text className="text-sm font-medium text-yellow-800 ">
            30% Completed
          </Text>
        </View>
      </View>
      <View className="mb-3 bg-white w-full p-3 rounded-[20px] flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-x-2 p-2">
          <Icon name="star" size={16} color={'#000'} />
          <Text className="text-lg font-medium text-black">Your Ratings </Text>
        </View>
        <View className="p-2 bg-yellow-50 rounded flex flex-row items-center gap-x-2">
          <Text className="text-sm font-medium text-yellow-800 ">4.5</Text>
          <Icon name="star" iconStyle="solid" size={12} color={'#854d0e'} />
        </View>
      </View>

      <View className="mb-3 bg-white w-full p-3 rounded-[20px] flex flex-row items-center justify-between">
        <View className=" bg-white flex-1 p-3 rounded-[20px] flex items-center justify-between">
          <View className="flex items-center gap-x-2 p-2">
            <View className="p-5 aspect-square flex justify-center items-center bg-slate-200 rounded-full overflow-hidden ">
              <Icon name="user" size={16} color={'#000'} />
            </View>
            <Text className="text-lg font-medium text-black">
              Total Bookings
            </Text>
          </View>
          <View className="p-2 bg-yellow-50 rounded">
            <Text className="text-sm font-medium text-yellow-800 ">10</Text>
          </View>
        </View>
        <View className="mb-3 bg-white flex-1 p-3 rounded-[20px] flex items-center justify-between">
          <View className="flex  items-center gap-x-2 p-2">
            <View className="p-5 aspect-square flex justify-center items-center bg-slate-200 rounded-full ">
              <Text className="text-xl font-semibold text-black">₹</Text>
            </View>
            <Text className="text-lg font-medium text-center text-black">
              Amount Spent
            </Text>
          </View>
          <View className="p-2 bg-yellow-50 rounded flex flex-row items-center gap-x-2">
            <Text className="text-sm font-medium text-yellow-800 ">
              120,500/-
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default Profile;
