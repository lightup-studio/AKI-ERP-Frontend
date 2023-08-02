import React from 'react';

import NextImage, { ImageProps as NextImageProps } from 'next/image';

interface ImageProps extends Omit<NextImageProps, 'width' | 'height'> {
  width: string;
  height: string;
}

const Image: React.FC<ImageProps> = ({ width, height, ...prosp }) => {
  return (
    <section className="relative" style={{ width, height }}>
      <NextImage fill {...prosp} />
    </section>
  );
};

export default Image;
