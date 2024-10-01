import React, { useState, useEffect, KeyboardEvent } from 'react';
import axios from 'axios';
import '../styles/HabitTracker.css';

interface Habit {
  id: number;
  tresc: string;
  data_wykonania: string;
  status: 'pending' | 'completed' | 'failed';
  explanation?: string;
}

const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState('');
  const [newHabitDate, setNewHabitDate] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedText, setEditedText] = useState('');
  const [editedDate, setEditedDate] = useState('');
  const [statusPopupId, setStatusPopupId] = useState<number | null>(null);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await axios.get<{ teksty: Habit[] }>('http://localhost:5000/api/tekst');
      const sortedHabits = sortHabitsByDate(response.data.teksty);
      setHabits(sortedHabits);
    } catch (error) {
      console.error('Błąd podczas pobierania nawyków:', error);
    }
  };

  const sortHabitsByDate = (habitsToSort: Habit[]): Habit[] => {
    return habitsToSort.sort((a, b) => {
      return new Date(a.data_wykonania).getTime() - new Date(b.data_wykonania).getTime();
    });
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const handleAddHabit = async () => {
    if (!newHabit.trim() || !newHabitDate) return;
    try {
      await axios.post('http://localhost:5000/api/dodaj-tekst', { 
        tresc: newHabit,
        data_wykonania: newHabitDate,
        status: 'pending'
      });
      setNewHabit('');
      setNewHabitDate('');
      fetchHabits();
    } catch (error) {
      console.error('Błąd podczas dodawania nawyku:', error);
    }
  };

  const handleEdit = (id: number, tresc: string, data_wykonania: string) => {
    if (editingId === id) {
      setEditingId(null);
    } else {
      setEditingId(id);
      setEditedText(tresc);
      setEditedDate(data_wykonania.split('T')[0]);
    }
  };

  const handleSave = async (id: number) => {
    if (!editedText.trim() || !editedDate) return;
    try {
      await axios.put(`http://localhost:5000/api/aktualizuj-tekst/${id}`, { 
        tresc: editedText,
        data_wykonania: editedDate 
      });
      setEditingId(null);
      fetchHabits();
    } catch (error) {
      console.error('Błąd podczas aktualizacji nawyku:', error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, id: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave(id);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten nawyk?')) {
      try {
        await axios.delete(`http://localhost:5000/api/usun-tekst/${id}`);
        fetchHabits();
      } catch (error) {
        console.error('Błąd podczas usuwania nawyku:', error);
      }
    }
  };

  const handleStatusChange = async (id: number, newStatus: 'pending' | 'completed' | 'failed') => {
    try {
      let data: { status: string; explanation?: string | null } = { status: newStatus };
      
      if (newStatus === 'failed') {
        const userExplanation = prompt("Dlaczego nie udało się wykonać zadania?");
        if (userExplanation === null) return; // Użytkownik anulował
        data.explanation = userExplanation;
      } else {
        data.explanation = null; // Usuwamy wyjaśnienie dla innych statusów
      }

      await axios.put(`http://localhost:5000/api/aktualizuj-status/${id}`, data);
      setStatusPopupId(null);
      fetchHabits();
    } catch (error) {
      console.error('Błąd podczas aktualizacji statusu:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      default:
        return '?';
    }
  };

  return (
    <div className='app-container'>
      <header className='header'>
        <h1>Nawyki</h1>
      </header>
      <ul className='habit-list'>
        {habits.map(habit => (
          <li key={habit.id} className='habit-item'>
            <div className='habit-actions'>
              <span className='habit-icon' onClick={() => handleDelete(habit.id)}>🗑</span>
              <span className='habit-icon' onClick={() => handleEdit(habit.id, habit.tresc, habit.data_wykonania)}>✎</span>
            </div>
            {editingId === habit.id ? (
              <div className='habit-edit'>
                <input
                  type="date"
                  className='edit-date-input'
                  value={editedDate}
                  onChange={(e) => setEditedDate(e.target.value)}
                />
                <input
                  className='edit-text-input'
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, habit.id)}
                />
                <button onClick={() => handleSave(habit.id)}>Zapisz</button>
              </div>
            ) : (
              <>
                <div className='habit-date'>{formatDate(habit.data_wykonania)}</div>
                <div className='habit-content'>
                  <span className='habit-name'>{habit.tresc}</span>
                </div>
                {habit.status === 'failed' && habit.explanation && (
                  <div className='habit-explanation' title={habit.explanation}>
                    ℹ️
                  </div>
                )}
              </>
            )}
            <div className='habit-status'>
              <span 
                className='status-mark' 
                onClick={() => setStatusPopupId(habit.id)}
              >
                {getStatusIcon(habit.status)}
              </span>
              {statusPopupId === habit.id && (
                <div className='status-popup'>
                  <button onClick={() => handleStatusChange(habit.id, 'pending')}>?</button>
                  <button onClick={() => handleStatusChange(habit.id, 'completed')}>✅</button>
                  <button onClick={() => handleStatusChange(habit.id, 'failed')}>❌</button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className='add-habit'>
        <input
          type='date'
          value={newHabitDate}
          onChange={(e) => setNewHabitDate(e.target.value)}
          className='date-input'
        />
        <input
          type='text'
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder='Dodaj nowy nawyk'
          className='text-input'
        />
        <button onClick={handleAddHabit}>Dodaj</button>
      </div>
    </div>
  );
};

export default HabitTracker;