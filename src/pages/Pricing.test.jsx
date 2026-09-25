import { cleanup, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { ToastProvider } from '../context/ToastContext.jsx';
import LandingPage from './LandingPage.jsx';
import PlansPage from './PlansPage.jsx';

function renderPage(Page) {
  render(
    <MemoryRouter>
      <ToastProvider>
        <Page />
      </ToastProvider>
    </MemoryRouter>,
  );
}

function expectFeaturedCard() {
  const title = screen.getByRole('heading', { name: 'Founding Business' });
  const card = title.closest('article');
  expect(card).toHaveClass('bg-[#0d604d]', 'text-white');
  expect(card).not.toHaveClass('bg-white');
  expect(within(card).getByText('First 1,000 businesses')).toHaveClass('text-lime');
  expect(within(card).getByText(/₦25,000/)).toHaveClass('text-white');
  expect(within(card).getByText('Unlimited branded documents')).toBeVisible();
  expect(within(card).getByRole('button', { name: /Explore founding offer/ })).toHaveClass(
    'bg-lime',
    'text-ink',
  );
}

describe('featured pricing card', () => {
  afterEach(cleanup);

  it('is complete and uses an unambiguous dark featured variant on the landing page', () => {
    renderPage(LandingPage);
    expectFeaturedCard();
  });

  it('is complete and uses an unambiguous dark featured variant on the plans page', () => {
    renderPage(PlansPage);
    expectFeaturedCard();
  });
});
