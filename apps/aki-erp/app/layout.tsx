import { Container } from '@components/shared/layout';
import './global.css';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <Container>{children}</Container>
      </body>
    </html>
  );
};

export default RootLayout;
