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
}
