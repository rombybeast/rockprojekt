import './style.css';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import huLocale from '@fullcalendar/core/locales/hu';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

async function init() {
	const res = await fetch('http://localhost:3000/api/koncertek');
	const koncertek = await res.json();
	const lista = document.getElementById('koncertLista');
	const szinek = ['#b30000', '#ff0000', '#800000', '#e60026', '#ff4d4d', '#cc0000', '#990000', '#ff3300', '#d11a2a', '#a80000'];



}
