import Toast from 'react-native-toast-message';
import { ApiResponseError } from '@api/http';
import { API_URL } from 'react-native-dotenv';

export const onAPIError = (err: ApiResponseError) => {
  Toast.show({
    type: 'error',
    text1: 'Oops',
    text2: err.message,
  });
};
export const fetchFile = (key: string) => `${API_URL}/file/${key}`;
