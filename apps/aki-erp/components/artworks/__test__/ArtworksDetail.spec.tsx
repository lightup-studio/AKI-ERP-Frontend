import MockAdapter from 'axios-mock-adapter';
import { useParams } from 'next/navigation';

import axios from '@contexts/axios';
import { createTestWrapper } from '@test-utils/index';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ArtworksDetail from '../ArtworksDetail';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useParams: jest.fn(),
}));

const { mockRouter, wrapper } = createTestWrapper();

describe('Creating a new Artwork via ArtworksDetail', () => {
  beforeEach(() => {
    jest.mocked(useParams).mockReturnValue({ id: '' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // The form is rendered correctly with all the necessary fields and labels.
  it('should render the form with all fields and labels', () => {
    render(<ArtworksDetail />, {
      wrapper,
    });

    const labels = screen.getAllByRole('label');
    expect(labels).toHaveLength(11);

    expect(screen.getByText('作品圖片')).toBeInTheDocument();
    expect(screen.getByText('藝術家')).toBeInTheDocument();
    expect(screen.getByText('資產類別')).toBeInTheDocument();
    expect(screen.getByText('作品類型')).toBeInTheDocument();
    expect(screen.getByText('代理藝廊')).toBeInTheDocument();
    expect(screen.getByText('國籍')).toBeInTheDocument();
    expect(screen.getByText('進貨單位')).toBeInTheDocument();
    expect(screen.getByText('作品名稱')).toBeInTheDocument();
    expect(screen.getByText('尺寸')).toBeInTheDocument();
    expect(screen.getByText('媒材')).toBeInTheDocument();
    expect(screen.getByText('年代')).toBeInTheDocument();
    expect(screen.getByText('版次 ed.')).toBeInTheDocument();
    expect(screen.getByText('其他資訊')).toBeInTheDocument();
    expect(screen.getByText('庫存狀態')).toBeInTheDocument();
  });

  // User can select the asset type from a dropdown menu.
  it('should allow user to select asset type from dropdown menu', async () => {
    render(<ArtworksDetail />, {
      wrapper,
    });
    const selectedValue = 'B';
    userEvent.selectOptions(screen.getByTestId('assetsType'), selectedValue);

    const selectOptionElement = screen.getByTestId(
      `assetsType__option-${selectedValue}`,
    ) as HTMLOptionElement;

    waitFor(() => {
      expect(selectOptionElement.selected).toBe(true);
    });
  });
});

describe('Editing an existing Artwork via ArtworksDetail', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
    jest.mocked(useParams).mockReturnValue({ id: '1' });
    mock.onGet(`/api/Artworks/DID:1`).reply(200, {
      id: 1,
      name: 'test',
      assetsType: 'A',
      artist: 'test',
      metadata: {
        agentGallery: 'test',
        country: 'test',
        unit: 'test',
        size: 'test',
        name: 'test',
        material: 'test',
        year: 'test',
        edition: 'test',
        otherInfo: 'test',
        status: 'test',
        inventoryStatus: 'test',
        purchasingUnit: 'test',
        serialNumber: 'test',
        purchaseDate: 'test',
        purchasePrice: 'test',
        note: 'test',
        location: 'test',
        locationNote: 'test',
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the form with all fields and labels', async () => {
    render(<ArtworksDetail />, {
      wrapper,
    });

    const labels = await screen.findAllByRole('label');
    expect(labels).toHaveLength(11);

    expect(screen.getByText('作品圖片')).toBeInTheDocument();
    expect(screen.getByText('藝術家')).toBeInTheDocument();
    expect(screen.getByText('資產類別')).toBeInTheDocument();
    expect(screen.getByText('作品類型')).toBeInTheDocument();
    expect(screen.getByText('代理藝廊')).toBeInTheDocument();
    expect(screen.getByText('國籍')).toBeInTheDocument();
    expect(screen.getByText('進貨單位')).toBeInTheDocument();
    expect(screen.getByText('作品名稱')).toBeInTheDocument();
    expect(screen.getByText('尺寸')).toBeInTheDocument();
    expect(screen.getByText('媒材')).toBeInTheDocument();
    expect(screen.getByText('年代')).toBeInTheDocument();
    expect(screen.getByText('版次 ed.')).toBeInTheDocument();
    expect(screen.getByText('其他資訊')).toBeInTheDocument();
    expect(screen.getByText('庫存狀態')).toBeInTheDocument();
  });
});
