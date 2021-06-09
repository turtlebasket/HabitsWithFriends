import React from 'react';
import { Text } from 'react-native';
import { Avatar, Card, Title } from 'react-native-paper';
import { Icon } from 'react-native-paper/lib/typescript/components/Avatar/Avatar';
import styles from '../style/styles';

export default function Activity() {
  return (
    <Title>Activity!</Title>
  );
}

const ActivityCard = (props: {
  title: string,
  timestamp: string,
  pfpUri: string
}) => {
  const { title, timestamp } = props;
  return (
    <Card style={styles.card}>
      <Card.Title title={title} left={()=>(<Avatar.Icon icon="account"/>)} />
    </Card>
  );
}