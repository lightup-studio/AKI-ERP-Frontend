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
  telephone: yup.string(),
  metadata: yup.object().shape({
    email: yup.string().email('Email 格式錯誤'),
  }),
});
