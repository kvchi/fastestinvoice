import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DocumentPreview from './DocumentPreview.jsx';

const document = {
  amountMinor: 85_000_000,
  currency: 'NGN',
  customer: 'Acme Projects',
  depositBasisPoints: 0,
  due: '',
  email: 'accounts@acme.example',
  item: 'Website design',
  notes: '',
  taxBasisPoints: 0,
  type: 'Invoice',
};

const settings = {
  account: 'Demo bank details',
  business: 'Northstar Studio',
  email: 'hello@northstar.example',
};

describe('DocumentPreview positioning', () => {
  it('sticks on desktop and returns to normal flow at the tablet breakpoint', () => {
    render(<DocumentPreview document={document} settings={settings} />);
    const preview = screen.getByRole('article');

    expect(preview).toHaveClass('sticky', 'top-6', 'self-start', 'tablet:static');
  });
});
