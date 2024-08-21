import { TextInput } from "react-native";
import React from "react";

interface IInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}
const Input = ({ placeholder, value, onChangeText }: IInputProps) => {
  return (
    <TextInput
      className="bg-neutral-200 p-3 rounded-full"
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
    />
  );
};

export default Input;
