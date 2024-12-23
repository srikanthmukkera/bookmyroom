import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import h1 from '../../assets/images/h1.jpeg';
import {useAuth} from '../../context/AuthContext';
import {TextInput} from 'react-native-gesture-handler';
import {validateEmail} from '../../utils/validator';
function Login(props) {
  const {login} = useAuth();
  const [mail, setUserMail] = useState('');
  const [mailError, setMailError] = useState('');
  return (
    <View className="flex-1 w-full h-full relative flex items-center">
      <View className="w-full aspect-[6/3] absolute top-0 left-0">
        <Image
          source={h1}
          resizeMode="cover"
          className="w-full h-full rounded-b-[50px]"
        />
        <View className="absolute left-[33.33%] top-[60%] w-[33.33%] aspect-square bg-black rounded-full flex justify-center items-center">
          <Text className="text-2xl font-bold text-white text-center">
            Book My Room
          </Text>
        </View>
      </View>
      <View className="w-full h-full px-5 ">
        <View className="w-full aspect-[6/3] my-3"></View>
        <View className="w-full aspect-[24/3] my-3"></View>
        <View className="flex justify-end items-center h-[33.33%] px-5">
          <View className="w-full mb-5 rounded-md">
            <TextInput
              autoFocus
              className="p-3 bg-slate-100 border border-gray-200 rounded-md "
              placeholder="Enter email"
              onChangeText={value => {
                setUserMail(value);
                setMailError('');
              }}
            />
            <Text className="text-red-900 text-xs">{mailError}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (!validateEmail(mail)) {
                setMailError('please enter valid email');
              }
              if (mail && validateEmail(mail))
                login({
                  user: {
                    emailId: mail || 'srikanthmukkera96@gmail.com',
                    user_type_name: 'guest',
                  },
                  token: 'token',
                });
            }}
            className="p-2 bg-[#521f77]  w-full flex justify-center items-center rounded-xl">
            <Text className="text-white font-bold text-xl mb-1 text-center ">
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default Login;
