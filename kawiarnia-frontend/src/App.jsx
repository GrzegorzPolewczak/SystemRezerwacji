import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css'

const OFirmie = () => (
    <div>
        <h1>Witamy w Kawiarni!</h1>
        <p>Jesteśmy miejscem, gdzie dobra kawa spotyka się z perfekcyjnym kodem.</p>
    </div>
);

const Menu = () => (
    <div>
        <h2>Nasze Menu</h2>
        <ul>
            <li>Espresso - 10 zł</li>
            <li>Latte Macchiato - 15 zł</li>
            <li>Sernik algorytmiczny - 18 zł</li>
        </ul>
    </div>
);

const Rezerwacje = () => {
    const [stoliki, setStoliki] = useState([]);
    const [rezerwacje, setRezerwacje] = useState([]);

    const [wybranyStolik, setWybranyStolik] = useState(null);

    const [imie, setImie] = useState('');
    const [nazwisko, setNazwisko] = useState('');
    const [dataOd, setDataOd] = useState('');
    const [dataDo, setDataDo] = useState('');
    const [komunikat, setKomunikat] = useState(null);
    const [czyBlad, setCzyBlad] = useState(false);

    useEffect(() => {
        const pobierzDane = async () => {
            try {
                const odpStoliki = await axios.get('https://localhost:7132/api/Stoliki');
                const odpRezerwacje = await axios.get('https://localhost:7132/api/Rezerwacje');
                setStoliki(odpStoliki.data);
                setRezerwacje(odpRezerwacje.data);
            } catch (error) {
                console.error("Błąd ładowania danych:", error);
            }
        };
        pobierzDane();
    }, []);

    const wyslijRezerwacje = async (e) => {
        e.preventDefault();
        setKomunikat(null);

        const nowaRezerwacja = {
            imie: imie,
            nazwisko: nazwisko,
            dataOd: dataOd,
            dataDo: dataDo,
            stolikId: wybranyStolik.id
        };

        try { 
            await axios.post(`https://localhost:7132/api/Rezerwacje`, nowaRezerwacja);

            setCzyBlad(false);
            setKomunikat("Stolik został pomyślnie zarezerwowany! 🎉");
            setImie(''); setNazwisko(''); setDataOd(''); setDataDo('');

            const odpRezerwacje = await axios.get('https://localhost:7132/api/Rezerwacje');
            setRezerwacje(odpRezerwacje.data);
        } catch (error) {
            setCzyBlad(true);
            setKomunikat(error.response?.data || "Wystąpił błąd komunikacji z serwerem.");
        }
    };

    const zajeteTerminy = wybranyStolik
        ? rezerwacje.filter(r => r.stolikId === wybranyStolik.id)
        : [];

    const dzisiaj = new Date();
    dzisiaj.setMinutes(dzisiaj.getMinutes() - dzisiaj.getTimezoneOffset());

    const minData = dzisiaj.toISOString().slice(0, 16);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>Wybierz stolik</h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', margin: '30px 0', padding: '20px', backgroundColor: '#eaeaea', borderRadius: '10px' }}>
                {stoliki.map(stolik => (
                    <div
                        key={stolik.id}
                        onClick={() => {
                            setWybranyStolik(stolik);
                            setKomunikat(null);
                        }}
                        style={{
                            width: '100px',
                            height: '100px',
                            backgroundColor: wybranyStolik?.id === stolik.id ? '#4CAF50' : '#8B4513',
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '15px',
                            cursor: 'pointer',
                            boxShadow: wybranyStolik?.id === stolik.id ? '0 0 15px #4CAF50' : '2px 2px 5px rgba(0,0,0,0.3)',
                            transform: wybranyStolik?.id === stolik.id ? 'scale(1.1)' : 'scale(1)',
                            transition: '0.2s'
                        }}
                    >
                        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{stolik.numer}</span>
                        <span style={{ fontSize: '12px' }}>{stolik.liczbaMiejsc} os.</span>
                    </div>
                ))}
            </div>

            {wybranyStolik && (
                <div style={{ display: 'flex', gap: '20px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>

                    <div style={{ flex: 1 }}>
                        <h3 style={{ marginTop: 0 }}>Rezerwujesz Stolik nr {wybranyStolik.numer}</h3>

                        {komunikat && (
                            <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '4px', backgroundColor: czyBlad ? '#f8d7da' : '#d4edda', color: czyBlad ? '#721c24' : '#155724' }}>
                                {typeof komunikat === 'string' ? komunikat : "Błąd serwera."}
                            </div>
                        )}

                        <form onSubmit={wyslijRezerwacje} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input type="text" placeholder="Imię" value={imie} onChange={(e) => setImie(e.target.value)} required style={{ padding: '8px' }} />
                            <input type="text" placeholder="Nazwisko" value={nazwisko} onChange={(e) => setNazwisko(e.target.value)} required style={{ padding: '8px' }} />

                            <label style={{ fontSize: '14px', color: '#555' }}>Rozpoczęcie:</label>
                            <input type="datetime-local" value={dataOd} min={minData} onChange={(e) => {
                                const wybranaData = e.target.value;
                                if (wybranaData < minData) {
                                    setDataOd(minData);
                                } else {
                                    setDataOd(wybranaData);
                                }
                            }}
                                required style={{ padding: '8px' }} />

                            <label style={{ fontSize: '14px', color: '#555' }}>Zakończenie:</label>
                            <input type="datetime-local" value={dataDo} min={dataOd ? dataOd : minData} onChange={(e) => {
                                const wybranaData = e.target.value;
                                const minimalnaDopuszczalna = dataOd ? dataOd : minData;

                                if (wybranaData < minimalnaDopuszczalna) {
                                    setDataDo(minimalnaDopuszczalna);
                                } else {
                                    setDataDo(wybranaData);
                                }
                            }}
                                required style={{ padding: '8px' }} />

                            <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
                                Potwierdź rezerwację
                            </button>
                        </form>
                    </div>

                    <div style={{ flex: 1, backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
                        <h3 style={{ marginTop: 0, color: '#d9534f' }}>Zajęte terminy:</h3>

                        {zajeteTerminy.length === 0 ? (
                            <p style={{ color: '#777', fontStyle: 'italic' }}>Brak rezerwacji.</p>
                        ) : (
                            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                {zajeteTerminy.map(rez => (
                                    <li key={rez.id} style={{ marginBottom: '10px', fontSize: '14px' }}>
                                        <strong>{new Date(rez.dataOd).toLocaleDateString()}</strong><br />
                                        {new Date(rez.dataOd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(rez.dataDo).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<br />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
};

const PanelPracownika = () => {
    const [rezerwacje, setRezerwacje] = useState([]);
    const [ladowanie, setLadowanie] = useState(true);
    const [blad, setBlad] = useState(null);

    useEffect(() => {
        const pobierzDane = async () => {
            try {
                const odpowiedz = await axios.get(`https://localhost:7132/api/Rezerwacje`);

                setRezerwacje(odpowiedz.data)
                setLadowanie(false);
            } catch (error) {
                console.error(error);
                setBlad("Nie udało się pobrać danych.");
                setLadowanie(false);
            }

        };
        pobierzDane();
    }, []);

    const usunRezerwacje = async (id) => {
        if (!window.confirm("Czy na pewno chcesz odwołać tę rezerwację?")) return;

        try {
            await axios.delete(`https://localhost:7132/api/Rezerwacje/${id}`);

            setRezerwacje(rezerwacje.filter(rez => rez.id !== id));
        } catch (error) {
            console.error("Błąd podczas usuwania: ", error);
            alert("Wystąpił błąd. Nie udało się usunąć rezerwacji ze wględu na błąd serwera.");
        }
    };

    if (ladowanie) return <div>Ładowanie danych...</div>;
    if (blad) return <div style={{ color: 'red' }}>{blad}</div>;

    return (
        <div>
            <h2 style={{ color: '#d9534f' }}>Panel Zarządzania Rezerwacjami</h2>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: 'white' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
                        <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Klient</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Nr Stolika</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Od</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Do</th>

                        <th style={{ padding: '10px', textAlign: 'center' }}>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {rezerwacje.map((rez) => (
                        <tr key={rez.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '10px' }}>{rez.id}</td>
                            <td style={{ padding: '10px' }}>{rez.imie} {rez.nazwisko}</td>
                            <td style={{ padding: '10px' }}>{rez.numerStolika}</td>
                            <td style={{ padding: '10px' }}>{new Date(rez.dataOd).toLocaleString()}</td>
                            <td style={{ padding: '10px' }}>{new Date(rez.dataDo).toLocaleString()}</td>

                            <td style={{ padding: '10px', textAlign: 'center' }}>
                                <button
                                    onClick={() => usunRezerwacje(rez.id)}
                                    style={{ backgroundColor: '#d9534f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Usuń
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


function App() {
    return (
        <BrowserRouter>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>

                <nav style={{ padding: '15px', background: '#f4f4f4', borderRadius: '8px', marginBottom: '20px' }}>
                    <Link to="/" style={{ marginRight: '20px', textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>O firmie</Link>
                    <Link to="/menu" style={{ marginRight: '20px', textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>Menu</Link>
                    <Link to="/rezerwacje" style={{ marginRight: '20px', textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>Rezerwacje</Link>

                    <Link to="/panel" style={{ float: 'right', textDecoration: 'none', color: 'red' }}>Panel Pracownika</Link>
                </nav>

                <Routes>
                    <Route path="/" element={<OFirmie />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/rezerwacje" element={<Rezerwacje />} />
                    <Route path="/panel" element={<PanelPracownika />} />
                </Routes>

            </div>
        </BrowserRouter>
    );
}

export default App;
