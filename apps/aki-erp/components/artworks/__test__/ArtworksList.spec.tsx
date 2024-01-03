import MockAdapter from 'axios-mock-adapter';
import * as NextNavigation from 'next/navigation';
import { createTestWrapper } from 'test-utils/index';

import axios from '@contexts/axios';
import { fireEvent, render, screen } from '@testing-library/react';

import ArtworksList from '../ArtworksList';
import { artworksApiResponseMock } from './mocks/artworks.mock';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useSearchParams: jest
    .fn()
    .mockReturnValue(new URLSearchParams() as NextNavigation.ReadonlyURLSearchParams),
}));

const { mockRouter, wrapper } = createTestWrapper();

describe('ArtworksList', () => {
  let mock: MockAdapter;
  let routerPushSpy: jest.SpyInstance;

  beforeAll(() => {
    mock = new MockAdapter(axios);
    routerPushSpy = jest.spyOn(mockRouter, 'push');
  });

  beforeEach(() => {
    mock.onGet(`/api/Countries`).reply(200, []);
    mock.onGet(`/api/Artworks/autoComplete/artist`).reply(200, []);
    mock.onGet(`/api/Artworks/autoComplete/metadata/serialNumber`).reply(200, []);
    mock.onGet(`/api/Artworks/autoComplete/metadata/media`).reply(200, []);
    mock.onGet(`/api/Artworks/autoComplete/metadata/agentGalleries`).reply(200, []);
    mock.onGet(`/api/artworks/query`).reply(200, artworksApiResponseMock);
  });

  afterEach(() => {
    mock.reset();
    routerPushSpy.mockClear();
  });

  afterAll(() => {
    mock.restore();
    routerPushSpy.mockRestore();
  });

  // Allows user to click on artwork number to navigate to artwork detail page
  it('should navigate to artwork detail page when user clicks on artwork number', async () => {
    // Arrange
    render(<ArtworksList type="inventory" />, {
      wrapper: wrapper,
    });

    const firstArtworkDisplayId = artworksApiResponseMock.data[0].displayId;
    const firstArtworkLink = await screen.findByRole('link', {
      name: `${firstArtworkDisplayId}`,
    });
    expect(firstArtworkLink).not.toBeNull();

    // When the user clicks the combobox for "Other Information," we trigger a click event to show additional options.
    fireEvent.click(screen.getByPlaceholderText('其他資訊'));
    // Locate the "Framed" option within the menu and click it, which will trigger the corresponding action.
    fireEvent.click((await screen.findByText('裱框')).parentElement!);
    // We expect a route navigation to be triggered, with the query parameter "otherInfos=framed" appended.
    expect(routerPushSpy).toHaveBeenCalledTimes(1);
    expect(routerPushSpy).toHaveBeenLastCalledWith(expect.stringContaining('otherInfos=framed'));

    fireEvent.click(firstArtworkLink);
    expect(routerPushSpy).toHaveBeenCalledTimes(2);
  });
});
