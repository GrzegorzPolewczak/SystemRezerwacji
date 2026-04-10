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
    const API_URL = 'http://localhost:7123/api';

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
                const odpStoliki = await axios.get(`${API_URL}/Stoliki`);
                const odpRezerwacje = await axios.get(`${API_URL}/Rezerwacje`);
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
            await axios.post(`${API_URL}/Rezerwacje`, nowaRezerwacja);

            setCzyBlad(false);
            setKomunikat("Stolik został pomyślnie zarezerwowany! 🎉");
            setImie(''); setNazwisko(''); setDataOd(''); setDataDo('');

            const odpRezerwacje = await axios.get(`${API_URL}/Rezerwacje`);
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
    const API_URL = 'http://localhost:7123/api';

    const [widok, setWidok] = useState('rezerwacje');
    const [rezerwacje, setRezerwacje] = useState([]);
    const [stoliki, setStoliki] = useState([]);

    const [edytowanaRezerwacja, setEdytowanaRezerwacja] = useState(null);
    const [edytowanyStolik, setEdytowanyStolik] = useState(null);

    const [nowyStolik, setNowyStolik] = useState({ numer: '', liczbaMiejsc: '' });

    useEffect(() => {
        pobierzDane();
    }, []);

    const pobierzDane = async () => {
        try {
            const [odpRezerwacje, odpStoliki] = await Promise.all([
                axios.get(`${API_URL}/Rezerwacje`),
                axios.get(`${API_URL}/Stoliki`)
            ]);
            setRezerwacje(odpRezerwacje.data);
            setStoliki(odpStoliki.data);
        } catch (error) {
            alert("Błąd pobierania danych z serwera!");
        }
    };

    const usunRezerwacje = async (id) => {
        if (!window.confirm("Usunąć rezerwację?")) return;
        try {
            await axios.delete(`${API_URL}/Rezerwacje/${id}`);
            setRezerwacje(rezerwacje.filter(r => r.id !== id));
        } catch (error) { alert("Błąd usuwania!"); }
    };

    const zapiszEdycjeRezerwacji = async () => {
        try {
            const dto = {
                imie: edytowanaRezerwacja.imie,
                nazwisko: edytowanaRezerwacja.nazwisko,
                dataOd: edytowanaRezerwacja.dataOd,
                dataDo: edytowanaRezerwacja.dataDo,
                stolikId: edytowanaRezerwacja.stolikId
            };
            await axios.put(`${API_URL}/Rezerwacje/${edytowanaRezerwacja.id}`, dto);
            setEdytowanaRezerwacja(null);
            pobierzDane();
            alert("Zaktualizowano rezerwację!");
        } catch (error) {
            alert(error.response?.data || "Błąd edycji");
        }
    };

    const dodajStolik = async (e) => {
        e.preventDefault();

        const wpisanyNumer = parseInt(nowyStolik.numer);

        const czyNumerIstnieje = stoliki.some(s => s.numer === wpisanyNumer);
        if (czyNumerIstnieje) {
            alert(`Błąd: Stolik z numerem ${wpisanyNumer} już istnieje w kawiarni!`);
            return;
        }

        try {
            const dto = { numer: wpisanyNumer, liczbaMiejsc: parseInt(nowyStolik.liczbaMiejsc), czyZarezerwowany: false };
            await axios.post(`${API_URL}/Stoliki`, dto);
            setNowyStolik({ numer: '', liczbaMiejsc: '' });
            pobierzDane();
        } catch (error) { alert("Błąd podczas dodawania stolika."); }
    };

    const usunStolik = async (id) => {
        if (!window.confirm("Usunąć stolik? UWAGA: Spowoduje to błąd, jeśli są do niego przypisane rezerwacje!")) return;
        try {
            await axios.delete(`${API_URL}/Stoliki/${id}`);
            setStoliki(stoliki.filter(s => s.id !== id));
        } catch (error) { alert("Nie można usunąć stolika. Prawdopodobnie ma przypisane rezerwacje w bazie."); }
    };

    const zapiszEdycjeStolika = async () => {
        const wpisanyNumer = parseInt(edytowanyStolik.numer);

        const czyNumerIstnieje = stoliki.some(s => s.numer === wpisanyNumer && s.id !== edytowanyStolik.id);
        if (czyNumerIstnieje) {
            alert(`Błąd: Nie możesz zmienić numeru na ${wpisanyNumer}, bo taki stolik już istnieje!`);
            return;
        }

        try {
            const dto = { numer: wpisanyNumer, liczbaMiejsc: parseInt(edytowanyStolik.liczbaMiejsc), czyZarezerwowany: edytowanyStolik.czyZarezerwowany };
            await axios.put(`${API_URL}/Stoliki/${edytowanyStolik.id}`, dto);
            setEdytowanyStolik(null);
            pobierzDane();
        } catch (error) { alert("Błąd edycji stolika."); }
    };

    const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '10px', backgroundColor: 'white' };
    const thStyle = { padding: '10px', textAlign: 'left', backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' };
    const tdStyle = { padding: '10px', borderBottom: '1px solid #ddd' };
    const inputStyle = { width: '90%', padding: '5px' };

    return (
        <div>
            <h2 style={{ color: '#d9534f' }}>Panel Administracyjny</h2>

            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => setWidok('rezerwacje')}
                    style={{ padding: '10px 20px', backgroundColor: widok === 'rezerwacje' ? '#333' : '#ddd', color: widok === 'rezerwacje' ? 'white' : 'black', border: 'none', cursor: 'pointer', marginRight: '10px', borderRadius: '4px' }}>
                    Zarządzaj Rezerwacjami
                </button>
                <button
                    onClick={() => setWidok('stoliki')}
                    style={{ padding: '10px 20px', backgroundColor: widok === 'stoliki' ? '#333' : '#ddd', color: widok === 'stoliki' ? 'white' : 'black', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                    Zarządzaj Stolikami
                </button>
            </div>

            {widok === 'rezerwacje' && (
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>ID</th><th style={thStyle}>Imię</th><th style={thStyle}>Nazwisko</th><th style={thStyle}>Stolik (ID)</th><th style={thStyle}>Od</th><th style={thStyle}>Do</th><th style={thStyle}>Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rezerwacje.map(rez => (
                            edytowanaRezerwacja?.id === rez.id ? (
                                <tr key={rez.id} style={{ backgroundColor: '#fffccc' }}>
                                    <td style={tdStyle}>{rez.id}</td>
                                    <td style={tdStyle}><input style={inputStyle} value={edytowanaRezerwacja.imie} onChange={e => setEdytowanaRezerwacja({ ...edytowanaRezerwacja, imie: e.target.value })} /></td>
                                    <td style={tdStyle}><input style={inputStyle} value={edytowanaRezerwacja.nazwisko} onChange={e => setEdytowanaRezerwacja({ ...edytowanaRezerwacja, nazwisko: e.target.value })} /></td>
                                    <td style={tdStyle}><input type="number" style={inputStyle} value={edytowanaRezerwacja.stolikId} onChange={e => setEdytowanaRezerwacja({ ...edytowanaRezerwacja, stolikId: e.target.value })} /></td>
                                    <td style={tdStyle}><input type="datetime-local" style={inputStyle} value={edytowanaRezerwacja.dataOd.slice(0, 16)} onChange={e => setEdytowanaRezerwacja({ ...edytowanaRezerwacja, dataOd: e.target.value })} /></td>
                                    <td style={tdStyle}><input type="datetime-local" style={inputStyle} value={edytowanaRezerwacja.dataDo.slice(0, 16)} onChange={e => setEdytowanaRezerwacja({ ...edytowanaRezerwacja, dataDo: e.target.value })} /></td>
                                    <td style={tdStyle}>
                                        <button onClick={zapiszEdycjeRezerwacji} style={{ backgroundColor: '#5cb85c', color: 'white', marginRight: '5px', padding: '5px', cursor: 'pointer', border: 'none' }}>Zapisz</button>
                                        <button onClick={() => setEdytowanaRezerwacja(null)} style={{ backgroundColor: '#aaa', color: 'white', padding: '5px', cursor: 'pointer', border: 'none' }}>Anuluj</button>
                                    </td>
                                </tr>
                            ) : (
                                <tr key={rez.id}>
                                    <td style={tdStyle}>{rez.id}</td>
                                    <td style={tdStyle}>{rez.imie}</td>
                                    <td style={tdStyle}>{rez.nazwisko}</td>
                                    <td style={tdStyle}>Nr {rez.numerStolika} (ID:{rez.stolikId})</td>
                                    <td style={tdStyle}>{new Date(rez.dataOd).toLocaleString()}</td>
                                    <td style={tdStyle}>{new Date(rez.dataDo).toLocaleString()}</td>
                                    <td style={tdStyle}>
                                        <button onClick={() => setEdytowanaRezerwacja(rez)} style={{ backgroundColor: '#f0ad4e', color: 'white', marginRight: '5px', padding: '5px', cursor: 'pointer', border: 'none' }}>Edytuj</button>
                                        <button onClick={() => usunRezerwacje(rez.id)} style={{ backgroundColor: '#d9534f', color: 'white', padding: '5px', cursor: 'pointer', border: 'none' }}>Usuń</button>
                                    </td>
                                </tr>
                            )
                        ))}
                    </tbody>
                </table>
            )}

            {widok === 'stoliki' && (
                <div>
                    <div style={{ backgroundColor: '#f9f9f9', padding: '15px', marginBottom: '20px', border: '1px solid #ddd' }}>
                        <h4 style={{ margin: '0 0 10px 0' }}>Dodaj nowy stolik:</h4>
                        <form onSubmit={dodajStolik} style={{ display: 'flex', gap: '10px' }}>
                            <input type="number" placeholder="Numer stolika" required value={nowyStolik.numer} onChange={e => setNowyStolik({ ...nowyStolik, numer: e.target.value })} style={{ padding: '8px' }} />
                            <input type="number" placeholder="Liczba miejsc" required value={nowyStolik.liczbaMiejsc} onChange={e => setNowyStolik({ ...nowyStolik, liczbaMiejsc: e.target.value })} style={{ padding: '8px' }} />
                            <button type="submit" style={{ backgroundColor: '#4CAF50', color: 'white', padding: '8px 15px', border: 'none', cursor: 'pointer' }}>+ Dodaj</button>
                        </form>
                    </div>

                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>ID</th><th style={thStyle}>Numer</th><th style={thStyle}>Miejsca</th><th style={thStyle}>Akcje</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stoliki.map(stolik => (
                                edytowanyStolik?.id === stolik.id ? (
                                    <tr key={stolik.id} style={{ backgroundColor: '#fffccc' }}>
                                        <td style={tdStyle}>{stolik.id}</td>
                                        <td style={tdStyle}><input type="number" style={inputStyle} value={edytowanyStolik.numer} onChange={e => setEdytowanyStolik({ ...edytowanyStolik, numer: e.target.value })} /></td>
                                        <td style={tdStyle}><input type="number" style={inputStyle} value={edytowanyStolik.liczbaMiejsc} onChange={e => setEdytowanyStolik({ ...edytowanyStolik, liczbaMiejsc: e.target.value })} /></td>
                                        <td style={tdStyle}>
                                            <button onClick={zapiszEdycjeStolika} style={{ backgroundColor: '#5cb85c', color: 'white', marginRight: '5px', padding: '5px', cursor: 'pointer', border: 'none' }}>Zapisz</button>
                                            <button onClick={() => setEdytowanyStolik(null)} style={{ backgroundColor: '#aaa', color: 'white', padding: '5px', cursor: 'pointer', border: 'none' }}>Anuluj</button>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr key={stolik.id}>
                                        <td style={tdStyle}>{stolik.id}</td>
                                        <td style={tdStyle}>Stolik nr {stolik.numer}</td>
                                        <td style={tdStyle}>{stolik.liczbaMiejsc} os.</td>
                                        <td style={tdStyle}>
                                            <button onClick={() => setEdytowanyStolik(stolik)} style={{ backgroundColor: '#f0ad4e', color: 'white', marginRight: '5px', padding: '5px', cursor: 'pointer', border: 'none' }}>Edytuj</button>
                                            <button onClick={() => usunStolik(stolik.id)} style={{ backgroundColor: '#d9534f', color: 'white', padding: '5px', cursor: 'pointer', border: 'none' }}>Usuń</button>
                                        </td>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
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
