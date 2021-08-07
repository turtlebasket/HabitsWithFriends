import { DefaultTheme as PaperDefaultTheme, DarkTheme as PaperDarkTheme } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import merge from 'deepmerge';

export const AppDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme)
export const AppDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme)

export const AppTheme = {
  // ...AppDefaultTheme,
  ...AppDarkTheme,
  dark: true,
  colors: {
    ...AppDarkTheme.colors,
  }
}