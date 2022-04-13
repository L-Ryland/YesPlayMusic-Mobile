import React from "react";
import {
  TouchableHighlight,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import styled from "styled-components/native";
import QRCode from 'react-native-qrcode-svg';

import md5 from "crypto-js/md5";
import { View, Text, TextInput, Button, Image } from "@/components";
import { X, Mail, Lock, Mobile } from "@/components/icons";
import countryCodes from "@/countries-emoji.json";
import { NavigationProp, useNavigation } from "@react-navigation/core";
import { checkLoginQrCodeStatus, fetchLoginQrCodeKey, loginWithEmail, loginWithPhone } from "@/api";
import { isAccountLoggedIn, setCookies } from "@/utils/auth";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { fetchLikedThings, fetchUserProfile, selectData, setLoginMode, updateData } from "@/redux/slice/dataSlice";
import { RootStackParamList, RootTabParamList } from "@/types";

const AuthenticationMode = React.createContext("qr");

function EmailBox({ onChangeText, placeholder, onEndEditing }) {
  const [activeColor, setActiveColor] = React.useState("black");
  return (
    <InputBox>
      <Mail height={20} width={20} color={activeColor} />
      <TextInput
        placeholder={placeholder}
        onChangeText={onChangeText}
        onFocus={() => setActiveColor("#2f95dc")}
        onBlur={() => setActiveColor("black")}
        onEndEditing={onEndEditing}
        // onChangeText={handleChange}
        autoCompleteType="email"
        textContentType="emailAddress"
        style={styles.inputFrameStyle}
        keyboardType="email-address"
      />
    </InputBox>
  );
}
function MobileNumBox({ onChangeText, placeholder }) {
  const [activeColor, setActiveColor] = React.useState("black");
  const [selectedCallingCode, setSelectedCallingCode] = React.useState(86);
  // console.log("country codes", Object.keys(countryCodes));

  return (
    <InputBox>
      <Mobile height={20} width={20} color={activeColor} />
      <Picker
        selectedValue={selectedCallingCode}
        onValueChange={(itemValue, _) => setSelectedCallingCode(itemValue)}
        mode='dialog' //android
        style={[styles.inputFrameStyle, {maxWidth: 60, marginLeft: 40}]}
      >
        {Object.keys(countryCodes).map((code) =>
          <Picker.Item key={code} label={"+" + countryCodes[code].callingCode} value={countryCodes[code].callingCode} />
        )}
      </Picker>
      <TextInput
        onFocus={() => setActiveColor("#2f95dc")}
        onBlur={() => setActiveColor("black")}
        onChangeText={(value)=>onChangeText(selectedCallingCode.toString(), value.trim())}
        style={styles.inputFrameStyle}
      />
    </InputBox>
  );
}
function PasswordBox({ onChangeText, placeholder }) {
  const [activeColor, setActiveColor] = React.useState("black");
  return (
    <InputBox>
      <Lock height={20} width={20} color={activeColor} />
      <TextInput
        placeholder={placeholder}
        onChangeText={onChangeText}
        onFocus={() => setActiveColor("#2f95dc")}
        onBlur={() => setActiveColor("black")}
        autoCompleteType="password"
        textContentType="password"
        secureTextEntry={true}
        style={styles.inputFrameStyle}
      />
    </InputBox>
  );
}
const QrContainer = styled(View)`  
  background-color: #eaeffd;
  padding: 24px 24px 21px 24px;
  border-radius: 20;
  margin-bottom: 12px;
`
const LoginEmail = (props) => {
  const login = {
    email: "Email",
    password: "Password",
    loginText: "Click to log in",
    login: "Login",
  };
  const { setState } = props;
  const [emailTip, setEmailTip] = React.useState<string>('');
  const [errorMsg, setErrorMsg] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>();
  const [password, setPassword] = React.useState<string>();
  const emailLogin = () => {
    // alert(email);
    if (email && password) {
      loginWithEmail({
        email, password: 'fake password', md5_password: md5(password).toString(),
      }).then(
        data => {props.handleLoginResponse(data)}
      ).catch(
        error => {
          console.error("email login failed", error );
          
          setErrorMsg('Login Failed')
        }
      )

    }
  }
  const validateEmail = () => {
    const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email && emailReg.test(email)) {
      setEmailTip('');
      return true;
    }
    setEmail(undefined); setEmailTip('Email address format incorrect, please check.')
  }
  return (
    <View>
      <EmailBox
        onChangeText={(email: string) => setEmail(email.trim())}
        onEndEditing={validateEmail}
        placeholder={login.email}
      />
      <Text style={{ color: 'red' }}>{emailTip}</Text>
      <PasswordBox
        onChangeText={(password: string) => setPassword(password)}
        placeholder={login.password}
      />
      <TouchableHighlight onPress={emailLogin} >
        <ConfirmBox>
          <Title style={{ color: "red" }}>{login.login}</Title>
        </ConfirmBox>
      </TouchableHighlight>
      <Text style={{color: 'red'}}>{errorMsg}</Text>
      <View style={styles.loginOption}>
        <LoginOptionText onPress={() => setState('mobile')}>Login with Mobile</LoginOptionText>
        <Text> | </Text>
        <LoginOptionText onPress={() => setState('qr')}>Login wight QR</LoginOptionText>
      </View>
    </View>
  );
};
const LoginMobile = (props) => {
  const login = {
    mobile: "Mobile",
    password: "Password",
    loginText: "Click to log in",
    login: "Login",
  };
  const [phone, setPhone] = React.useState<string>();
  const [countrycode, setCountrycode] = React.useState<string | number>('');
  const [password, setPassword] = React.useState<string>();
  const [errorMsg, setErrorMsg] = React.useState<string>('');
  const { setState } = props;

  const handlePhoneLogic = (callingCode: string, number: string) => {
    setCountrycode(callingCode); 
    setPhone(number)
  }
  const mobileLogin = () => {
    // alert(email);
    if (phone && password) {
      loginWithPhone({
        countrycode, phone, password: 'fake password', md5_password: md5(password).toString(),
      }).then(
        data => {()=>props.handleLoginResponse(data)}
      ).catch(
        error => setErrorMsg('Login Failed')
      )

    }
  }

  return (
    <View>
      <MobileNumBox
        onChangeText={(callingCode: string, number: string)=>handlePhoneLogic(callingCode, number)}
        placeholder={login.mobile}
      />
      <PasswordBox
        onChangeText={(password: string) => setPassword(password)}
        placeholder={login.password}
      />
      <TouchableHighlight onPress={mobileLogin}>
        <ConfirmBox>
          <Title style={{ color: "red" }}>{login.login}</Title>
        </ConfirmBox>
      </TouchableHighlight>
      <Text style={{color: 'red'}}>{errorMsg}</Text>
      <View style={styles.loginOption}>
        <LoginOptionText onPress={() => setState('email')}>Login with Email</LoginOptionText>
        <Text> | </Text>
        <LoginOptionText onPress={() => setState('qr')}>Login wight QR</LoginOptionText>
      </View>
    </View>
  );
};
const LoginQR = (props) => {
  const { setState } = props;
  const [qrInformation, setQrInformation] = React.useState<string>("打开网易云音乐APP扫码登录");
  const [qrKey, setQrKey] = React.useState<string>();
  const [qrUrl, setQrUrl] = React.useState<string>();
  const qrStyle = {
    size: 192,
    margin: 0,
    color: '#335eea',
  }
  const loadQrCode = async () => {
    const key = await fetchLoginQrCodeKey().then(
      // result => result.data.unikey
      result => {
        console.log("login qr create", result);
        return result.data.unikey
      }
    );
    setQrKey(key);
    setQrUrl(`https://music.163.com/login?codekey=${key}`)
  }
  const checkQrCodeLogin = () => {
    if (!qrKey) {
      return;
    }
    checkLoginQrCodeStatus({key: qrKey}).then(
      (result: any) => {

        switch (result.code) {
          case 800:
            loadQrCode();
            setQrInformation('二维码已失效，请重新扫码');
            break;
          case 802:
            setQrInformation('扫描成功，请在手机上确认登录');
            break;
          case 801:
            setQrInformation('打开网易云音乐APP扫码登录');
            break;
          default:
            setQrInformation('Error encountered, please click to refresh')
            break;
        }
      }
    )
  }
  React.useEffect(() => {
    loadQrCode();
    const timer = setInterval(() => {
      checkQrCodeLogin();
    }, 1000);
    return () => { clearInterval(timer) }
  }, [])

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <TouchableHighlight onPress={loadQrCode}>
        <QrContainer>
          {qrUrl && <QRCode value={qrUrl} {...qrStyle} />}
        </QrContainer>
      </TouchableHighlight>
      <Text style={{ marginTop: 30 }}>QRCODE{qrInformation}</Text>
      <View style={styles.loginOption}>
        <LoginOptionText onPress={() => setState('email')}>Login with Email</LoginOptionText>
        <Text> | </Text>
        <LoginOptionText onPress={() => setState('mobile')} >Login wight Mobile</LoginOptionText>
      </View>
      <Button children="test" onPress={()=>isAccountLoggedIn()} />
    </View>
  );
}
export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();
  const [authentication, setAuthentication] = React.useState<'qr' | 'mobile' | 'email'>('qr');
  const handleLoginResponse = (data) => { 
    
    console.log("[handleLoginResponse] data code", data.code);
    if (!data) {
      return;
    }
    
    if (data.code === 200) {
      setCookies(data.cookie);
      
      
      console.log("fetching user pofile",);
      
      dispatch(fetchUserProfile()).then(
        ({ payload }) => {
          console.log('paylaod2', payload)
          dispatch(updateData({key: 'loginMode', value: 'account'}));
          console.log("currentData");
          
          dispatch(fetchLikedThings(payload))
          // navigation.navigate("Library");
        }
      )
      // this.$store.dispatch('fetchUserProfile').then(() => {
      //   this.$store.dispatch('fetchLikedPlaylist').then(() => {
      //     this.$router.push({ path: '/library' });
      //   });
      // });
    } else {
      alert(data.msg ?? data.message ?? '账号或密码错误，请检查');
    }
   };
  return (
    <AuthenticationMode.Provider value={authentication}>
      <View style={styles.centerStyle}>
        <Text>Login Screen</Text>
        <View style={[styles.horizontalStyle, { marginBottom: 30 }]}>
          <Image source={require("@/assets/logos/yesplaymusic.png")} style={styles.imageStyle} />
          <XSymbol />
          <Image source={require("@/assets/logos/netease-music.png")} style={styles.imageStyle}/>
        </View>
        <AuthenticationMode.Consumer>
          {(value: string) => {
            switch (value) {
              case "mobile":
                return <LoginMobile setState={setAuthentication} handleLoginResponse={handleLoginResponse} />;
              case "email":
                return <LoginEmail setState={setAuthentication} handleLoginResponse={handleLoginResponse} />;
              default:
                return <LoginQR setState={setAuthentication} handleLoginResponse={handleLoginResponse}/>;
            }
          }}
        </AuthenticationMode.Consumer>
      </View>
    </AuthenticationMode.Provider>
  );
}

const XSymbol = styled(X)`
  width: 30px;
  height: 30px;
  color: rgba(82, 82, 82, 0.28);
`;
const LoginBox = styled(View)`
  margin-top: 14px;
  margin-bottom: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eaeffd;
  border-radius: 20;
  height: 64px;
  width: 300px;
  padding-left: 22px;
  box-sizing: border-box;
`;

const InputBox = styled(View)`
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;
  align-items: center;
  height: 46px;
  background: #eaeffd;
  border-radius: 8;
  width: 300px;
  font-size: 20px;
  font-weight: 600;
  margin-top: 20px;
  padding: 20px;
`;
const ConfirmBox = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  background-color: #eaeffd;
  border-radius: 8;
  margin-top: 24px;
  padding: 8px;
  width: 100%;
  width: 300px;
`;
const Title = styled(Text)`
  font-size: 24px;
  font-weight: 600;
`;
const LoginOptionText = styled(Text)`
  margin-left: 10;
  margin-right: 10;
`
const styles = StyleSheet.create({
  horizontalStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  centerStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputFrameStyle: {
    backgroundColor: "transparent",
    marginLeft: 20,
    height: 32,
    borderWidth: 0,
    fontSize: 18,
    fontWeight: "400",
    paddingLeft: 2,
  },
  activeStyle: {
    color: "#eeeeee",
  },
  loginOption: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'center',
  },
  imageStyle: {
    width: 80, 
    height: 80,
    marginLeft: 10,
    marginRight: 10,
  }
});

