import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { useTheme, Text, Divider, Avatar } from 'react-native-paper';
import makeStyles from './styles';
import Icon from '../../components/Icon';

const CategoriesScreen = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const assistants = [
    {
      name: 'Writing',
      list: [
        {
          id: 1,
          icon: 'academicWriting',
          name: 'Academic Writer',
          description: 'Research and academic topics assistance',
        },
        {
          id: 2,
          icon: 'academicWriting',
          name: 'Social Content',
          description: 'Write engaging social media content',
        },
        {
          id: 3,
          icon: 'academicWriting',
          name: 'Email',
          description: 'Write and response to emails',
        },
        {
          id: 4,
          icon: 'academicWriting',
          name: 'Story Telling',
          description: 'Craft engaging and captivating narratives',
        },
        {
          id: 5,
          icon: 'academicWriting',
          name: 'Poem',
          description: 'Compose inspiring poems',
        },
      ],
    },
    {
      name: 'Business',
      list: [
        {
          id: 6,
          icon: 'academicWriting',
          name: 'Business Plan',
          description: 'Strategize your business roadmap',
        },
        {
          id: 7,
          icon: 'academicWriting',
          name: 'Compatitor Analysis',
          description: 'Research insights on competitors strategies',
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={assistants}
        renderItem={({ item }) => (
          <View key={item?.name}>
            <Text variant="titleMedium" style={{ marginHorizontal: 16 }}>
              {item.name}
            </Text>
            <FlatList
              data={item.list}
              style={{ marginTop: 16, paddingHorizontal: 16 }}
              renderItem={({ item }) => {
                console.debug('item', item);
                return (
                  <TouchableOpacity
                    key={item?.id}
                    style={{ marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => null}>
                    <View
                      style={{
                        borderRadius: 50,
                        backgroundColor: theme.colors.backdrop,
                        width: 70,
                        height: 70,
                        marginEnd: 16,
                      }}>
                      {/* <Icon name={item.icon} size={20} iconStyle={{ color: theme.dark ? 'white' : 'black' }} /> */}
                    </View>

                    <View>
                      <Text style={{ marginBottom: 6 }} variant="titleMedium">
                        {item.name}
                      </Text>
                      <Text variant="labelSmall">{item.description}</Text>
                    </View>

                    <Divider style={{ marginTop: 16 }} />
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}
      />
    </View>
  );
};

export default CategoriesScreen;
