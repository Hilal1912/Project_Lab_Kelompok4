import React from 'react';
import { ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenWrapperProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  className = '',
  style,
  ...props
}) => {
  return (
    <SafeAreaView
      style={style}
      className={`flex-1 bg-orange-50 ${className}`}
      {...props}
    >
      {children}
    </SafeAreaView>
  );
};

export default ScreenWrapper;
