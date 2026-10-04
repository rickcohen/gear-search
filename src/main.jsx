import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const inventory = [
  { id: 1, title: '1981 Ibanez TS808', brand: 'Ibanez', category: 'Overdrive', price: 899, condition: 'Excellent', image: 'TS', accent: '#6f9c55', badge: 'Vintage' },
  { id: 2, title: 'Cali76 Compact Deluxe', brand: 'Origin Effects', category: 'Compressor', price: 349, condition: 'Mint', image: '76', accent: '#ce493f', badge: 'Popular' },
  { id: 3, title: 'Timeline', brand: 'Strymon', category: 'Delay', price: 329, condition: 'Excellent', image: 'TL', accent: '#385b94', badge: '' },
  { id: 4, title: 'BigSky MX', brand: 'Strymon', category: 'Reverb', price: 679, condition: 'Mint', image: 'BS', accent: '#3d6589', badge: 'New' },
  { id: 5, title: 'Protein Dual Overdrive', brand: 'Browne Amplification', category: 'Overdrive', price: 319, condition: 'Excellent', image: 'P', accent: '#d7af64', badge: 'Popular' },
  { id: 6, title: 'HX Stomp XL', brand: 'Line 6', category: 'Multi-effects', price: 579, condition: 'Excellent', image: 'HX', accent: '#1b1b1d', badge: '' },
  { id: 7, title: 'King of Tone', brand: 'Analogman', category: 'Overdrive', price: 825, condition: 'Very Good', image: 'KOT', accent: '#7552a5', badge: 'Rare' },
  { id: 8, title: 'El Capistan', brand: 'Strymon', category: 'Delay', price: 289, condition: 'Mint', image: 'EC', accent: '#30475f', badge: '' }
]

const categories = ['All gear', 'Overdrive', 'Delay', 'Reverb', 'Compressor', 'Multi-effects']

function formatPrice(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

function PedalArt({ item }) {
  return <div className="pedal-art" style={{ '--pedal': item.accent }}>
    <div className="pedal-shadow" />
    <div className="pedal">
      <div className="pedal-brand">{item.brand.split(' ')[0]}</div>
      <div className="pedal-name">{item.image}</div>
      <div className="pedal-screen" />
      <div className="pedal-knobs"><i /><i /><i /></div>
      <div className="pedal-switch" />
    </div>
  </div>
}

function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All gear')
  const [sort, setSort] = useState('Featured')
  const [favorites, setFavorites] = useState([])
  const [savedOnly, setSavedOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    let filtered = inventory.filter(item => {
      const matchesText = !term || [item.title, item.brand, item.category, item.condition].join(' ').toLowerCase().includes(term)
      return matchesText && (category === 'All gear' || item.category === category) && (!savedOnly || favorites.includes(item.id))
    })
    if (sort === 'Price: low to high') filtered = [...filtered].sort((a, b) => a.price - b.price)
    if (sort === 'Price: high to low') filtered = [...filtered].sort((a, b) => b.price - a.price)
    if (sort === 'Newest') filtered = [...filtered].reverse()
    return filtered
  }, [query, category, sort, favorites, savedOnly])

  const toggleFavorite = id => setFavorites(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id])

  return <main>
    <header className="topbar">
      <a className="logo" href="#top" aria-label="Gear Search home"><span>G</span> gear<span className="logo-dot">search</span></a>
      <nav><a href="#discover">Discover</a><a href="#how">How it works</a><button className="saved-link" onClick={() => setSavedOnly(!savedOnly)}>Saved <b>{favorites.length}</b></button></nav>
      <button className="sell-button" onClick={() => alert('Listing tools are coming soon.')}>Sell your gear <span>↗</span></button>
    </header>

    <section className="hero" id="top">
      <p className="eyebrow">Find the gear that moves you</p>
      <h1>Your next sound<br /><em>is out there.</em></h1>
      <p className="hero-copy">A more considered way to buy and sell the instruments, pedals, amps, and studio tools you actually want to play.</p>
      <div className="search-box">
        <span className="search-icon">⌕</span>
        <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search guitars, pedals, amps, and more" aria-label="Search gear" />
        <button onClick={() => document.querySelector('#discover').scrollIntoView({ behavior: 'smooth' })}>Search gear <span>→</span></button>
      </div>
      <div className="popular"><span>Popular:</span><button onClick={() => setQuery('Overdrive')}>Overdrive pedals</button><button onClick={() => setQuery('Strymon')}>Strymon</button><button onClick={() => setQuery('Vintage')}>Vintage</button></div>
      <div className="hero-orbs orb-one" /><div className="hero-orbs orb-two" /><div className="hero-line" />
    </section>

    <section className="catalog" id="discover">
      <div className="section-heading"><div><p className="eyebrow">Curated for players</p><h2>Explore the good stuff.</h2></div><a href="#discover" onClick={e => { e.preventDefault(); setCategory('All gear'); setQuery(''); setSavedOnly(false) }}>View all gear <span>→</span></a></div>
      <div className="toolbar">
        <div className="chips">{categories.map(item => <button key={item} className={category === item ? 'chip active' : 'chip'} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="toolbar-actions"><button className={showFilters ? 'filter active-filter' : 'filter'} onClick={() => setShowFilters(!showFilters)}>☷ Filters</button><label>Sort <select value={sort} onChange={e => setSort(e.target.value)}><option>Featured</option><option>Newest</option><option>Price: low to high</option><option>Price: high to low</option></select></label></div>
      </div>
      {showFilters && <div className="filter-panel"><span>Condition:</span>{['Mint', 'Excellent', 'Very Good'].map(condition => <button key={condition} onClick={() => setQuery(condition)}>{condition}</button>)}<button onClick={() => {setQuery('');setShowFilters(false)}}>Clear</button></div>}
      <p className="result-count">{results.length} {results.length === 1 ? 'piece' : 'pieces'} of gear found</p>
      <div className="grid">
        {results.map(item => <article className="gear-card" key={item.id}>
          <div className="gear-photo">{item.badge && <span className="badge">{item.badge}</span>}<button className={favorites.includes(item.id) ? 'heart saved' : 'heart'} onClick={() => toggleFavorite(item.id)} aria-label={`Save ${item.title}`}>{favorites.includes(item.id) ? '♥' : '♡'}</button><PedalArt item={item} /></div>
          <div className="gear-info"><p>{item.brand}</p><h3>{item.title}</h3><div><span>{item.condition}</span><strong>{formatPrice(item.price)}</strong></div></div>
        </article>)}
      </div>
      {results.length === 0 && <div className="empty"><h3>No gear matches that search.</h3><button onClick={() => {setQuery('');setCategory('All gear');setSavedOnly(false)}}>Clear search</button></div>}
    </section>

    <section className="promise" id="how"><div><p className="eyebrow">Built for the long haul</p><h2>Less noise.<br /><em>More signal.</em></h2></div><p>Thoughtful discovery, transparent condition notes, and a place that feels as good to browse as a great record shop.</p><div className="promise-stats"><span><b>8</b> handpicked listings</span><span><b>24 hr</b> seller response goal</span></div></section>

    <footer><a className="logo" href="#top"><span>G</span> gear<span className="logo-dot">search</span></a><p>Made for the obsessed.</p><p>© 2026 Gear Search</p></footer>
  </main>
}

createRoot(document.getElementById('root')).render(<App />)
