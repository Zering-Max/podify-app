import AvatarField from '@ui/AvatarField';
import colors from '@utils/colors';
import React from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import {PublicProfile} from 'src/@types/user';
import {useFetchIsFollowing} from 'src/hooks/query';
import {getClient} from 'src/api/client';
import catchAsyncError from 'src/api/catchError';
import {useDispatch, useSelector} from 'react-redux';
import {updateNotification} from 'src/store/notification';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {getAuthState, updateProfile} from 'src/store/auth';

interface Props {
  profile?: PublicProfile;
}

const PublicProfileContainer: React.FC<Props> = ({profile}) => {
  const {data: isFollowing} = useFetchIsFollowing(profile?.id || '');
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const myProfile = useSelector(getAuthState).profile;

  const toggleFollowing = async (id: string) => {
    try {
      if (!id) {
        return;
      }
      const client = await getClient();
      await client.post(`/profile/update-follower/${id}`);
      //relance une query pour update le nb de followers/followings du user private
      queryClient.invalidateQueries({queryKey: ['profile', id]});
      if (myProfile) {
        const {data} = await client.get('/profile/followings');
        dispatch(
          updateProfile({...myProfile, followings: data.followings.length}),
        );
      }
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    }
  };
  const followingMutation = useMutation({
    mutationFn: async id => toggleFollowing(id),
    onMutate: (id: string) => {
      queryClient.setQueryData<boolean>(
        ['is-following', id],
        oldData => !oldData,
      );
    },
  });

  if (!profile) {
    return null;
  }

  return (
    <View style={styles.container}>
      <AvatarField source={profile.avatar} />
      <View style={styles.profileInfoConatiner}>
        <Text style={styles.profileName}>{profile.name}</Text>
        <View style={styles.flexRow}>
          <Text style={styles.followerText}>{profile.followers} Followers</Text>
        </View>
        <Pressable
          onPress={() => followingMutation.mutate(profile.id)}
          style={styles.flexRow}>
          <Text style={styles.profileActionLink}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfoConatiner: {
    paddingLeft: 10,
  },
  profileName: {
    color: colors.CONTRAST,
    fontSize: 18,
    fontWeight: '700',
  },
  email: {
    color: colors.CONTRAST,
    marginRight: 5,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileActionLink: {
    backgroundColor: colors.SECONDARY,
    borderRadius: 7,
    color: colors.PRIMARY,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginTop: 5,
  },
  followerText: {
    color: colors.CONTRAST,
    paddingVertical: 2,
    marginTop: 5,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PublicProfileContainer;
