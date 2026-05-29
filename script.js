document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const printBtn = document.getElementById('printBtn');
    const table = document.querySelector('.minha-tabela');
    // O Pandas gera a tabela com a tag <tbody>, vamos focar nela
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const headers = table.querySelectorAll('thead th');
    const counter = document.getElementById('rowCounter');

    // Função para atualizar o contador
    function updateCounter(count) {
        counter.innerHTML = `Mostrando <strong>${count}</strong> inscrito(s)`;
    }

    // --- FUNCIONALIDADE 1: FILTRO DE BUSCA ---
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        let visibleCount = 0;

        rows.forEach(row => {
            // Pega todo o texto da linha (junta nome, cidade, igreja, etc)
            const text = row.textContent.toLowerCase();
            if (text.includes(query)) {
                row.style.display = ''; // Mostra a linha
                visibleCount++;
            } else {
                row.style.display = 'none'; // Esconde a linha
            }
        });
        updateCounter(visibleCount);
    });

    // --- FUNCIONALIDADE 2: ORDENAÇÃO AO CLICAR NA COLUNA ---
    let currentSortColumn = -1;
    let currentSortAsc = true;

    headers.forEach((header, index) => {
        header.addEventListener('click', () => {
            // Remove as setas de todas as colunas
            headers.forEach(h => { h.classList.remove('asc', 'desc'); });

            // Inverte a ordem se clicou na mesma coluna, ou define crescente para nova coluna
            const isAsc = currentSortColumn === index ? !currentSortAsc : true;
            currentSortColumn = index;
            currentSortAsc = isAsc;

            // Adiciona a classe para mostrar a setinha
            header.classList.add(isAsc ? 'asc' : 'desc');

            // Ordena as linhas
            const sortedRows = rows.sort((a, b) => {
                const aText = a.children[index].textContent.trim();
                const bText = b.children[index].textContent.trim();

                // Verifica se é número ou texto para ordenar corretamente
                const aNum = parseFloat(aText.replace(',', '.'));
                const bNum = parseFloat(bText.replace(',', '.'));

                if (!isNaN(aNum) && !isNaN(bNum)) {
                    return isAsc ? aNum - bNum : bNum - aNum;
                }

                // Ordenação alfabética
                return isAsc ? aText.localeCompare(bText) : bText.localeCompare(aText);
            });

            // Limpa o corpo da tabela e adiciona as linhas ordenadas
            tbody.innerHTML = '';
            sortedRows.forEach(row => tbody.appendChild(row));

            // Reaplica o filtro de busca, caso o usuário tenha buscado algo antes de ordenar
            searchInput.dispatchEvent(new Event('input'));
        });
    });

    // --- FUNCIONALIDADE 3: BOTÃO DE IMPRESSÃO / PDF ---
    printBtn.addEventListener('click', function() {
        window.print();
    });

    // Inicializa o contador na primeira vez que abre
    updateCounter(rows.length);
});