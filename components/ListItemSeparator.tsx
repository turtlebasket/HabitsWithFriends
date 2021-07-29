import React from 'react';
import { View } from 'react-native';
import { AppTheme } from '../style/themes';

const ListItemSeparator = () => (
  <View style={{
    backgroundColor: AppTheme.colors.border,
    height: 1,
    width: '90%',
    alignSelf: 'center'
  }}/>
)

export default ListItemSeparator;