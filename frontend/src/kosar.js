function betoltKosar() {
	const kosar = JSON.parse(localStorage.getItem('kosar') || '[]');
	const lista = document.getElementById('kosarLista');
	const osszegElem = document.getElementById('vegosszeg');

	if (!kosar.length) {
		lista.innerHTML = '<li class="list-group-item">A kosarad üres.</li>';
		osszegElem.textContent = '0';
		return;
	}
