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

	function createCard(k) {
		return `
			<div class="col-md-6">
				<div class="card shadow-sm h-100">
					<div class="card-body">
						<h5 class="card-title">${k.eloado}</h5>
						<p class="card-text">${new Date(k.datum).toLocaleString()}<br>${k.helyszin}</p>
						<p class="fw-bold">${k.ar.toLocaleString()} Ft</p>
						<button class="btn btn-primary" onclick='hozzaadKosarba(${JSON.stringify(k)})'>Kosárba</button>
					</div>
				</div>
			</div>`;
	}

	function frissitLista(szuro = '') {
		const szurt = koncertek.filter(k =>
			k.eloado.toLowerCase().includes(szuro.toLowerCase())
		);
		lista.innerHTML = szurt.map(createCard).join('');
	}

	frissitLista();
	document.getElementById('kereso').addEventListener('input', e => frissitLista(e.target.value));

	const calendar = new Calendar(document.getElementById('koncertNaptar'), {
		plugins: [dayGridPlugin, listPlugin, bootstrap5Plugin],
		themeSystem: 'bootstrap5',
		locale: huLocale,
		initialView: 'dayGridMonth',
		contentHeight: 'auto',
		displayEventTime: false,
		dayMaxEventRows: true,
		eventDisplay: 'block',
		headerToolbar: {
			left: 'prev,next today',
			center: 'title',
			right: 'dayGridMonth,listWeek'
		},
		buttonIcons: {
			prev: 'arrow-left',
			next: 'arrow-right'
		},
		events: koncertek.map((k, i) => ({
			title: k.eloado,
			start: new Date(k.datum),
			color: szinek[i % szinek.length],
			extendedProps: { helyszin: k.helyszin, ar: k.ar }
		}))
}

