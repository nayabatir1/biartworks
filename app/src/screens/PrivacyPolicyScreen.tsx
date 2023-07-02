import { StyleSheet } from 'react-native';
import React from 'react';
import { ScreenProps } from '@utils/navigation';
import { useTheme } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import type { ExtendedTheme } from '@types';
import ScrollLayout from '@components/layout/ScrollLayout';
import Typography from '@components/shared/Typography';

export type TPrivacyPolicySection = 'TERMS' | 'PRIVACY' | 'FAQ' | 'ABOUT';

const PrivacyPolicy: React.FC<ScreenProps<'PrivacyPolicy'>> = ({ navigation }) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const scrollRef = React.useRef<KeyboardAwareScrollView>(null);

  return (
    <ScrollLayout containerStyle={styles.container} ref={scrollRef}>
      <Icon name="chevron-left" size={24} style={styles.back} onPress={() => navigation.goBack()} />
      <Typography color="primary" weight="bold" mb={22}>
        Terms of Service
      </Typography>
      <Typography size={13} weight="bold" mb={8}>
        It is a long established fact that a reader will be distracted by the readable content of a
        page when There are many variations of passages of Lorem Ipsum available, but the majority
        have suffered alteration in some form, by injected humour.
      </Typography>

      <Typography size={14} mb={40}>
        It is a long established fact that a reader will be distracted by the readable content of a
        page when There are many variations of passages of Lorem Ipsum available, but the majority
        have suffered alteration in some form, by injected humour, of randomised words which don't
        look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to
        be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum
        generators on the Internet tend to repeat predefined chunks as necessary, making this the
        first true generator on the Internet It uses a dictionary of over 200 Latin words, combined
        with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable.
        The generated Lorem Ipsum is therefore always free from repetition, injected humour, or
        non-characteristic words etc. {`\n\n\n`}It is a long established fact that a reader will be
        distracted by the readable content of a page when looking at its layout. The point of using
        Lorem Ipsum is that it has a more-or-less normal distribution of letters.
      </Typography>
    </ScrollLayout>
  );
};

export default PrivacyPolicy;

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      padding: theme.spacing.lg,
    },
    heading: {
      backgroundColor: theme.colors.white,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
    },
    back: {
      marginVertical: 15,
    },
  });
