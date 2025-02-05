import { VariantProps, cva } from 'class-variance-authority';
import { cssInterop } from 'nativewind';
import * as React from 'react';
import { UITextView } from 'react-native-uitextview';
import { TextProps as RNTextProps, TextStyle } from 'react-native';

import { cn } from '~/lib/cn';

cssInterop(UITextView, { className: 'style' });

const textVariants = cva('text-foreground', {
  variants: {
    variant: {
      largeTitle: 'text-4xl',
      title1: 'text-2xl',
      title2: 'text-[22px] leading-7',
      title3: 'text-xl',
      heading: 'text-[17px] leading-6 font-semibold',
      body: 'text-[17px] leading-6',
      callout: 'text-base',
      subhead: 'text-[15px] leading-6',
      footnote: 'text-[13px] leading-5',
      caption1: 'text-xs',
      caption2: 'text-[11px] leading-4',
    },
    color: {
      primary: '',
      secondary: 'text-secondary-foreground/90',
      tertiary: 'text-muted-foreground/90',
      quarternary: 'text-muted-foreground/50',
    },
  },
  defaultVariants: {
    variant: 'body',
    color: 'primary',
  },
});

const TextClassContext = React.createContext<string | undefined>(undefined);

// Comprehensive type definition
type TextProps = Omit<RNTextProps, 'style'> &
  VariantProps<typeof textVariants> & {
    children?: React.ReactNode;
    uiTextView?: boolean;
    style?: TextStyle | TextStyle[];
    className?: string;
  };

function Text({ className, variant, color, children, style, ...props }: TextProps) {
  const textClassName = React.useContext(TextClassContext);

  // Determine which component to use based on uiTextView prop
  const Component = props.uiTextView === false ? require('react-native').Text : UITextView;

  // Merge variant classes with custom className
  const combinedClassName = cn(textVariants({ variant, color }), textClassName, className);

  return (
    <Component className={combinedClassName} style={style} {...props}>
      {children}
    </Component>
  );
}

export { Text, TextClassContext, textVariants };
