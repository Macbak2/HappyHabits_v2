import './App.css';
import HabitTracker from './components/HabitTracker';

const App: React.FC = () => {
	return (
		<div className='App'>
			<h1>Aplikacja do zarządzania taskami</h1>
			<HabitTracker />
		</div>
	);
};

export { App };
