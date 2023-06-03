import React from 'react';

import { Link, useSearchParams } from 'react-router-dom';

export type ArtworksTitleProps = {
  id?: string;
  type?: 'inventory' | 'draft';
};

const typeToPathAndText = {
  inventory: { path: '/app/inventory-artworks', text: '庫存' },
  draft: { path: '/app/draft-artworks', text: '草稿' },
  default: { path: '/app/artworks', text: '非庫存' },
};

function ArtworksTitle({ id, type }: ArtworksTitleProps) {
  const [searchParams] = useSearchParams();
  const { path, text } = typeToPathAndText[type || 'default'];
  const linkPath = `${path}${searchParams ? '?' + searchParams : ''}`;

  const ArtworksLink = id ? (
    <Link className="link link-hover" to={linkPath}>
      {text}
    </Link>
  ) : (
    <span>{text}</span>
  );

  return (
    <>
      藝術作品 / {ArtworksLink} {id && `/ ${id}`}
    </>
  );
}

export default ArtworksTitle;
