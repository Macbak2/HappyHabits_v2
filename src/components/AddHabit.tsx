import { useState } from 'react';
import axios from 'axios';

interface FormData {
	tresc: string;
}

// NOWE: Dodano interfejs props z onAddSuccess
interface AddHabitProps {
	onAddSuccess: () => void;
}

// ZMIANA: Komponent teraz przyjmuje props
const AddHabit: React.FC<AddHabitProps> = ({ onAddSuccess }) => {
	const [formData, setFormData] = useState<FormData>({ tresc: '' });
	const [message, setMessage] = useState<string>('');

	// Ta funkcja pozostaje bez zmian
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prevState => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await axios.post('http://localhost:5000/api/dodaj-tekst', formData);
			setMessage('Tekst został dodany pomyślnie!');
			setFormData({ tresc: '' });
			onAddSuccess(); // NOWE: Wywołanie funkcji po pomyślnym dodaniu
		} catch (error) {
			setMessage('Wystąpił błąd podczas dodawania tekstu.');
			console.error('Błąd:', error);
		}
	};

	return (
		<div>
			<h2>Dodaj nowy tekst</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor='tresc'>Treść:</label>
					<input type='text' id='tresc' name='tresc' value={formData.tresc} onChange={handleInputChange} required />
				</div>
				<button type='submit'>Dodaj tekst</button>
			</form>
			{message && <p>{message}</p>}
		</div>
	);
};

export { AddHabit };
