import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavigationPanel from '../components/NavigationPanel';

jest.mock('../components/LocationAutocomplete', () => {
    return function MockedLocationAutocomplete() {
        return <div></div>;
    };
});

test('renders NavigationPanel without crashing', () => {
    render(<NavigationPanel stations={[]} compareStations={[]} />);
});

test('opens and closes the drawer when the menu button is clicked', () => {
    render(<NavigationPanel stations={[]} compareStations={[]} />);
    const menuButton = screen.getByLabelText('menu');
    fireEvent.click(menuButton);
    expect(screen.getByTestId('navigation-drawer')).toBeInTheDocument();
    fireEvent.click(menuButton);
    expect(screen.getByTestId('navigation-drawer')).toHaveStyle('display: block');
});

test('calls onSearchUpdate with the correct parameters when the Update Search button is clicked', async () => {
    const onSearchUpdate = jest.fn();
    render(<NavigationPanel stations={[]} compareStations={[]} onSearchUpdate={onSearchUpdate} />);

    // Open the drawer before finding the input element
    const menuButton = screen.getByLabelText('menu');
    fireEvent.click(menuButton);

    await waitFor(() => {
        fireEvent.change(screen.getByLabelText('Radius (meters)'), {
            target: { value: 2500 },
        });
    });

    fireEvent.click(screen.getByText('Update Search'));
    expect(onSearchUpdate).toHaveBeenCalledWith(null, 2500);
});


