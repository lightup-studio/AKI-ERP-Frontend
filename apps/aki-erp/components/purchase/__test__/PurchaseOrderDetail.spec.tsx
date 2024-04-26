import { createTestWrapper } from '@test-utils/index';
import { render, screen, waitFor } from '@testing-library/react';
import * as NextNavigation from 'next/navigation';
import { act } from 'react-dom/test-utils';
import PurchaseOrderDetail from '../PurchaseOrderDetail';

const { wrapper } = createTestWrapper();

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useParams: jest.fn().mockReturnValue({ id: '1' }),
  useSearchParams: jest
    .fn()
    .mockReturnValue(new URLSearchParams() as NextNavigation.ReadonlyURLSearchParams),
}));

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn().mockReturnValue({
    data: {
      salesCompany: 'test sales company',
      salesInformation: {
        name: 'test sales name',
        phone: '09123456789',
        address: 'test sales addresss',
      },
      receiverInformation: {
        name: 'test receiver name',
        phone: '09123456789',
        address: 'test receiver addresss',
      },
    },
  }),
}));

describe('Purchase order', () => {
  it('should render the form with all fields and labels', async () => {
    render(await act(() => <PurchaseOrderDetail />), { wrapper });

    const labels = screen.getAllByRole('label');
    expect(labels).toHaveLength(6);

    await waitFor(async () => expect(await screen.findByText('進貨單位')).toBeInTheDocument());
    await waitFor(async () => expect(await screen.findByText('進貨日期')).toBeInTheDocument());
    await waitFor(async () => expect(await screen.findByText('聯絡人')).toBeInTheDocument());
    await waitFor(async () => expect(await screen.findByText('聯絡人電話')).toBeInTheDocument());
    await waitFor(async () => expect(await screen.findByText('備註')).toBeInTheDocument());
    await waitFor(async () => expect(await screen.findByText('承運人')).toBeInTheDocument());
  });

  it('should render data', async () => {
    render(await act(() => <PurchaseOrderDetail />), { wrapper });

    await waitFor(() =>
      expect(screen.getByLabelText('聯絡人').closest('input')?.value).toBe('test sales name'),
    );

    await waitFor(() =>
      expect(screen.getByLabelText('聯絡人電話').closest('input')?.value).toBe('09123456789'),
    );

    await waitFor(() =>
      expect(screen.getByLabelText('進貨單位').closest('input')?.value).toBe('test sales company'),
    );
  });
});
