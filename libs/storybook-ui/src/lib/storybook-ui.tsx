import styles from './storybook-ui.module.scss';

/* eslint-disable-next-line */
export interface StorybookUiProps {}

export function StorybookUi(props: StorybookUiProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to StorybookUi!</h1>
    </div>
  );
}

export default StorybookUi;
