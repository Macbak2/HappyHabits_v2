import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Tekst {
	id: number;
	tresc: string;
}

interface TekstZBazyProps {
	refreshTrigger: number;
}

const TekstZBazy: React.FC<TekstZBazyProps> = ({ refreshTrigger }) => {
	const [teksty, setTeksty] = useState<Tekst[]>([]);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editedText, setEditedText] = useState<string>('');

	const fetchTeksty = async () => {
		try {
			const response = await axios.get<{ teksty: Tekst[] }>('http://localhost:5000/api/tekst');
			setTeksty(response.data.teksty);
		} catch (error) {
			console.error('Błąd podczas pobierania tekstów:', error);
		}
	};

	useEffect(() => {
		fetchTeksty();
	}, [refreshTrigger]);

	const handleEdit = (id: number, tresc: string) => {
		setEditingId(id);
		setEditedText(tresc);
	};

	const handleSave = async (id: number) => {
		try {
			await axios.put(`http://localhost:5000/api/aktualizuj-tekst/${id}`, { tresc: editedText });
			setEditingId(null);
			fetchTeksty(); // Odśwież listę po aktualizacji
		} catch (error) {
			console.error('Błąd podczas aktualizacji tekstu:', error);
		}
	};

	const handleDelete = async (id: number) => {
		if (window.confirm('Czy na pewno chcesz usunąć ten tekst?')) {
			try {
				await axios.delete(`http://localhost:5000/api/usun-tekst/${id}`);
				fetchTeksty();
			} catch (error) {
				console.error('Błąd podczas usuwania tekstu:', error);
			}
		}
	};

	return (
		<div>
			<h1>Teksty z bazy danych:</h1>
			{teksty.map(tekst => (
				<div key={tekst.id}>
					{editingId === tekst.id ? (
						<>
							<input value={editedText} onChange={e => setEditedText(e.target.value)} />
							<button onClick={() => handleSave(tekst.id)}>Zapisz</button>
						</>
					) : (
						<>
							<p>{tekst.tresc}</p>
							<button onClick={() => handleEdit(tekst.id, tekst.tresc)}>Edytuj</button>
							<button onClick={() => handleDelete(tekst.id)}>Usuń</button>
						</>
					)}
				</div>
			))}
		</div>
	);
};

export { TekstZBazy };
