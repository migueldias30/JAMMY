import React, { useState, useEffect } from 'react';
import './CreateJamModal.css';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Users, Globe, UserCheck, Shield, Search, Loader } from 'lucide-react';

export default function CreateJamModal({ isOpen, onClose, onCreate, groups = [], currentUser, initialPos }) {
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        duration: '2h',
        icon: '🍺',
        privacy: 'all-friends',
        targetGroups: [],
        pos: initialPos || null
    });

    const ICONS = ['🍺', '☕', '⚽', '💻', '🎵', '🍔', '🎨', '🎬', '🏋️', '🕺'];

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (initialPos) {
            setFormData(prev => ({ ...prev, pos: initialPos }));
        }
    }, [initialPos]);

    const handleSearch = async () => {
        if (!searchQuery) return;
        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            if (!text.trim()) {
                throw new Error('Empty response from API');
            }
            const data = JSON.parse(text);
            setSearchResults(data);
        } catch (err) {
            console.error("Search failed", err);
            setSearchResults([]); // Clear results on error
        } finally {
            setIsSearching(false);
        }
    };

    const selectLocation = (result) => {
        setFormData(prev => ({
            ...prev,
            location: result.display_name,
            pos: [parseFloat(result.lat), parseFloat(result.lon)]
        }));
        setSearchResults([]);
        setSearchQuery(result.display_name);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.pos) {
            alert("Please select a location on the map or search for an address.");
            return;
        }
        if (!formData.date || !formData.time) {
            alert("Please pick a date and time.");
            return;
        }

        const fullDateTime = new Date(`${formData.date}T${formData.time}`);

        onCreate({
            ...formData,
            attendees: [currentUser.name],
            creatorId: currentUser.uid,
            creatorName: currentUser.name,
            dateTime: fullDateTime.toISOString(), // Standardize for sorting
            displayTime: `${formData.date} at ${formData.time}`, // Keep simple for now or format later
            duration: formData.duration // Pass duration explicitly
        });
        // Reset
        setFormData({
            title: '',
            location: '',
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().slice(0, 5),
            duration: '2h',
            icon: '🍺',
            privacy: 'all-friends',
            targetGroups: [],
            pos: null
        });
        setSearchQuery('');
        onClose();
    };

    const toggleGroup = (groupId) => {
        setFormData(prev => ({
            ...prev,
            targetGroups: prev.targetGroups.includes(groupId)
                ? prev.targetGroups.filter(id => id !== groupId)
                : [...prev.targetGroups, groupId]
        }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="modal-backdrop"
                    />
                    <motion.div
                        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="create-jam-panel"
                    >
                        <div className="create-jam-header">
                            <h2>Host a Jam</h2>
                            <button onClick={onClose} className="modal-close-btn"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="create-jam-form">
                            <div className="input-group">
                                <label className="input-group-label">JAM TITLE</label>
                                <input
                                    required
                                    className="glass-morphism search-input"
                                    placeholder="What's happening?"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-group-label">SEARCH ADDRESS</label>
                                <div className="input-row">
                                    <div className="search-input-wrapper">
                                        <Search size={18} className="search-icon" />
                                        <input
                                            className="glass-morphism search-input"
                                            placeholder="Search for a place..."
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                                        />
                                    </div>
                                    <button type="button" onClick={handleSearch} className="btn-primary find-btn">
                                        {isSearching ? <Loader className="pulse" size={18} /> : 'Find'}
                                    </button>
                                </div>

                                {searchResults.length > 0 && (
                                    <div className="glass-morphism search-results">
                                        {searchResults.map((result, i) => (
                                            <div
                                                key={i}
                                                onClick={() => selectLocation(result)}
                                                className="search-result-item"
                                            >
                                                {result.display_name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {formData.pos && (
                                    <p className="status-text">
                                        <MapPin size={12} /> Coordinates locked: {formData.pos[0].toFixed(4)}, {formData.pos[1].toFixed(4)}
                                    </p>
                                )}
                            </div>

                            <div className="input-group">
                                <label className="input-group-label">WHEN</label>
                                <div className="form-row">
                                    <div className="form-col-wrapper">
                                        <input
                                            required
                                            type="date"
                                            className="glass-morphism form-input"
                                            value={formData.date}
                                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                    <div className="search-input-wrapper">
                                        <Clock size={18} className="icon-clock" />
                                        <input
                                            required
                                            type="time"
                                            className="glass-morphism form-input form-input-with-icon"
                                            value={formData.time}
                                            onChange={e => setFormData({ ...formData, time: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-group-label">DURATION</label>
                                <div className="icon-row">
                                    {['30m', '1h', '2h', '3h', '4h', '∞'].map(d => (
                                        <button
                                            key={d}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, duration: d })}
                                            className={`duration-button ${formData.duration === d ? 'active' : ''}`}
                                        >
                                            {d === '∞' ? 'Late' : d}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-group-label">ICON</label>
                                <div className="icon-row">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, icon: null })}
                                        className={`icon-button ${!formData.icon ? 'active' : ''}`}
                                    >
                                        <div className="icon-clear">
                                            <div className="icon-clear-line"></div>
                                        </div>
                                    </button>
                                    {ICONS.map(icon => (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, icon })}
                                            className={`icon-button ${formData.icon === icon ? 'active' : ''}`}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="privacy-label">PRIVACY SETTINGS</label>
                                <div className="privacy-row">
                                    {[
                                        { id: 'public', label: 'Public', icon: Globe },
                                        { id: 'all-friends', label: 'Friends', icon: UserCheck },
                                        { id: 'groups', label: 'Groups', icon: Shield },
                                    ].map(p => (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, privacy: p.id })}
                                            className={`privacy-tab ${formData.privacy === p.id ? 'active' : ''}`}
                                        >
                                            <p.icon size={18} />
                                            <span className="privacy-label-text">{p.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {formData.privacy === 'groups' && (
                                <div className="groups-section">
                                    <p className="groups-label">Select target groups:</p>
                                    <div className="groups-list">
                                        {groups.length > 0 ? groups.map(group => (
                                            <button
                                                key={group.id}
                                                type="button"
                                                onClick={() => toggleGroup(group.id)}
                                                className={`group-chip ${formData.targetGroups.includes(group.id) ? 'active' : ''}`}
                                            >
                                                {group.name}
                                            </button>
                                        )) : <p className="no-groups-text">No groups found. Create one first!</p>}
                                    </div>
                                </div>
                            )}

                            <button type="submit" className="btn-primary" style={{ padding: '18px', fontSize: '1.1rem', marginTop: '10px' }}>
                                Post Jam
                            </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
