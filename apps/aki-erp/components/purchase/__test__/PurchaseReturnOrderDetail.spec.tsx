import { createTestWrapper } from '@test-utils/index';
import { render, screen } from '@testing-library/react';
import * as NextNavigation from 'next/navigation';
import PurchaseReturnOrderDetail from '../PurchaseReturnOrderDetail';

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
      returnCompany: 'test return company',
      returnerInformation: {
        name: 'test return name',
        phone: '09123456789',
        address: 'test return addresss',
      },
      contactPersonInformation: {
        name: 'test contact name',
        phone: '09123456789',
        address: 'test contact addresss',
      },
    },
  }),
}));

describe('Purchase return order', () => {
  beforeEach(() => {
    render(<PurchaseReturnOrderDetail />, { wrapper });
  });

  it('should render the form with all fields and labels', () => {
    const labels = screen.getAllByRole('label');
    expect(labels).toHaveLength(7);

    expect(screen.getByText('進貨退還單位')).toBeInTheDocument();
    expect(screen.getByText('退還日期')).toBeInTheDocument();
    expect(screen.getByText('聯絡人')).toBeInTheDocument();
    expect(screen.getByText('聯絡人電話')).toBeInTheDocument();
    expect(screen.getByText('收件人')).toBeInTheDocument();
    expect(screen.getByText('收件人電話')).toBeInTheDocument();
    expect(screen.getByText('地址')).toBeInTheDocument();
  });

  it('should render data', () => {
    expect(screen.getByLabelText('聯絡人').closest('input')?.value).toBe('test contact name');
    expect(screen.getByLabelText('聯絡人電話').closest('input')?.value).toBe('09123456789');
    expect(screen.getByLabelText('收件人').closest('input')?.value).toBe('test return name');
    expect(screen.getByLabelText('收件人電話').closest('input')?.value).toBe('09123456789');
    expect(screen.getByLabelText('地址').closest('input')?.value).toBe('test return addresss');
    expect(screen.getByLabelText('進貨退還單位').closest('input')?.value).toBe(
      'test return company',
    );
  });
});
