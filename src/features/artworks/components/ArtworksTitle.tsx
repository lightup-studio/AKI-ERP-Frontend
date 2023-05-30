import React from 'react';

import { Link, useParams, useSearchParams } from 'react-router-dom';

export type ArtworksTitleProps = {
  type?: 'inventory' | 'draft';
};

function ArtworksTitle({ type }: ArtworksTitleProps) {
  const params = useParams();
  const [searchParams] = useSearchParams();

  const ArtworksLink = () => {
    switch (type) {
      case 'inventory':
        return (
          <Link
            to={
              '/app/inventory-artworks' + searchParams ? '?' + searchParams : ''
            }
          >
            庫存
          </Link>
        );
      case 'draft':
        return (
          <Link
            to={'/app/draft-artworks' + searchParams ? '?' + searchParams : ''}
          >
            草稿
          </Link>
        );
      default:
        return (
          <Link to={'/app/artworks' + searchParams ? '?' + searchParams : ''}>
            非庫存
          </Link>
        );
    }
  };

  if (!params.artworksId) {
    return (
      <>
        藝術作品 / <ArtworksLink></ArtworksLink>
      </>
    );
  }

  return (
    <>
      藝術作品 / <ArtworksLink></ArtworksLink> / {params.artworksId}
    </>
  );
}

export default ArtworksTitle;
