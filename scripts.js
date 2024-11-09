function cadastrarMedicamento() {

    const nome = document.getElementById("nome").value;
    const principioAtivo = document.getElementById("principioAtivo").value;
    const concentracao = document.getElementById("concentracao").value;
    const forma = document.getElementById("forma").value;
    const via = document.getElementById("via").value;
    const controlado = document.getElementById("controlado").checked;
    const palavrasChave = document.getElementById("palavrasChave").value.split(',')
        .map(p => p.trim()).filter(p => p);


    if (!nome || !principioAtivo || !concentracao || !forma || !via) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    const medicamento = { nome, principioAtivo, concentracao, forma, via, controlado, palavrasChave };

    let medicamentos = JSON.parse(localStorage.getItem("medicamentos")) || [];
    medicamentos.push(medicamento);

    localStorage.setItem("medicamentos", JSON.stringify(medicamentos));

    document.getElementById("medicamentoForm").reset();
    alert("Medicamento cadastrado com sucesso!");
}

function exibirMedicamentos(medicamentos) {
    const container = document.getElementById("medicamentosContainer");
    container.innerHTML = "";

    medicamentos.forEach(med => {
        const card = document.createElement("div");
        card.className = "medicamento-card";
        card.innerHTML = `
            <h3>${med.nome}</h3>
            <p><strong>Princípio Ativo:</strong> ${med.principioAtivo}</p>
            <p><strong>Concentração:</strong> ${med.concentracao}</p>
            <p><strong>Forma:</strong> ${med.forma}</p>
            <p><strong>Via:</strong> ${med.via}</p>
            <p><strong>Controlado:</strong> ${med.controlado ? "Sim" : "Não"}</p>
            <button onclick="excluirMedicamento('${med.nome}')">Excluir</button>
        `;
        container.appendChild(card);
    });
}

function carregarMedicamentos() {
    const medicamentos = JSON.parse(localStorage.getItem("medicamentos")) || [];
    exibirMedicamentos(medicamentos);
    atualizarDashboard();
}

function filterMedicamentos() {
    const termo = document.getElementById("search").value.toLowerCase().trim();
    const medicamentos = JSON.parse(localStorage.getItem("medicamentos")) || [];

    if (termo === "") {
        exibirMedicamentos(medicamentos);
        return;
    }

    const medicamentosFiltrados = medicamentos.filter(med => {
        const nomeIncluiTermo = med.nome.toLowerCase().includes(termo);
        const palavrasChaveIncluemTermo = med.palavrasChave.some(palavra => palavra.toLowerCase().includes(termo));
        
        return nomeIncluiTermo || palavrasChaveIncluemTermo;
    });

    exibirMedicamentos(medicamentosFiltrados);
}


function excluirMedicamento(nome) {
    let medicamentos = JSON.parse(localStorage.getItem("medicamentos")) || [];

    medicamentos = medicamentos.filter(med => med.nome !== nome);

    localStorage.setItem("medicamentos", JSON.stringify(medicamentos));

    carregarMedicamentos();
    alert("Medicamento excluído com sucesso!");
}

if (window.location.pathname.includes("listagem.html")) {
    document.addEventListener("DOMContentLoaded", carregarMedicamentos);
}

function atualizarDashboard() {
    const medicamentos = JSON.parse(localStorage.getItem("medicamentos")) || [];

    const totalMedicamentos = medicamentos.length;

    const totalControlados = medicamentos.filter(med => med.controlado).length;

    const formasUnicas = new Set(medicamentos.map(med => med.forma));
    const totalFormas = formasUnicas.size;

    document.getElementById("totalMedicamentos").textContent = totalMedicamentos;
    document.getElementById("totalControlados").textContent = totalControlados;
    document.getElementById("totalFormas").textContent = totalFormas;
}
