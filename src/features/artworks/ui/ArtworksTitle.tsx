import React from 'react';

import { Link, useSearchParams } from 'react-router-dom';

export type ArtworksTitleProps = {
  id?: string;
  type?: 'inventory' | 'draft';
  pageType?: 'list' | 'detail';
};

const typeToPathAndText = {
  inventory: { path: '/app/inventory-artworks', text: '庫存' },
  draft: { path: '/app/draft-artworks', text: '草稿' },
  default: { path: '/app/artworks', text: '非庫存' },
};

function ArtworksTitle({ id, type, pageType = 'list' }: ArtworksTitleProps) {
  const [searchParams] = useSearchParams();
  const { path, text } = typeToPathAndText[type || 'default'];
  const linkPath = `${path}${searchParams ? '?' + searchParams : ''}`;

  const ArtworksLink =
    pageType === 'detail' ? (
      <Link className="link link-hover" to={linkPath}>
        {text}
      </Link>
    ) : (
      <span>{text}</span>
    );

  return (
    <>
      藝術作品 / {ArtworksLink}{' '}
      {pageType === 'detail' && (id ? `/ ${id}` : '/ 新增')}
    </>
  );
}

export default ArtworksTitle;
