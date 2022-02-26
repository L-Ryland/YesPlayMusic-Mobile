import React from "react";
import {
  TouchableHighlight,
  StyleSheet,
  TextInput as DefaultTextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import PhoneInput from "react-native-phone-number-input";
import styled, { ThemeContext } from "styled-components/native";
import { View, Text, TextInput, Button } from "@/components";
import { X, Mail, Lock } from "@/components/icons";
import countryCodes from "@/countries-emoji.json";

function EmailBox({ onChangeText, placeholder }) {
  const [activeColor, setActiveColor] = React.useState("black");
  return (
    <InputBox>
      <Mail height={20} width={20} color={activeColor} />
      <TextInput
        placeholder={placeholder}
        onChangeText={onChangeText}
        onFocus={() => setActiveColor("#2f95dc")}
        onBlur={() => setActiveColor("black")}
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
  const [value, setValue] = React.useState("");
  const [formattedValue, setFormattedValue] = React.useState("");
  const [valid, setValid] = React.useState(false);
  const [showMessage, setShowMessage] = React.useState(false);
  const phoneInput = React.useRef<PhoneInput>(null);
  console.log("country codes", Object.keys(countryCodes));
  
  return (
    <InputBox>
      <Mail height={20} width={20} color="black" />
      {/* <PhoneInput
        ref={phoneInput}
        defaultValue={value}
        defaultCode="CN"
        layout="second"
        onChangeText={(text) => {
          setValue(text);
        }}
        onChangeFormattedText={(text) => {
          setFormattedValue(text);
        }}
        withDarkTheme
        withShadow
        textInputStyle={styles.inputFrameStyle}
      /> */}
      <Picker
        selectedValue={selectedCallingCode}
        onValueChange={(itemValue, itemIndex) => setSelectedCallingCode(itemValue)}
        style={styles.inputFrameStyle}
      >
        {Object.keys(countryCodes).map((code) => 
          <Picker.Item key={code} label={"+"+countryCodes[code].callingCode} value={countryCodes[code].callingCode} />
        )}
      </Picker>
      <TextInput
        onFocus={() => setActiveColor("#2f95dc")}
        onBlur={() => setActiveColor("black")}
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
const LoginEmail: React.FC = () => {
  const login = {
    email: "Email",
    password: "Password",
    loginText: "Click to log in",
    login: "Login",
  };
  const [email, setEmail] = React.useState<string>();
  const [password, setPassword] = React.useState<string>();

  return (
    <View>
      <EmailBox
        onChangeText={(email: string) => setEmail(email)}
        placeholder={login.email}
      />
      <PasswordBox
        onChangeText={(password: string) => setPassword(password)}
        placeholder={login.password}
      />
      <TouchableHighlight>
        <ConfirmBox>
          <Title style={{ color: "red" }}>{login.login}</Title>
        </ConfirmBox>
      </TouchableHighlight>
    </View>
  );
};
const LoginMobile: React.FC = () => {
  const login = {
    mobile: "Mobile",
    password: "Password",
    loginText: "Click to log in",
    login: "Login",
  };
  const [mobile, setMobile] = React.useState<number>();
  const [password, setPassword] = React.useState<string>();
  const handleEmailText = () => {};
  const handlePasswordText = () => {};

  return (
    <View>
      <MobileNumBox
        onChangeText={(mobile: number) => setMobile(mobile)}
        placeholder={login.mobile}
      />
      <PasswordBox
        onChangeText={(password: string) => setPassword(password)}
        placeholder={login.password}
      />
      <TouchableHighlight>
        <ConfirmBox>
          <Title style={{ color: "red" }}>{login.login}</Title>
        </ConfirmBox>
      </TouchableHighlight>
    </View>
  );
};
export default function LoginScreen() {
  const handleLogin = () => {};

  return (
    <View style={styles.centerStyle}>
      <Text>Login Screen</Text>
      <View style={styles.horizontalStyle}>
        <Image source={require("@/assets/logos/yesplaymusic.png")} />
        <XSymbol />
        <Image source={require("@/assets/logos/netease-music.png")} />
      </View>
      <LoginMobile />
    </View>
  );
}
const Image = styled.Image`
  width: 100px;
  height: 100px;
`;
const XSymbol = styled(X)`
  width: 30px;
  height: 30px;
  color: rgba(82, 82, 82, 0.28);
`;
const LoginBox = styled(View)`
  cursor: pointer;
  margin-top: 14px;
  margin-bottom: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eaeffd;
  border-radius: 20px;
  height: 64px;
  width: 300px;
  padding-left: 22px;
  box-sizing: border-box;
`;

const InputBox = styled.View`
  display: flex;
  flex-direction: row;
  // justify-content: flex-end;
  margin-bottom: 16px;
  color: var(--color-text);
  align-items: center;
  height: 46px;
  background: #eaeffd;
  border-radius: 8px;
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
  color: var(--color-primary);
  border-radius: 8px;
  margin-top: 24px;
  padding: 8px;
  width: 100%;
  width: 300px;
`;
const Title = styled(Text)`
  font-size: 24px;
  font-weight: 600;
`;
const styles = StyleSheet.create({
  horizontalStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "20px",
  },
  centerStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputFrameStyle: {
    backgroundColor: "transparent",
    marginLeft: "20px",
    width: "inherit",
    height: "32px",
    borderWidth: 0,
    fontSize: 18,
    fontWeight: "400",
    paddingLeft: "2px",
  },
  activeStyle: {
    color: "#eeeeee",
  },
});
