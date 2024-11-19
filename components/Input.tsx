import React, { forwardRef } from 'react';
import { View, TextInput, useColorScheme } from 'react-native';
import { cn } from '~/lib/cn';

type InputProps = {
  containerStyle?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  placeholder?: string;
  onChangeText?: (value: string) => void;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  value?: string;
  // Add optional onBlur prop
  onBlur?: () => void;
};

const Input = forwardRef<TextInput, InputProps>((props, ref) => {
  const colorScheme = useColorScheme();
  const isDarkColorScheme = colorScheme === 'dark';

  const { containerStyle, icon, rightIcon, onBlur, ...inputProps } = props;

  return (
    <View
      className={cn(
        `h-12 flex-row items-center gap-2 rounded-md border border-gray-400 px-4 ${containerStyle}`
      )}>
      {icon && icon}
      <TextInput
        ref={ref}
        style={{
          flex: 1,
          color: isDarkColorScheme ? 'white' : 'black',
          fontFamily: 'Inter_400Regular',
        }}
        placeholderTextColor={isDarkColorScheme ? 'white' : 'black'}
        onBlur={onBlur}
        {...inputProps}
      />
      {rightIcon && rightIcon}
    </View>
  );
});

Input.displayName = 'Input';

export default Input;
