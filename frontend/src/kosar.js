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
