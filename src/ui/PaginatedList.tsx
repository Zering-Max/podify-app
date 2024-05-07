import colors from '@utils/colors';
import React = require('react');
import {FlatList, FlatListProps, RefreshControl, Text} from 'react-native';
import PulseAnimationContainer from './PulseAnimationContainer';

interface Props<T> {
  onEndReached?: FlatListProps<T>['onEndReached'];
  isFetching?: boolean;
  refreshing?: boolean;
  hasMore?: boolean;
  data: FlatListProps<T>['data'];
  ListEmptyComponent?: FlatListProps<T>['ListEmptyComponent'];
  renderItem: FlatListProps<T>['renderItem'];
  onRefresh?(): void;
}

const PaginatedList = <T extends any>(props: Props<T>) => {
  const {
    onEndReached,
    isFetching,
    refreshing = false,
    renderItem,
    ListEmptyComponent,
    onRefresh,
    hasMore,
    data,
  } = props;
  return (
    <FlatList
      onEndReached={info => {
        if (!hasMore || isFetching) {
          return;
        }
        onEndReached && onEndReached(info);
      }}
      ListFooterComponent={<Footer visible={isFetching} />}
      data={data}
      ListEmptyComponent={ListEmptyComponent}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.CONTRAST}
        />
      }
    />
  );
};

const Footer = (props: {visible?: boolean}) => {
  if (!props.visible) {
    return null;
  }
  return (
    <PulseAnimationContainer>
      <Text
        style={{
          textAlign: 'center',
          color: colors.CONTRAST,
          padding: 5,
        }}>
        Please wait...
      </Text>
    </PulseAnimationContainer>
  );
};

export default PaginatedList;
