import React from 'react';
import { useParams } from 'react-router-dom';

function ArtworksDetail() {
  const params = useParams();
  console.log('params', params);
  return <div>ArtworksDetail </div>;
}

export default ArtworksDetail;
