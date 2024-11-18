import React from 'react';
import { View, TextInput, useColorScheme } from 'react-native';
import { cn } from '~/lib/cn';

type inputProps = {
  containerStyle?: string;
  icon?: React.ReactNode;
  inputRef?: React.RefObject<TextInput>;
  placeholder?: string;
  onChangeText?: (value: string) => void;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  value?: string;
};

const Input: React.FC<inputProps> = (props) => {
  const colorScheme = useColorScheme();
  const isDarkColorScheme = colorScheme === 'dark';

  return (
    <View
      className={cn(
        `h-12 flex-row items-center gap-2 rounded-md border border-gray-400 px-4 ${props.containerStyle}`
      )}>
      {props.icon && props.icon}
      <TextInput
        style={{ flex: 1, color: isDarkColorScheme ? 'white' : 'black' }}
        placeholderTextColor={isDarkColorScheme ? 'white' : 'black'}
        ref={props.inputRef}
        value={props.value}
        multiline={props.multiline}
        numberOfLines={props.numberOfLines}
        {...props}
      />
    </View>
  );
};

export default Input;
