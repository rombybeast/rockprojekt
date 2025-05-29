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
		eventClick(info) {
			mutatModal({
				eloado: info.event.title,
				datum: info.event.start,
				helyszin: info.event.extendedProps.helyszin,
				ar: info.event.extendedProps.ar
			});
		},
		eventDidMount(info) {
			info.el.setAttribute('title', `${info.event.title} – ${info.event.extendedProps.helyszin}`);
		}
	});
	calendar.render();

	const top5 = koncertek.sort((a, b) => b.ar - a.ar).slice(0, 5);
	document.getElementById('legdragabbWidget').innerHTML = `
		<div class="card bg-dark text-white shadow-sm mt-4">
			<div class="card-header border-bottom border-danger">💸 Legdrágább koncertek</div>
			<ul class="list-group list-group-flush">
				${top5.map(k => `
					<li class="list-group-item" style="cursor:pointer" onclick='mutatModal(${JSON.stringify(k)})'>
						<span>${k.eloado}</span>
						<span class="fw-bold">${k.ar.toLocaleString()} Ft</span>
					</li>`).join('')}
			</ul>
		</div>`;

}

window.hozzaadKosarba = function(k) {
	let kosar = JSON.parse(localStorage.getItem('kosar') || '[]');
	kosar.push(k);
	localStorage.setItem('kosar', JSON.stringify(kosar));
	mutatToast(`${k.eloado} koncert hozzáadva a kosárhoz!`);
};
window.hozzaadKosarbaEsZar = function(k) {
	hozzaadKosarba(k);
	const modal = bootstrap.Modal.getInstance(document.getElementById('koncertModal'));
	if (modal) modal.hide();
};
window.mutatModal = function(k) {
	const modalWrap = document.createElement('div');
	modalWrap.innerHTML = `
		<div class="modal fade" id="koncertModal" tabindex="-1">
			<div class="modal-dialog">
				<div class="modal-content bg-dark text-white">
					<div class="modal-header border-bottom border-secondary">
						<h5 class="modal-title">${k.eloado}</h5>
						<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
					</div>
					<div class="modal-body">
						<p><strong>Dátum:</strong> ${new Date(k.datum).toLocaleString()}</p>
						<p><strong>Helyszín:</strong> ${k.helyszin}</p>
						<p><strong>Ár:</strong> ${k.ar.toLocaleString()} Ft</p>
						<button class="btn btn-primary mt-3" onclick='hozzaadKosarbaEsZar(${JSON.stringify(k)})'>Kosárba</button>
					</div>
				</div>
			</div>
		</div>`;
	document.body.appendChild(modalWrap);
	const modal = new bootstrap.Modal(document.getElementById('koncertModal'));
	modal.show();
	document.getElementById('koncertModal').addEventListener('hidden.bs.modal', () => modalWrap.remove());
};

function mutatToast(uzenet) {
	const toastElem = document.createElement('div');
	toastElem.className = 'toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 m-4';
	toastElem.setAttribute('role', 'alert');
	toastElem.innerHTML = `
		<div class="d-flex">
			<div class="toast-body">${uzenet}</div>
			<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
		</div>`;
	document.body.appendChild(toastElem);
	new bootstrap.Toast(toastElem, { delay: 2000 }).show();
  toastElem.addEventListener('hidden.bs.toast', () => toastElem.remove());
}

