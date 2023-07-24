import * as yup from 'yup';

export const formSchema = yup.object().shape({
  zhName: yup
    .string()
    .test('at-least-one-name', '請至少填寫中文姓名或英文姓名其一', function (value) {
      const { enName } = this.parent;
      return !!value?.trim() || !!enName?.trim();
    }),
  enName: yup
    .string()
    .test('at-least-one-name', '請至少填寫中文姓名或英文姓名其一', function (value) {
      const { zhName } = this.parent;
      return !!value?.trim() || !!zhName?.trim();
    }),
  telephone: yup
    .string()
    .required('電話必填')
    .matches(/^[0-9()-\s]+$/, '不能輸入奇怪的字元'),
  address: yup.string().required('地址必填'),
  metadata: yup.object().shape({
    email: yup.string().email('Email 格式錯誤').required('Email 必填'),
  }),
});
