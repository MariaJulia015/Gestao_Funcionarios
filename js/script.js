class Funcionario {
    constructor(id, nome, idade, cargo, salario) {
        this._id = id;
        this._nome = nome;
        this._idade = idade;
        this._cargo = cargo;
        this._salario = salario;
    }
   
    get id() { return this._id; }
    get nome() { return this._nome; }
    get idade() { return this._idade; }
    get cargo() { return this._cargo; }
    get salario() { return this._salario; }

    set nome(nome) { this._nome = nome; }
    set idade(idade) { this._idade = idade; }
    set cargo(cargo) { this._cargo = cargo; }
    set salario(salario) { this._salario = salario; }

    toString() {
        return `ID: ${this.id} | Nome: ${this.nome} | Idade: ${this.idade} | Cargo: ${this.cargo} | Salário: R$ ${this.salario.toFixed(2)}`;
    }
}

class FuncionarioController {
    constructor() {
        this.funcionarios = []; 
        this.proximoId = 1;
        this.idEdicao = null;   
        this.init();
    }

    init() {
        document.getElementById("formFuncionario").onsubmit = function (event) {
            controller.salvar(event);
        };

        document.getElementById("btnCancelar").onclick = () => this.limparFormulario();

        document.getElementById("btnSalarioMaior5000").onclick = () => this.relatorioSalarioMaior5000();
        document.getElementById("btnMediaSalarial").onclick = () => this.relatorioMediaSalarial();
        document.getElementById("btnCargosUnicos").onclick = () => this.relatorioCargosUnicos();
        document.getElementById("btnNomesMaiusculo").onclick = () => this.relatorioNomesMaiusculo();
    }

    buscarPorId = (id) => this.funcionarios.find(f => f.id === id);

    buscarPorNome = (nome) => this.funcionarios.filter(f => f.nome.toLowerCase().includes(nome.toLowerCase()));

    remover = (id) => { this.funcionarios = this.funcionarios.filter(f => f.id !== id); };

    atualizar = (id, nome, idade, cargo, salario) => {
        const funcionario = this.buscarPorId(id);
        funcionario.nome = nome;
        funcionario.idade = idade;
        funcionario.cargo = cargo;
        funcionario.salario = salario;
        return funcionario;
    };

    salvar(event) {
        event.preventDefault(); 

        let nome = document.getElementById("nome").value.trim();
        let idade = Number(document.getElementById("idade").value);
        let cargo = document.getElementById("cargo").value.trim();
        let salario = Number(document.getElementById("salario").value);

        if (this.idEdicao === null) {
            const funcionario = new Funcionario(this.proximoId++, nome, idade, cargo, salario);
            this.funcionarios.push(funcionario);
            console.log("Funcionário cadastrado:", funcionario.toString());
        } else {
            const funcionario = this.atualizar(this.idEdicao, nome, idade, cargo, salario);
            console.log("Funcionário atualizado:", funcionario.toString());
        }

        this.atualizarTabela();
        this.limparFormulario();
    }

    editar(id) {
        const funcionario = this.buscarPorId(id);
        document.getElementById("nome").value = funcionario.nome;
        document.getElementById("idade").value = funcionario.idade;
        document.getElementById("cargo").value = funcionario.cargo;
        document.getElementById("salario").value = funcionario.salario;

        this.idEdicao = id;
        document.getElementById("btnCadastrar").value = "Salvar alteração";
    }

    excluir(id) {
        const funcionario = this.buscarPorId(id);
        if (confirm(`Deseja excluir o funcionário ${funcionario.nome}?`)) {
            this.remover(id);
            console.log("Funcionário excluído:", funcionario.toString());
            if (this.idEdicao === id) this.limparFormulario();
            this.atualizarTabela();
        }
    }

    atualizarTabela() {
        const tabela = document.getElementById("tabelaFuncionarios");
        tabela.innerHTML = ""; 

        this.funcionarios.forEach((funcionario) => {
            const linha = tabela.insertRow();

            linha.insertCell(0).innerText = funcionario.id;
            linha.insertCell(1).innerText = funcionario.nome;
            linha.insertCell(2).innerText = funcionario.idade;
            linha.insertCell(3).innerText = funcionario.cargo;
            linha.insertCell(4).innerText = "R$ " + funcionario.salario.toFixed(2);

            const btnEditar = document.createElement("button");
            btnEditar.innerHTML = '<i class="bi bi-pencil-square"></i> Editar';
            btnEditar.type = "button";
            btnEditar.className = "btn btn-sm btn-warning me-1";

            const btnExcluir = document.createElement("button");
            btnExcluir.innerHTML = '<i class="bi bi-trash"></i> Excluir';
            btnExcluir.type = "button";
            btnExcluir.className = "btn btn-sm btn-danger";

            const actionCell = linha.insertCell(5);
            actionCell.appendChild(btnEditar);
            actionCell.appendChild(btnExcluir);

            btnEditar.onclick = function () {
                controller.editar(funcionario.id);
            };

            btnExcluir.onclick = () => this.excluir(funcionario.id);
        });
    }

    limparFormulario() {
        document.getElementById("formFuncionario").reset();
        this.idEdicao = null;
        document.getElementById("btnCadastrar").value = "Cadastrar";
    }

    exibirRelatorio(titulo, conteudo) {
        document.getElementById("resultadoRelatorio").innerHTML = `<b>${titulo}</b><br>${conteudo}`;
    }

    relatorioSalarioMaior5000() {
        const lista = this.funcionarios
            .filter(f => f.salario > 5000)
            .map(f => `${f.nome} - R$ ${f.salario.toFixed(2)}`);

        this.exibirRelatorio("Funcionários com salário maior que R$ 5000:",
            lista.length ? lista.join("<br>") : "Nenhum funcionário encontrado.");
    }

    relatorioMediaSalarial() {
        if (this.funcionarios.length === 0) return this.exibirRelatorio("Média salarial:", "Nenhum funcionário cadastrado.");
        const total = this.funcionarios.reduce((soma, f) => soma + f.salario, 0);
        const media = total / this.funcionarios.length;
        this.exibirRelatorio("Média salarial:", "R$ " + media.toFixed(2));
    }

    relatorioCargosUnicos() {
        const cargos = [...new Set(this.funcionarios.map(f => f.cargo))];
        this.exibirRelatorio("Cargos únicos:",
            cargos.length ? cargos.join("<br>") : "Nenhum funcionário cadastrado.");
    }

    relatorioNomesMaiusculo() {
        const nomes = this.funcionarios.map(f => f.nome.toUpperCase());
        this.exibirRelatorio("Nomes em maiúsculo:",
            nomes.length ? nomes.join("<br>") : "Nenhum funcionário cadastrado.");
    }
}

const calcularAumentoAnonima = function (salario, percentual) {
    return salario + salario * percentual / 100;
};

const calcularAumentoArrow = (salario, percentual) => salario + salario * percentual / 100;

console.log("Função anônima:", calcularAumentoAnonima(5000, 10)); 
console.log("Arrow function:", calcularAumentoArrow(5000, 10));  

const controller = new FuncionarioController();
