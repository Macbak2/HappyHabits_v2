import React, { useState, useEffect } from 'react';
import './App.css';

interface Habit {
	id: number;
	name: string;
	days: number[];
}

function App(): JSX.Element {
	const [habits, setHabits] = useState<Habit[]>([]);
	const [newHabit, setNewHabit] = useState<string>('');

	// Pobieranie nawyków z serwera
	useEffect(() => {
		fetch('http://localhost:5000/habits')
			.then(res => res.json())
			.then((data: Habit[]) => setHabits(data));
	}, []);

	// Dodawanie nowego nawyku
	const addHabit = async (): Promise<void> => {
		const res = await fetch('http://localhost:5000/api/habits', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name: newHabit, days: Array(7).fill(0) }),
		});
		const data: Habit = await res.json();
		setHabits([...habits, data]);
		setNewHabit('');
	};

	// Aktualizacja nawyku
	const toggleDay = async (habitId: number, dayIndex: number): Promise<void> => {
		const habit = habits.find(h => h.id === habitId);
		if (!habit) return;

		const updatedDays = [...habit.days];
		updatedDays[dayIndex] = updatedDays[dayIndex] === 0 ? 1 : 0;
		const res = await fetch(`http://localhost:5000/habits/${habitId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ days: updatedDays }),
		});
		const updatedHabit: Habit = await res.json();
		setHabits(habits.map(h => (h.id === habitId ? updatedHabit : h)));
	};

	// Usuwanie nawyku
	const deleteHabit = async (habitId: number): Promise<void> => {
		await fetch(`http://localhost:5000/habits/${habitId}`, {
			method: 'DELETE',
		});
		setHabits(habits.filter(h => h.id !== habitId));
	};

	return (
		<div className='App'>
			<h1>Happy Habits Tracker</h1>
			<div className='habit-input'>
				<input
					type='text'
					value={newHabit}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewHabit(e.target.value)}
					placeholder='New habit...'
				/>
				<button onClick={addHabit}>Add Habit</button>
			</div>
			<div className='habit-list'>
				{habits.map(habit => (
					<div key={habit.id} className='habit'>
						<h2>{habit.name}</h2>
						<div className='days'>
							{habit.days.map((day, index) => (
								<span
									key={index}
									className={`day ${day ? 'completed' : ''}`}
									onClick={() => toggleDay(habit.id, index)}>
									{['S', 'M', 'T', 'W', 'T', 'F', 'S'][index]}
								</span>
							))}
						</div>
						<button onClick={() => deleteHabit(habit.id)} className='delete'>
							Delete
						</button>
					</div>
				))}
			</div>
		</div>
	);
}

export default App;
