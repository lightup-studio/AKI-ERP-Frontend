import MockAdapter from 'axios-mock-adapter';
import * as NextNavigation from 'next/navigation';
import { act } from 'react-dom/test-utils';

import axios from '@contexts/axios';
import { CustomerPartner } from '@data-access/models';
import { createTestWrapper } from '@test-utils/index';
import { fireEvent, render, screen } from '@testing-library/react';

import UpdateCustomerDialog from '../UpdateCustomerDialog';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useSearchParams: jest
    .fn()
    .mockReturnValue(new URLSearchParams() as NextNavigation.ReadonlyURLSearchParams),
}));

const { wrapper } = createTestWrapper();

describe('UpdateCustomerDialog', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  // Renders the form with the correct inputs and labels
  it('should render the form with the correct inputs and labels', () => {
    // Arrange
    const isOpen = true;
    const data = {
      id: 1,
      zhName: '約翰·多伊',
      enName: 'John Doe',
      telephone: '1234567890',
      status: 'Active',
      address: '123 Main St',
      type: 'Customer',
      metadata: {},
      createTime: '2023-10-23T18:40:57.97296Z',
      lastModifyTime: '2023-10-23T18:40:57.97296Z',
    } as CustomerPartner;

    // Act
    render(<UpdateCustomerDialog isOpen={isOpen} data={data} />, {
      wrapper,
    });

    // Assert
    expect(screen.getByLabelText('藏家姓名')).toBeInTheDocument();
    expect(screen.getByLabelText('電話')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('地址')).toBeInTheDocument();
  });

  // Displays error messages when form inputs are invalid
  it('should display error messages when form inputs are invalid', async () => {
    // Arrange
    const isOpen = true;
    const data = {
      id: 1,
      zhName: '',
      enName: '',
      telephone: '',
      status: 'Active',
      address: '',
      type: 'Customer',
      metadata: {
        email: 'test.example.com',
      },
      createTime: '2023-10-23T18:40:57.97296Z',
      lastModifyTime: '2023-10-23T18:40:57.97296Z',
    } as CustomerPartner;

    render(
      <main>
        <UpdateCustomerDialog isOpen={isOpen} data={data} />
      </main>,
      {
        wrapper,
      },
    );

    // Act
    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: '儲存' }));
    });

    // Assert
    expect(screen.getByText('請至少填寫中文姓名或英文姓名其一')).toBeInTheDocument();
    expect(screen.getByText('電話必填')).toBeInTheDocument();
    expect(screen.getByText('Email 格式錯誤')).toBeInTheDocument();
  });

  // Updates the partner data when the form is submitted
  it('should update the partner data when the form is submitted', async () => {
    // Arrange
    const isOpen = true;
    const data = {
      id: 1,
      zhName: '約翰·多伊',
      enName: 'John Doe',
      telephone: '1234567890',
      status: 'Active',
      address: '123 Main St',
      type: 'Customer',
      metadata: { email: '' },
      createTime: '2023-10-23T18:40:57.97296Z',
      lastModifyTime: '2023-10-23T18:40:57.97296Z',
    } as CustomerPartner;
    const onClose = jest.fn();

    mock.onPut('/api/partners').reply(200, data);

    render(
      <main>
        <UpdateCustomerDialog isOpen={isOpen} data={data} onClose={onClose} />
      </main>,
      {
        wrapper,
      },
    );

    // Act
    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: '儲存' }));
    });

    // Assert
    expect(onClose).toHaveBeenCalledWith(data);
  });

  // Closes the dialog when the cancel button is clicked
  it('should close the dialog when the cancel button is clicked', () => {
    // Arrange
    const isOpen = true;
    const data = {
      id: 1,
      zhName: '約翰·多伊',
      enName: 'John Doe',
      telephone: '1234567890',
      status: 'Active',
      address: '123 Main St',
      type: 'Customer',
      metadata: {},
      createTime: '2023-10-23T18:40:57.97296Z',
      lastModifyTime: '2023-10-23T18:40:57.97296Z',
    } as CustomerPartner;
    const onClose = jest.fn();

    // Act
    render(<UpdateCustomerDialog isOpen={isOpen} data={data} onClose={onClose} />, {
      wrapper,
    });

    // Assert
    fireEvent.click(screen.getByRole('button', { name: '取消' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('should close the dialog when the backdrop is clicked', () => {
    // Arrange
    const isOpen = true;
    const data = {
      id: 1,
      zhName: '約翰·多伊',
      enName: 'John Doe',
      telephone: '1234567890',
      status: 'Active',
      address: '123 Main St',
      type: 'Customer',
      metadata: {},
      createTime: '2023-10-23T18:40:57.97296Z',
      lastModifyTime: '2023-10-23T18:40:57.97296Z',
    } as CustomerPartner;
    const onClose = jest.fn();

    // Act
    render(<UpdateCustomerDialog isOpen={isOpen} data={data} onClose={onClose} />, {
      wrapper,
    });

    // Assert
    fireEvent.click(screen.getByTestId('customer-modal-backdrop'));
    expect(onClose).toHaveBeenCalled();
  });

  // form input blur trigger
  it('should trigger form validation on input blur', async () => {
    // Arrange
    const isOpen = true;
    const data = {
      id: 1,
      zhName: '',
      enName: '',
      telephone: '1234567890',
      status: 'Active',
      address: '123 Main St',
      type: 'Customer',
      metadata: {},
      createTime: '2023-10-23T18:40:57.97296Z',
      lastModifyTime: '2023-10-23T18:40:57.97296Z',
    } as CustomerPartner;

    render(<UpdateCustomerDialog isOpen={isOpen} data={data} />, {
      wrapper,
    });

    // Act
    fireEvent.blur(screen.getByTestId('zhName'));
    fireEvent.blur(screen.getByTestId('enName'));

    // Assert
    expect(await screen.findByText('請至少填寫中文姓名或英文姓名其一')).toBeInTheDocument();
  });
});
