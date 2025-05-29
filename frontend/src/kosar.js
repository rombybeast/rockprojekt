function betoltKosar() {
	const kosar = JSON.parse(localStorage.getItem('kosar') || '[]');
	const lista = document.getElementById('kosarLista');
	const osszegElem = document.getElementById('vegosszeg');

	if (!kosar.length) {
		lista.innerHTML = '<li class="list-group-item">A kosarad üres.</li>';
		osszegElem.textContent = '0';
		return;
	}

	let osszeg = 0;
	lista.innerHTML = '';

	kosar.forEach((k, i) => {
		osszeg += k.ar;
		const li = document.createElement('li');
		li.className = 'list-group-item d-flex justify-content-between align-items-center';
		li.innerHTML = `
			<span>${k.eloado} – ${k.ar.toLocaleString()} Ft</span>
			<button class="btn btn-sm btn-danger">Törlés</button>
		`;
		li.querySelector('button').onclick = e => {
			e.stopPropagation();
			torlesKosarbol(i);
		};
		li.onclick = () => showModal(k, i);
		lista.appendChild(li);
	});

	osszegElem.textContent = osszeg.toLocaleString();
}
function torlesKosarbol(index) {
	if (confirm("Biztosan törölni szeretnéd ezt a koncertet a kosárból?")) {
		const kosar = JSON.parse(localStorage.getItem('kosar') || '[]');
		kosar.splice(index, 1);
		localStorage.setItem('kosar', JSON.stringify(kosar));
		betoltKosar();
	}
}
function showModal(adat, index) {
	const modalTartalom = document.getElementById('modalTartalom');
	modalTartalom.innerHTML = `
		<p><strong>Előadó:</strong> ${adat.eloado}</p>
		<p><strong>Dátum:</strong> ${new Date(adat.datum).toLocaleString()}</p>
		<p><strong>Helyszín:</strong> ${adat.helyszin}</p>
		<p><strong>Ár:</strong> ${adat.ar.toLocaleString()} Ft</p>
		<button class="btn btn-danger mt-3" id="modalTorlesGomb">Törlés a kosárból</button>
	`;
	setTimeout(() => {
		document.getElementById('modalTorlesGomb')?.addEventListener('click', () => {
			torlesKosarbol(index);
			bootstrap.Modal.getInstance(document.getElementById('koncertModal')).hide();
		});
	}, 10);

	new bootstrap.Modal(document.getElementById('koncertModal')).show();
}
window.addEventListener('DOMContentLoaded', () => {
	betoltKosar();

	const fizetesGomb = document.querySelector('button.btn-success');
	if (!fizetesGomb) return;

	const modalElem = document.getElementById('fizetesModal');
	const modal = new bootstrap.Modal(modalElem);
	const modalBody = modalElem.querySelector('.modal-body');
	const modalTitle = modalElem.querySelector('.modal-title');

	let fizetesSikeres = false;

	fizetesGomb.addEventListener('click', () => {
		const kosar = JSON.parse(localStorage.getItem('kosar') || '[]');
		fizetesSikeres = kosar.length > 0;

		modalTitle.textContent = fizetesSikeres ? 'Fizetés sikeres ✅' : 'Üres a kosarad ❌';
		modalBody.innerHTML = fizetesSikeres
			? `<p>Köszönjük a rendelésed!</p><p>A koncertjegyeket elküldtük az e-mail címedre. Onnan tudod letölteni vagy kinyomtatni őket.</p>`
			: `<p><strong>Jelenleg nincs egyetlen koncert sem a kosaradban.</strong></p><p>Kérjük, válassz legalább egy eseményt a vásárlás folytatásához.</p>`;

		modal.show();
	});
		modalElem.addEventListener('hidden.bs.modal', () => {
		if (fizetesSikeres) {
			localStorage.removeItem('kosar');
			betoltKosar();
		}
	});

	
});

