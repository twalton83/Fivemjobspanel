import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { AppProvider } from '../context/AppContext';
import { JobsPage } from './JobsPage';

function renderJobsPage() {
  return render(
    <MemoryRouter>
      <AppProvider>
        <JobsPage />
      </AppProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('JobsPage', () => {
  it('renders the page heading and stats', () => {
    renderJobsPage();

    expect(screen.getByText('Jobs')).toBeInTheDocument();
    expect(screen.getByText(/Manage career paths/)).toBeInTheDocument();
    expect(screen.getByText('2 jobs')).toBeInTheDocument();
    expect(screen.getByText('10 ranks')).toBeInTheDocument();
  });

  it('displays all dev jobs', () => {
    renderJobsPage();

    expect(screen.getByText('Los Santos Police Department')).toBeInTheDocument();
    expect(screen.getByText('police')).toBeInTheDocument();
    expect(screen.getByText('Mechanic Shop')).toBeInTheDocument();
    expect(screen.getByText('mechanic')).toBeInTheDocument();
  });

  it('shows rank count per job', () => {
    renderJobsPage();

    expect(screen.getByText('6 ranks')).toBeInTheDocument();
    expect(screen.getByText('4 ranks')).toBeInTheDocument();
  });

  it('expands a job to show its ranks', async () => {
    const user = userEvent.setup();
    renderJobsPage();

    const policeCard = screen.getByText('Los Santos Police Department').closest('[class*="bg-surface"]')!;
    const ranksContainer = policeCard.querySelector('.grid.transition-all')!;
    expect(ranksContainer.className).toContain('grid-rows-[0fr]');

    const expandButton = within(policeCard).getAllByRole('button')[0];
    await user.click(expandButton);

    expect(ranksContainer.className).toContain('grid-rows-[1fr]');
    expect(screen.getByText('Cadet')).toBeInTheDocument();
    expect(screen.getByText('Officer')).toBeInTheDocument();
    expect(screen.getByText('Sergeant')).toBeInTheDocument();
    expect(screen.getByText('Chief')).toBeInTheDocument();
  });

  it('opens the new job dialog', async () => {
    const user = userEvent.setup();
    renderJobsPage();

    await user.click(screen.getByRole('button', { name: /New Job/i }));

    expect(screen.getByText('New Job', { selector: '[class*="DialogTitle"], h2' })).toBeInTheDocument();
    expect(screen.getByText(/Define a career path/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('police')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Los Santos Police')).toBeInTheDocument();
  });

  it('opens the edit job dialog pre-filled with job data', async () => {
    const user = userEvent.setup();
    renderJobsPage();

    const policeCard = screen.getByText('Los Santos Police Department').closest('[class*="bg-surface"]')!;
    const buttons = within(policeCard).getAllByRole('button');
    const editButton = buttons.find((b) => b.querySelector('svg.lucide-pencil'))!;
    await user.click(editButton);

    expect(screen.getByText('Edit Job')).toBeInTheDocument();
    expect(screen.getByDisplayValue('police')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Los Santos Police Department')).toBeInTheDocument();
  });

  it('opens delete confirmation dialog', async () => {
    const user = userEvent.setup();
    renderJobsPage();

    const policeCard = screen.getByText('Los Santos Police Department').closest('[class*="bg-surface"]')!;
    const buttons = within(policeCard).getAllByRole('button');
    const deleteButton = buttons.find((b) => b.querySelector('svg.lucide-trash-2'))!;
    await user.click(deleteButton);

    expect(screen.getByText(/Delete Los Santos Police Department/)).toBeInTheDocument();
    expect(screen.getByText(/This permanently removes the job/)).toBeInTheDocument();
  });

  it('delete button is disabled until confirmation text matches', async () => {
    const user = userEvent.setup();
    renderJobsPage();

    const policeCard = screen.getByText('Los Santos Police Department').closest('[class*="bg-surface"]')!;
    const buttons = within(policeCard).getAllByRole('button');
    const deleteButton = buttons.find((b) => b.querySelector('svg.lucide-trash-2'))!;
    await user.click(deleteButton);

    const confirmDeleteBtn = screen.getByRole('button', { name: /^Delete$/i });
    expect(confirmDeleteBtn).toBeDisabled();

    const input = screen.getByRole('textbox');
    await user.type(input, 'Los Santos Police Department');

    expect(confirmDeleteBtn).toBeEnabled();
  });

  it('creates a new job via the form', async () => {
    const user = userEvent.setup();
    renderJobsPage();

    await user.click(screen.getByRole('button', { name: /New Job/i }));

    await user.clear(screen.getByPlaceholderText('police'));
    await user.type(screen.getByPlaceholderText('police'), 'fire');
    await user.clear(screen.getByPlaceholderText('Los Santos Police'));
    await user.type(screen.getByPlaceholderText('Los Santos Police'), 'Fire Department');

    await user.click(screen.getByRole('button', { name: /^Create$/i }));

    expect(screen.getByText('Fire Department')).toBeInTheDocument();
    expect(screen.getByText('3 jobs')).toBeInTheDocument();
  });
});
