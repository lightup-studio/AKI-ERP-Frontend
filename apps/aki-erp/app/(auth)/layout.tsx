import { Container } from '@components/shared/layout';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <Container>{children}</Container>;
};

export default AuthLayout;
